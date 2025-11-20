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
