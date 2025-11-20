import { UserRequest } from '../middlewares/auth-middleware';
import prisma from '../utils/prisma';
import { ResponseError } from '../utils/response-error';
import orderValidation, { CreateOrderType } from '../validations/order-validation';
import { IChargeSuccessResponse } from '../validations/payment-validation';
import { validate } from '../validations/validation';
import paymentService from './payment-service';

const create = async (
  user: UserRequest['user'],
  request: CreateOrderType
): Promise<IChargeSuccessResponse> => {
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
      items: {
        include: {
          product: true,
        },
      },
    },
  });
  const result = await paymentService.charge({
    payment_type: createOrderRequest.payment_type,
    transaction_details: {
      gross_amount: order.totalAmount,
      order_id: order.id,
    },
    ...(createOrderRequest.bank_transfer && { bank_transfer: createOrderRequest.bank_transfer }),
    ...(createOrderRequest.echannel && { echannel: createOrderRequest.echannel }),
    ...(createOrderRequest.qris && { qris: createOrderRequest.qris }),
  });

  return result as IChargeSuccessResponse;
};

const cancel = async (transactionIdOrOrderId: string) => {
  if (!transactionIdOrOrderId) throw new ResponseError(400, 'Transaction or order id is required');
  const result = await paymentService.cancel(transactionIdOrOrderId);
  return result;
};

export default { create, cancel };
