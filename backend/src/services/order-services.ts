import { Order, OrderPayment, OrderStatus } from '../generated/prisma/client';
import { OrderWhereUniqueInput } from '../generated/prisma/models';
import { UserRequest } from '../middlewares/auth-middleware';
import prisma from '../utils/prisma';
import { ResponseError } from '../utils/response-error';
import orderValidation, {
  CheckoutType,
  CreateOrderType,
  ICheckoutOrderSuccessResponse,
  INotificationSampleRequest,
} from '../validations/order-validation';
import { validate } from '../validations/validation';
import { createHash } from 'crypto';

const midtransHeaders = {
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Authorization: 'Basic ' + Buffer.from(process.env.MIDTRANS_SERVER_KEY + ':').toString('base64'),
  },
};

const getStatus = async (transactionIdOrOrderId: string): Promise<{}> => {
  if (!transactionIdOrOrderId) throw new ResponseError(400, 'Transaction or order id is required');
  const response = await fetch(`${process.env.MIDTRANS_BASE_URL}/${transactionIdOrOrderId}/status`, {
    method: 'GET',
    ...midtransHeaders,
  });

  const data = (await response.json()) as ICheckoutOrderSuccessResponse;
  if (!response.ok || (data.status_code && !['200', '201'].includes(data.status_code))) {
    throw new ResponseError(parseInt(data.status_code), data.status_message || 'Unknown error');
  }
  return data;
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

const create = async (user: UserRequest['user'], request: CreateOrderType): Promise<OrderPayment> => {
  const createOrderRequest = validate(orderValidation.createOrderSchema, request);

  const product = await prisma.product.findUnique({ where: { id: createOrderRequest.product_id } });

  if (!product) throw new ResponseError(401, 'Failed to create order. Product not found.');

  const order = await prisma.order.create({
    data: {
      userId: user!.id,
      orderStatus: 'PENDING',
      items: {
        create: {
          price: product.price,
          productId: product.id,
          quantity: 1,
          subtotal: product.price * 1,
        },
      },
    },

    include: {
      items: true,
    },
  });
  const checkoutResult = await checkout({
    payment_type: createOrderRequest.payment_type,
    transaction_details: {
      gross_amount: order.items[0].subtotal,
      order_id: order.id,
    },
    ...(createOrderRequest.payment_type === 'bank_transfer' &&
      createOrderRequest.bank_transfer && {
        bank_transfer: { bank: createOrderRequest.bank_transfer?.bank },
      }),
    ...(createOrderRequest.payment_type === 'echannel' &&
      createOrderRequest.echannel && { echannel: { bill_info1: 'bill_info_1', bill_info2: 'bill_info_2' } }),
    ...(createOrderRequest.payment_type === 'qris' &&
      createOrderRequest.qris && { qris: { acquirer: createOrderRequest.qris?.acquirer } }),
  });
  return checkoutResult;
};

const checkout = async (payload: CheckoutType) => {
  const checkoutRequest = validate(orderValidation.checkoutSchema, payload);
  const response = await fetch(`${process.env.MIDTRANS_BASE_URL}/charge`, {
    method: 'POST',
    ...midtransHeaders,
    body: JSON.stringify(checkoutRequest),
  });

  const data = (await response.json()) as ICheckoutOrderSuccessResponse;

  if (!response.ok || (data.status_code && !['200', '201'].includes(data.status_code))) {
    await prisma.order.update({
      where: { id: data.order_id || checkoutRequest.transaction_details.order_id },
      data: { orderStatus: 'FAILED' },
    });
    throw new ResponseError(
      parseInt(data.status_code as string),
      `Midtrans charge failed: ${data.status_message || 'Unknown error'}`
    );
  }

  const orderPayment = await prisma.orderPayment.create({
    data: {
      orderId: data.order_id,
      transactionId: data.transaction_id,
      midtransOrderId: data.order_id,
      grossAmount: data.gross_amount,
      paymentType: data.payment_type,
      transactionTime: new Date(data.transaction_time),
      transactionStatus: data.transaction_status,
      ...(data.va_numbers && {
        vaNumbers: {
          bank: data.va_numbers[0].bank,
          va_number: data.va_numbers[0].va_number,
        },
      }),
      ...(data.bill_key && { billKey: data.bill_key }),
      ...(data.bill_code && { billerCode: data.bill_code }),
      ...(data.acquirer && { acquirer: data.acquirer }),
      ...(data.actions && {
        actions: {
          name: data.actions[0].name,
          method: data.actions[0].method,
          url: data.actions[0].url,
        },
      }),
      ...(data.fraud_status && { fraudStatus: data.fraud_status }),
    },
    omit: {
      vaNumbers: !data.va_numbers,
      billKey: !data.bill_key,
      billerCode: !data.bill_code,
      acquirer: !data.acquirer,
      actions: !data.actions,
      expiryTime: !data.expiry_time || !(data as any).expire_time,
      fraudStatus: !data.fraud_status,
    },
  });
  return orderPayment;
};

const cancel = async (transactionIdOrOrderId: string): Promise<void> => {
  if (!transactionIdOrOrderId) throw new ResponseError(400, 'Transaction or order id is required');
  const response = await fetch(`${process.env.MIDTRANS_BASE_URL}/${transactionIdOrOrderId}/cancel`, {
    method: 'POST',
    ...midtransHeaders,
  });

  const data = (await response.json()) as ICheckoutOrderSuccessResponse;
  if (!response.ok || (data.status_code && !['200', '201'].includes(data.status_code))) {
    throw new ResponseError(parseInt(data.status_code), data.status_message || 'Unknown error');
  }

  await prisma.order.update({
    where: { id: data.order_id || transactionIdOrOrderId },
    data: {
      orderStatus: 'FAILED',
      paymentInfo: {
        update: {
          transactionStatus: 'cancel',
        },
      },
    },
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
    console.log('❌ Invalid signature');
    return { status: 200, message: 'Invalid signature' };
  }

  const order = await prisma.order.findUnique({
    where: { id: order_id },
  });

  if (!order) {
    console.log('❌ Order not found:', order_id);
    return { status: 200, message: 'Order not found' };
  }

  const updatePaymentStatus = async (status: string) => {
    if (order.orderStatus !== status) {
      await prisma.order.update({
        where: { id: order_id },
        data: {
          orderStatus: status as OrderStatus,
        },
      });
      await prisma.orderPayment.update({
        where: { id: order_id },
        data: {
          transactionStatus: transaction_status,
        },
      });
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
      await updatePaymentStatus('PENDING');
      break;

    case 'deny':
    case 'cancel':
    case 'expire':
      console.log('❌ Pembayaran gagal');
      await updatePaymentStatus('FAILED');
      break;

    case 'refund':
      // await updatePaymentStatus('REFUND');
      break;
  }

  return { status: 200, message: 'OK' };
};

export default { getStatus, getAll, create, checkout, cancel, paymentNotificationHandler };
