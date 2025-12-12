import { IResponse } from '@/types';
import axiosWithConfig from '../lib/axios-config';
import { AxiosError } from 'axios';
import { CreateCategoryType, ICategory, UpdateCategoryType } from '@/types/api/category-type';

const getCategories = async () => {
  try {
    const response = await axiosWithConfig.get('/api/categories');
    return response.data as IResponse<ICategory[]>;
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

const createCategory = async (request: CreateCategoryType) => {
  try {
    const response = await axiosWithConfig.post('/api/categories', request);
    return response.data as IResponse<CreateCategoryType>;
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

const updateCategory = async (categoryId: string, request: UpdateCategoryType) => {
  try {
    const response = await axiosWithConfig.put(`/api/categories/${categoryId}`, request);
    return response.data as IResponse<UpdateCategoryType>;
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

const deleteCategory = async (categoryId: string) => {
  try {
    const response = await axiosWithConfig.delete(`/api/categories/${categoryId}`);
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

export { createCategory, getCategories, updateCategory, deleteCategory };
