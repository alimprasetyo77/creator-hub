import prisma from '../utils/prisma';
import { ResponseError } from '../utils/response-error';
import { ChargeType, IChargeErrorResponse, IChargeSuccessResponse } from '../validations/payment-validation';

const charge = async (payload: ChargeType): Promise<IChargeSuccessResponse | IChargeErrorResponse> => {
  let parameter = {
    payment_type: 'bank_transfer',
    bank_transfer: {
      bank: 'permata',
      permata: {
        recipient_name: 'sudarsini',
      },
    },
    transaction_details: {
      order_id: 'H17550',
      gross_amount: 145000,
    },
  };
  const response = await fetch(`${process.env.MIDTRANS_BASE_URL}/charge`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: 'Basic ' + Buffer.from(process.env.MIDTRANS_SERVER_KEY + ':').toString('base64'),
    },
    body: JSON.stringify({
      payment_type: 'qris',
      transaction_details: { order_id: 'order_id-0123', gross_amount: 100000 },
      qris: { acquirer: 'gopay' },
    }),
  });

  const data = await response.json();
  console.log(data);
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

  return data;
};

export default { charge };
