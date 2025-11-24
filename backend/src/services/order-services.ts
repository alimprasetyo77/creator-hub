import { Order, PaymentStatus } from '../generated/prisma/client';
import { OrderWhereUniqueInput } from '../generated/prisma/models';
import { UserRequest } from '../middlewares/auth-middleware';
import prisma from '../utils/prisma';
import { ResponseError } from '../utils/response-error';
import orderValidation, {
  CheckoutType,
  CreateOrderType,
  ICheckoutOrderSuccessResponse,
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

const create = async (user: UserRequest['user'], request: CreateOrderType): Promise<Order> => {
  const createOrderRequest = validate(orderValidation.createOrderSchema, request);

  const product = await prisma.product.findUnique({ where: { id: createOrderRequest.product_id } });

  if (!product) throw new ResponseError(401, 'Failed to create order. Product not found.');

  const order = await prisma.order.create({
    data: {
      userId: user!.id,
      paymentStatus: 'PENDING',
      paymentType: createOrderRequest.payment_type,
      totalAmount: createOrderRequest.total_amount,
      items: {
        create: {
          price: product.price,
          productId: product.id,
          quantity: 1,
          subtotal: product.price,
        },
      },
    },

    include: {
      items: true,
    },
  });

  return order;
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
      data: { paymentStatus: 'FAILED' },
    });
    throw new ResponseError(
      parseInt(data.status_code as string),
      `Midtrans charge failed: ${data.status_message || 'Unknown error'}`
    );
  }

  await prisma.order.update({
    where: { id: data.order_id },
    data: { midtransTransactionId: data.transaction_id, midtransOrderId: data.order_id },
  });
  return data;
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
    data: { paymentStatus: 'FAILED' },
  });
};

const paymentNotificationHandler = async (notification: any): Promise<{ status: number }> => {
  console.log('🔔 Webhook diterima:', notification);

  const { order_id, gross_amount, signature_key, transaction_status, fraud_status } = notification;

  // VALIDASI SIGNATURE (pakai "200" per aturan Midtrans)
  const validSignature = createHash('sha512')
    .update(order_id + '200' + gross_amount + process.env.MIDTRANS_SERVER_KEY)
    .digest('hex');

  if (signature_key !== validSignature) {
    console.log('❌ Signature tidak valid');
    return { status: 200 }; // jangan throw, cukup return
  }

  // Ambil order di DB
  const order = await prisma.order.findUnique({
    where: { id: order_id },
  });

  if (!order) {
    console.log('❌ Order tidak ditemukan:', order_id);
    return { status: 200 };
  }

  // State transitions (idempotent)
  const updatePaymentStatus = async (status: string) => {
    if (order.paymentStatus !== status) {
      await prisma.order.update({
        where: { id: order_id },
        data: { paymentStatus: status as PaymentStatus },
      });
    }
  };

  switch (transaction_status) {
    case 'capture':
      if (fraud_status === 'accept') {
        console.log('✔ Pembayaran kartu kredit berhasil');
        await updatePaymentStatus('PAID');
      }
      break;

    case 'settlement':
      console.log('✔ Pembayaran selesai');
      await updatePaymentStatus('PAID');
      break;

    case 'pending':
      console.log('⌛ Menunggu pembayaran');
      await updatePaymentStatus('PENDING');
      break;

    case 'deny':
    case 'cancel':
    case 'expire':
      console.log('❌ Pembayaran gagal');
      await updatePaymentStatus('FAILED');
      break;

    case 'refund':
      console.log('↩ Dana direfund');
      await updatePaymentStatus('REFUND');
      break;
  }

  return { status: 200 };
};

export default { getAll, create, checkout, cancel, paymentNotificationHandler };
