import { OrderGetPayload } from '../generated/prisma/models';
import { CreateOrderType, ICheckoutOrderSuccessResponse } from '../validations/order-validation';
import { ResponseError } from './response-error';
const midtransHeaders = {
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Authorization: 'Basic ' + Buffer.from(process.env.MIDTRANS_SERVER_KEY + ':').toString('base64'),
  },
};

const getStatusMidtrans = async (transactionIdOrOrderId: string): Promise<ICheckoutOrderSuccessResponse> => {
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

const chargeMidtrans = async (
  createOrderRequest: CreateOrderType,
  order: OrderGetPayload<{ include: { items: true } }>
): Promise<ICheckoutOrderSuccessResponse> => {
  const payload = {
    payment_type: createOrderRequest.payment_type,
    transaction_details: {
      gross_amount: order.items[0].subtotal,
      order_id: order.id,
    },
    ...(createOrderRequest.payment_type === 'bank_transfer' &&
      createOrderRequest.bank_transfer && {
        bank_transfer: { bank: createOrderRequest.bank_transfer.bank },
      }),
    ...(createOrderRequest.payment_type === 'echannel' &&
      createOrderRequest.echannel && {
        echannel: {
          bill_info1: createOrderRequest.echannel.bill_info1,
          bill_info2: createOrderRequest.echannel.bill_info2,
          bill_key: createOrderRequest.echannel.bill_key,
        },
      }),
    ...(createOrderRequest.payment_type === 'qris' &&
      createOrderRequest.qris && {
        qris: { acquirer: createOrderRequest.qris.acquirer },
      }),
  };
  const response = await fetch(`${process.env.MIDTRANS_BASE_URL}/charge`, {
    method: 'POST',
    ...midtransHeaders,
    body: JSON.stringify(payload),
  });

  const data = (await response.json()) as ICheckoutOrderSuccessResponse;

  // Validasi error Midtrans
  if (!response.ok || !['200', '201'].includes(data.status_code)) {
    throw new ResponseError(
      Number(data.status_code),
      `Midtrans charge failed: ${data.status_message || 'Unknown error'}`
    );
  }

  return data;
};

const cancelMidtrans = async (transactionIdOrOrderId: string): Promise<ICheckoutOrderSuccessResponse> => {
  if (!transactionIdOrOrderId) throw new ResponseError(400, 'Transaction or order id is required');
  const response = await fetch(`${process.env.MIDTRANS_BASE_URL}/${transactionIdOrOrderId}/cancel`, {
    method: 'POST',
    ...midtransHeaders,
  });

  const data = (await response.json()) as ICheckoutOrderSuccessResponse;
  if (!response.ok || (data.status_code && !['200', '201'].includes(data.status_code))) {
    throw new ResponseError(parseInt(data.status_code), data.status_message || 'Unknown error');
  }

  return data;
};
export { chargeMidtrans, cancelMidtrans, getStatusMidtrans };
