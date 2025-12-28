import { Order, OrderStatus } from '../generated/prisma/client';
import { UserRequest } from '../middlewares/auth-middleware';
import { cancelMidtrans, chargeMidtrans } from '../utils/midtrans';
import prisma from '../utils/prisma';
import { ResponseError } from '../utils/response-error';
import orderValidation, {
  CreateCompleteOrderType,
  CreateOrderType,
  INotificationSampleRequest,
} from '../validations/order-validation';
import { validate } from '../validations/validation';
import { createHash } from 'crypto';

const get = async (orderId: string): Promise<{}> => {
  if (!orderId) throw new ResponseError(400, 'Transaction or order id is required');
  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
    },
    select: {
      id: true,
      orderStatus: true,
      createdAt: true,
      items: {
        select: {
          product: {
            select: {
              id: true,
              title: true,
              description: true,
              price: true,
              thumbnail: true,
              slug: true,
              category: {
                select: {
                  id: true,
                  name: true,
                },
              },
              user: {
                select: {
                  avatar: true,
                  full_name: true,
                },
              },
            },
          },
          price: true,
          quantity: true,
          fee: true,
          total: true,
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
          expiryTime: true,
        },
      },
    },
  });

  if (!order) throw new ResponseError(404, 'Order not found');

  const response = {
    ...order,
    orderStatus: order.orderStatus.toLowerCase(),
    items: order.items.map((item) => {
      return {
        ...item.product,
        total: item.total,
        fee: item.fee,
      };
    }),
  };
  return response;
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
            fee: true,
            total: true,
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
          fee: true,
          total: true,
        },
      },
    },
  });

  const response = orders.map((order) => ({
    ...order,
    orderStatus: order.orderStatus.toLowerCase(),
    items: order.items.map((item) => {
      return {
        ...item.product,
        total: item.total,
        fee: item.fee,
      };
    }),
  })) as Order[];

  return response;
};

const create = async (user: UserRequest['user'], request: CreateOrderType): Promise<{ orderId: string }> => {
  const createOrderRequest = validate(orderValidation.createOrderSchema, request);
  const product = await prisma.product.findUnique({
    where: { id: createOrderRequest.product_id },
  });

  if (!product) throw new ResponseError(404, 'Failed to create order. Product not found.');
  if (product.userId === user?.id || user?.role !== 'USER')
    throw new ResponseError(400, 'You cannot buy your own product.');

  const orderPending = await prisma.order.findFirst({
    where: {
      userId: user!.id,
      items: { some: { productId: product!.id } },
      orderStatus: 'PENDING',
    },
  });

  if (orderPending) {
    return { orderId: orderPending.id };
  }
  const hasBeenPurchased = await prisma.order.findFirst({
    where: {
      userId: user!.id,
      items: { some: { productId: product!.id } },
      orderStatus: 'PAID',
    },
  });
  if (hasBeenPurchased) {
    throw new ResponseError(400, 'You have already purchased this product.');
  }
  const fee = Math.round(product.price * 0.02);
  const total = product.price + fee;
  const order = await prisma.order.create({
    data: {
      userId: user!.id,
      orderStatus: 'PENDING',

      items: {
        create: {
          price: product!.price,
          productId: product!.id,
          quantity: 1,
          fee: fee,
          total: total,
        },
      },
    },
    select: {
      id: true,
    },
  });

  return { orderId: order.id };
};

const createComplete = async (request: CreateCompleteOrderType): Promise<{ orderId: string }> => {
  const createCompleteOrder = validate(orderValidation.createCompleteOrderSchema, request);
  const result = await prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({
      where: { id: createCompleteOrder.order_id },
      include: { items: true },
    });
    if (!order) throw new ResponseError(404, 'Order not found.');

    const fifteenMinutes = 5 * 60 * 1000;
    const isExpired = new Date(order.createdAt as Date).getTime() + fifteenMinutes < Date.now();
    if (isExpired && order.orderStatus === 'PENDING') {
      await prisma.order.update({
        where: { id: order.id },
        data: { orderStatus: OrderStatus.EXPIRED },
      });
      throw new ResponseError(400, 'Order expired.');
    }

    const midtransData = await chargeMidtrans(createCompleteOrder, order);

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
        ...(midtransData.biller_code && { billerCode: midtransData.biller_code }),
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
        ...(midtransData.expiry_time && {
          expiryTime: new Date(midtransData.expiry_time),
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

const cancel = async (orderId: string): Promise<{ orderId: string }> => {
  if (!orderId) throw new ResponseError(400, 'Transaction or order id is required');

  const result = await prisma.$transaction(async (tx) => {
    const midtransData = await cancelMidtrans(orderId);

    if (!midtransData) throw new ResponseError(500, 'Midtrans response invalid.');

    const oldOrder = await tx.order.update({
      where: { id: midtransData.order_id },
      data: {
        orderStatus: 'FAILED',
        paymentInfo: {
          update: {
            transactionStatus: 'cancel',
          },
        },
      },
      select: {
        userId: true,
        items: {
          select: {
            price: true,
            productId: true,
            quantity: true,
            fee: true,
            total: true,
          },
        },
      },
    });

    const newOrder = await tx.order.create({
      data: {
        userId: oldOrder.userId,
        orderStatus: 'PENDING',
        items: {
          create: {
            price: oldOrder.items[0].price,
            productId: oldOrder.items[0].productId,
            quantity: oldOrder.items[0].quantity,
            fee: oldOrder.items[0].fee,
            total: oldOrder.items[0].total,
          },
        },
      },
      select: {
        id: true,
      },
    });
    return newOrder;
  });
  return { orderId: result.id };
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
    select: {
      orderStatus: true,
      paymentInfo: true,
      items: {
        select: {
          productId: true,
          quantity: true,
          total: true,
          product: {
            select: {
              user: {
                select: {
                  id: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!order) {
    return { status: 200, message: 'Order not found' };
  }

  const updatePaymentStatus = async (status: Order['orderStatus']) => {
    try {
      if (status === 'PAID') {
        await Promise.all([
          prisma.product.update({
            where: { id: order.items[0].productId },
            data: {
              sales: {
                increment: order.items[0].quantity,
              },
            },
          }),
          prisma.user.update({
            where: { id: order.items[0].product.user.id },
            data: {
              balance: {
                increment: order.items[0].total,
              },
            },
          }),
        ]);
      }
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
      await updatePaymentStatus('FAILED');
      break;
    case 'expire':
      await updatePaymentStatus('EXPIRED');
      break;

    case 'refund':
      // await updatePaymentStatus('REFUND');
      break;
  }

  return { status: 200, message: 'OK' };
};

export default {
  get,
  getAll,
  create,
  createComplete,
  cancel,
  paymentNotificationHandler,
};
