import {
  CheckoutOrderType,
  CreateOrderType,
  ICheckoutSuccessResponse,
  ICreateOrderSuccessResponse,
} from '@/types/api/order-type';
import axiosWithConfig from '../lib/axios-config';
import { IResponse } from '@/types';
import { isAxiosError } from 'axios';

const createOrder = async (body: CreateOrderType) => {
  try {
    const response = await axiosWithConfig.post('/api/orders', body);
    return response.data as IResponse<ICreateOrderSuccessResponse>;
  } catch (error) {
    if (isAxiosError(error) && error.code === 'ERR_NETWORK') {
      throw Error(error.message);
    }
    if (isAxiosError(error) && error.response?.data?.errors) {
      throw Error(error.response.data.errors);
    }
    throw Error('An unexpected error occurred');
  }
};

const cancelOrder = async (transactionIdOrOrderId: string) => {
  try {
    const response = await axiosWithConfig.delete(`/api/orders/cancel/${transactionIdOrOrderId}`);
    return response.data as IResponse<{}>;
  } catch (error) {
    if (isAxiosError(error) && error.code === 'ERR_NETWORK') {
      throw Error(error.message);
    }
    if (isAxiosError(error) && error.response?.data?.errors) {
      throw Error(error.response.data.errors);
    }
    throw Error('An unexpected error occurred');
  }
};

const checkoutOrder = async (body: CheckoutOrderType) => {
  try {
    const response = await axiosWithConfig.post('/api/orders/checkout', body);
    return response.data as IResponse<ICheckoutSuccessResponse>;
  } catch (error) {
    if (isAxiosError(error) && error.code === 'ERR_NETWORK') {
      throw Error(error.message);
    }
    if (isAxiosError(error) && error.response?.data?.errors) {
      throw Error(error.response.data.errors);
    }
    throw Error('An unexpected error occurred');
  }
};
export { createOrder, cancelOrder, checkoutOrder };
