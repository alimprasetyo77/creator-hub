import { Order, OrderItem, OrderPayment, OrderStatus } from '../generated/prisma/client';
import { OrderGetPayload, OrderInclude, OrderWhereUniqueInput } from '../generated/prisma/models';
import { UserRequest } from '../middlewares/auth-middleware';
import { cancelMidtrans, chargeMidtrans, getStatusMidtrans } from '../utils/midtrans';
import prisma from '../utils/prisma';
import { ResponseError } from '../utils/response-error';
import orderValidation, {
  CreateOrderType,
  INotificationSampleRequest,
} from '../validations/order-validation';
import { validate } from '../validations/validation';
import { createHash } from 'crypto';

const get = async (
  transactionIdOrOrderId: string
): Promise<OrderGetPayload<{ include: { paymentInfo: true } }>> => {
  if (!transactionIdOrOrderId) throw new ResponseError(400, 'Transaction or order id is required');
  const order = await prisma.order.findFirst({
    where: {
      OR: [
        {
          id: transactionIdOrOrderId,
        },
        {
          paymentInfo: {
            transactionId: transactionIdOrOrderId,
          },
        },
      ],
    },
    select: {
      id: true,
      orderStatus: true,
      items: {
        select: {
          productId: true,
          price: true,
          quantity: true,
          subtotal: true,
        },
      },
      paymentInfo: {
        select: {
          paymentType: true,
          transactionTime: true,
          transactionStatus: true,
          grossAmount: true,
          vaNumbers: true,
          billKey: true,
          billerCode: true,
          acquirer: true,
          actions: true,
          fraudStatus: true,
        },
      },
    },
  });

  if (!order) throw new ResponseError(404, 'Order not found');
  return order as any;
};

const getAll = async (user: UserRequest['user']): Promise<Order[]> => {
  if (user?.role === 'ADMIN') {
    return prisma.order.findMany({
      include: {
        items: {
          select: {
            product: {
              omit: {
                sales: true,
                rating: true,
                status: true,
                featured: true,
              },
            },
          },
        },
      },
    });
  }
  const orders = await prisma.order.findMany({
    where: {
      userId: user!.id,
    },
    include: {
      items: {
        select: {
          product: {
            omit: {
              sales: true,
              rating: true,
              status: true,
              featured: true,
            },
          },
        },
      },
    },
  });
  return orders.map((order) => ({ ...order, items: order.items.map((item) => item.product) }));
};

const create = async (user: UserRequest['user'], request: CreateOrderType): Promise<{ orderId: string }> => {
  const createOrderRequest = validate(orderValidation.createOrderSchema, request);

  const product = await prisma.product.findUnique({
    where: { id: createOrderRequest.product_id },
  });

  if (!product) throw new ResponseError(404, 'Failed to create order. Product not found.');

  const result = await prisma.$transaction(async (tx) => {
    const order = await tx.order.create({
      data: {
        userId: user!.id,
        orderStatus: 'PENDING',
        items: {
          create: {
            price: product.price,
            productId: product.id,
            quantity: 1,
            subtotal: product.price,
          },
        },
      },
      include: { items: true },
    });

    const midtransData = await chargeMidtrans(createOrderRequest, order);

    if (!midtransData) throw new ResponseError(500, 'Midtrans response invalid.');

    const orderPayment = await tx.orderPayment.create({
      data: {
        orderId: midtransData.order_id,
        transactionId: midtransData.transaction_id,
        midtransOrderId: midtransData.order_id,
        grossAmount: midtransData.gross_amount,
        paymentType: midtransData.payment_type,
        transactionTime: new Date(midtransData.transaction_time),
        transactionStatus: midtransData.transaction_status,

        ...(midtransData.va_numbers && {
          vaNumbers: {
            bank: midtransData.va_numbers[0].bank,
            va_number: midtransData.va_numbers[0].va_number,
          },
        }),

        ...(midtransData.bill_key && { billKey: midtransData.bill_key }),
        ...(midtransData.bill_code && { billerCode: midtransData.bill_code }),
        ...(midtransData.acquirer && { acquirer: midtransData.acquirer }),
        ...(midtransData.actions && {
          actions: {
            name: midtransData.actions[0].name,
            method: midtransData.actions[0].method,
            url: midtransData.actions[0].url,
          },
        }),
        ...(midtransData.fraud_status && {
          fraudStatus: midtransData.fraud_status,
        }),
      },
      select: {
        orderId: true,
      },
    });

    return orderPayment;
  });

  return result;
};

const cancel = async (transactionIdOrOrderId: string): Promise<void> => {
  if (!transactionIdOrOrderId) throw new ResponseError(400, 'Transaction or order id is required');
  await prisma.$transaction(async (tx) => {
    const midtransData = await cancelMidtrans(transactionIdOrOrderId);

    if (!midtransData) throw new ResponseError(500, 'Midtrans response invalid.');

    await tx.order.update({
      where: { id: midtransData.order_id },
      data: {
        orderStatus: 'FAILED',
        paymentInfo: {
          update: {
            transactionStatus: 'cancel',
          },
        },
      },
    });
  });
};

const paymentNotificationHandler = async (
  notification: Partial<INotificationSampleRequest>
): Promise<{ status: number; message: string }> => {
  const { order_id, status_code, gross_amount, signature_key, transaction_status, fraud_status } =
    notification;

  const validSignature = createHash('sha512')
    .update(
      `${order_id ?? ''}${status_code ?? ''}${gross_amount ?? ''}${process.env.MIDTRANS_SERVER_KEY ?? ''}`
    )
    .digest('hex');

  if (signature_key !== validSignature) {
    return { status: 400, message: 'Invalid signature' };
  }

  const order = await prisma.order.findUnique({
    where: { id: order_id },
    include: { paymentInfo: true },
  });

  if (!order) {
    return { status: 200, message: 'Order not found' };
  }

  const updatePaymentStatus = async (status: string) => {
    try {
      await prisma.order.update({
        where: { id: order_id },
        data: {
          orderStatus: status as OrderStatus,
          paymentInfo: {
            update: {
              transactionStatus: transaction_status,
            },
          },
        },
      });
    } catch (error) {
      return { status: 400, message: 'Error updating payment status' };
    }
  };

  switch (transaction_status) {
    case 'capture':
      if (fraud_status === 'accept') {
        await updatePaymentStatus('PAID');
      }
      break;

    case 'settlement':
      await updatePaymentStatus('PAID');
      break;

    case 'pending':
      if (order.orderStatus !== 'PENDING') {
        await updatePaymentStatus('PENDING');
      }
      break;

    case 'deny':
    case 'cancel':
    case 'expire':
      await updatePaymentStatus('FAILED');
      break;

    case 'refund':
      // await updatePaymentStatus('REFUND');
      break;
  }

  return { status: 200, message: 'OK' };
};

export default { get, getAll, create, cancel, paymentNotificationHandler };
