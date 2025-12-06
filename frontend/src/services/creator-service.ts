import axiosWithConfig from '@/lib/axios-config';
import { IResponse } from '@/types';
import {
  CreatePayoutType,
  ICustomerTransactions,
  IOverview,
  IPayout,
  IPayoutSummary,
} from '@/types/api/creator-type';
import { isAxiosError } from 'axios';

const getOverview = async () => {
  try {
    const response = await axiosWithConfig.get('/api/creators/overview');
    return response.data as IResponse<IOverview>;
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

const getCustomerTransactions = async () => {
  try {
    const response = await axiosWithConfig.get('/api/creators/transactions');
    return response.data as IResponse<ICustomerTransactions[]>;
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

const createPayout = async (body: CreatePayoutType) => {
  try {
    const response = await axiosWithConfig.post('/api/creators/payout', body);
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

const getPayoutSummary = async () => {
  try {
    const response = await axiosWithConfig.get('/api/creators/payout-summary');
    return response.data as IResponse<IPayoutSummary>;
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

const getPayoutHistory = async () => {
  try {
    const response = await axiosWithConfig.get('/api/creators/payout-history');
    return response.data as IResponse<IPayout[]>;
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

export { getOverview, getCustomerTransactions, createPayout, getPayoutSummary, getPayoutHistory };
