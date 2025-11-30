import { IResponse } from '@/types';
import axiosWithConfig from '../lib/axios-config';
import { CategoryType } from '@/types/api/category-type';
import { AxiosError } from 'axios';

const getCategories = async () => {
  try {
    const response = await axiosWithConfig.get('/api/categories');
    return response.data as IResponse<CategoryType[]>;
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

const createCategory = async (name: string) => {
  try {
    const response = await axiosWithConfig.post('/api/categories', { name });
    return response.data as IResponse<CategoryType>;
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

export { createCategory, getCategories };
