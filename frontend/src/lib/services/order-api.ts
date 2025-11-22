import { CreateOrderType, IProcessOrderSuccessResponse } from '@/types/api/order-type';
import axiosWithConfig from '../axios-config';
import { IResponse } from '@/types';
import { AxiosError, AxiosResponse } from 'axios';

const createOrder = async (body: CreateOrderType) => {
  try {
    const response = await axiosWithConfig.post('/api/orders', body);
    return response.data as IResponse<IProcessOrderSuccessResponse>;
  } catch (error) {
    if (error instanceof AxiosError && error.code === 'ERR_NETWORK') {
      throw Error(error.message);
    }
    if (error instanceof AxiosError && error.response?.data?.errors) {
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
    if (error instanceof AxiosError && error.code === 'ERR_NETWORK') {
      throw Error(error.message);
    }
    if (error instanceof AxiosError && error.response?.data?.errors) {
      throw Error(error.response.data.errors);
    }
    throw Error('An unexpected error occurred');
  }
};

export { createOrder, cancelOrder };
