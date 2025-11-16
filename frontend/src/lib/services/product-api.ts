import { IResponse } from '@/types';
import axiosWithConfig from '../axios-config';
import { IProduct, ProductCreateType, ProductUpdateType } from '@/types/api/product-type';
import { AxiosError } from 'axios';
import { checkProperty } from '../utils';

const getProducts = async () => {
  try {
    const response = await axiosWithConfig.get('/api/products');
    return response.data as IResponse<IProduct[]>;
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
const getProductBySlug = async (slug: string) => {
  try {
    const response = await axiosWithConfig.get(`/api/products/slug/${slug}`);
    return response.data as IResponse<IProduct>;
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.code === 'ERR_NETWORK') {
      throw Error(error.message);
    }
    if (error instanceof AxiosError && error.response?.data?.errors) {
      throw Error(error.response.data.errors);
    }
    throw Error('An unexpected error occurred');
  }
};

const getProductById = async (id: string) => {
  try {
    const response = await axiosWithConfig.get(`/api/products/id/${id}`);
    return response.data as IResponse<IProduct>;
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.code === 'ERR_NETWORK') {
      throw Error(error.message);
    }
    if (error instanceof AxiosError && error.response?.data?.errors) {
      throw Error(error.response.data.errors);
    }
    throw Error('An unexpected error occurred');
  }
};

const createProduct = async (data: ProductCreateType) => {
  try {
    const formData = new FormData();
    let key: keyof typeof data;
    for (key in data) {
      const value = data[key];
      if (checkProperty(value)) {
        // append value; cast to any because FormData accepts string | Blob
        formData.append(key, value as any);
      }
    }
    const response = await axiosWithConfig.post('/api/products', formData);
    return response.data as IResponse<IProduct>;
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.code === 'ERR_NETWORK') {
      throw Error(error.message);
    }
    if (error instanceof AxiosError && error.response?.data?.errors) {
      throw Error(error.response.data.errors);
    }
    throw Error('An unexpected error occurred');
  }
};

const updateProduct = async (id: string, data: ProductUpdateType) => {
  try {
    const formData = new FormData();
    let key: keyof typeof data;
    for (key in data) {
      const value = data[key];
      if (checkProperty(value)) {
        formData.append(key, value as any);
      }
    }
    const response = await axiosWithConfig.put(`/api/products/${id}`, formData);
    return response.data as IResponse<IProduct>;
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.code === 'ERR_NETWORK') {
      throw Error(error.message);
    }
    if (error instanceof AxiosError && error.response?.data?.errors) {
      throw Error(error.response.data.errors);
    }
    throw Error('An unexpected error occurred');
  }
};

const deleteProduct = async (id: string) => {
  try {
    const response = await axiosWithConfig.delete(`/api/products/${id}`);
    return response.data as IResponse<{}>;
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.code === 'ERR_NETWORK') {
      throw Error(error.message);
    }
    if (error instanceof AxiosError && error.response?.data?.errors) {
      throw Error(error.response.data.errors);
    }
    throw Error('An unexpected error occurred');
  }
};
export { getProducts, getProductById, getProductBySlug, createProduct, updateProduct, deleteProduct };
