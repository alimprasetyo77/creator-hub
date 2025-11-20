import prisma from '../utils/prisma';
import { ResponseError } from '../utils/response-error';
import { ChargeType, IChargeErrorResponse, IChargeSuccessResponse } from '../validations/payment-validation';

const charge = async (payload: ChargeType): Promise<IChargeSuccessResponse | IChargeErrorResponse> => {
  const response = await fetch(`${process.env.MIDTRANS_BASE_URL}/charge`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: 'Basic ' + Buffer.from(process.env.MIDTRANS_SERVER_KEY + ':').toString('base64'),
    },
    body: JSON.stringify(payload),
  });

  const data: IChargeSuccessResponse = await response.json();
  if (!response.ok || (data.status_code && !['200', '201'].includes(data.status_code))) {
    await prisma.order.update({
      where: { id: payload.transaction_details.order_id },
      data: { paymentStatus: 'FAILED' },
    });
    throw new ResponseError(
      parseInt(data.status_code as string),
      `Midtrans charge failed: ${data.status_message || 'Unknown error'}`
    );
  }
  if (data.status_code === '201') {
    await prisma.order.update({
      where: { id: data.order_id },
      data: { midtransTransactionId: data.transaction_id, midtransOrderId: data.order_id },
    });
  }
  return data;
};

const cancel = async (transactionIdOrOrderId: string) => {
  const response = await fetch(`${process.env.MIDTRANS_BASE_URL}/${transactionIdOrOrderId}/cancel`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: 'Basic ' + Buffer.from(process.env.MIDTRANS_SERVER_KEY + ':').toString('base64'),
    },
  });
  const data: IChargeErrorResponse = await response.json();
  if (!response.ok || data.status_code !== '200')
    throw new ResponseError(parseInt(data.status_code), data.status_message || 'Unknown error');

  const order = await prisma.order.findFirst({
    where: {
      OR: [{ midtransTransactionId: transactionIdOrOrderId }, { midtransOrderId: transactionIdOrOrderId }],
    },
  });
  if (!order) throw new ResponseError(404, 'Order not found');

  const result = await prisma.order.update({
    where: {
      id: order.id,
    },
    data: {
      paymentStatus: 'FAILED',
    },
  });
  return result;
};

export default { charge, cancel };
