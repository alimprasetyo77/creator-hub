import { CreateCompleteOrderType, CreateOrderType, IOrder } from '@/types/api/order-type';
import axiosWithConfig from '../lib/axios-config';
import { IResponse } from '@/types';
import { isAxiosError } from 'axios';

const getOrder = async (orderId: string) => {
  try {
    const response = await axiosWithConfig.get(`/api/orders/${orderId}`);
    return response.data as IResponse<IOrder>;
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

const createOrder = async (body: CreateOrderType) => {
  try {
    const response = await axiosWithConfig.post('/api/orders', body);
    return response.data as IResponse<{ orderId: string }>;
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
const createCompleteOrder = async (body: CreateCompleteOrderType) => {
  try {
    const response = await axiosWithConfig.post('/api/orders/complete', body);
    return response.data as IResponse<{ orderId: string }>;
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

const cancelOrder = async (orderId: string) => {
  try {
    if (!orderId) throw new Error('Order id is required');
    const response = await axiosWithConfig.post(`/api/orders/cancel/${orderId}`);
    return response.data as IResponse<{ orderId: string }>;
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

export { getOrder, createOrder, createCompleteOrder, cancelOrder };
