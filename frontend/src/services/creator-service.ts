import axiosWithConfig from '@/lib/axios-config';
import { IResponse } from '@/types';
import {
  CreatePayoutType,
  CreateWithdrawalMethodType,
  ICustomerTransactions,
  IOverviewCreator,
  IPayout,
  IPayoutSummary,
  IWithdrawalMethod,
  UpdateWithdrawalMethodType,
} from '@/types/api/creator-type';
import { isAxiosError } from 'axios';

const getOverviewCreator = async () => {
  try {
    const response = await axiosWithConfig.get('/api/creators/overview');
    return response.data as IResponse<IOverviewCreator>;
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
    return response.data as IResponse<ICustomerTransactions>;
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

const getWithdrawalMethods = async () => {
  try {
    const response = await axiosWithConfig.get('/api/creators/withdrawal-methods');
    return response.data as IResponse<IWithdrawalMethod[]>;
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

const createWithdrawalMethod = async (request: CreateWithdrawalMethodType) => {
  try {
    const response = await axiosWithConfig.post('/api/creators/withdrawal-methods', request);
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

const updateWithdrawalMethod = async (withdrawalMethodId: string, request: UpdateWithdrawalMethodType) => {
  try {
    const response = await axiosWithConfig.put(
      `/api/creators/withdrawal-methods/${withdrawalMethodId}`,
      request
    );
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

const setDefaultWidrawalMethod = async (id: string) => {
  try {
    const response = await axiosWithConfig.patch(`/api/creators/set-default-withdrawal-methods/${id}`);
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
const deleteWithdrawalMethod = async (id: string) => {
  try {
    const response = await axiosWithConfig.delete(`/api/creators/withdrawal-methods/${id}`);
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

export {
  getOverviewCreator,
  getCustomerTransactions,
  createPayout,
  getPayoutSummary,
  getPayoutHistory,
  getWithdrawalMethods,
  createWithdrawalMethod,
  updateWithdrawalMethod,
  setDefaultWidrawalMethod,
  deleteWithdrawalMethod,
};
