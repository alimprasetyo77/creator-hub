import axiosWithConfig from '@/lib/axios-config';
import { IResponse } from '@/types';
import {
  ICategoriesAdmin,
  IOverviewAdmin,
  IPayoutsRequests,
  ITransactionAdmin,
} from '@/types/api/admin-type';
import { isAxiosError } from 'axios';

const getOverviewAdmin = async () => {
  try {
    const response = await axiosWithConfig.get('/api/admin/overview');
    return response.data as IResponse<IOverviewAdmin>;
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

const getTransactionsAdmin = async (page: number, limit: number) => {
  try {
    const response = await axiosWithConfig.get(`/api/admin/transactions?page=${page}&limit=${limit}`);
    return response.data as IResponse<ITransactionAdmin>;
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

const getPayoutsRequests = async () => {
  try {
    const response = await axiosWithConfig.get('/api/admin/payouts-requests');
    return response.data as IResponse<IPayoutsRequests>;
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

const approvePayout = async (id: string) => {
  try {
    const response = await axiosWithConfig.patch(`/api/admin/payouts-requests/${id}/approve`);
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

const rejectPayout = async (id: string) => {
  try {
    const response = await axiosWithConfig.patch(`/api/admin/payouts-requests/${id}/reject`);
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

const getCategoriesAdmin = async () => {
  try {
    const response = await axiosWithConfig.get('/api/admin/categories');
    return response.data as IResponse<ICategoriesAdmin[]>;
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
  getOverviewAdmin,
  getTransactionsAdmin,
  getPayoutsRequests,
  approvePayout,
  rejectPayout,
  getCategoriesAdmin,
};
