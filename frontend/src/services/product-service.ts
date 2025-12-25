import { IResponse, IResponsePagination } from '@/types';
import axiosWithConfig from '../lib/axios-config';
import { IProduct, IQueriesProducts, ProductCreateType, ProductUpdateType } from '@/types/api/product-type';
import { AxiosError } from 'axios';
import { checkProperty } from '../lib/utils';

const getProducts = async (queries: IQueriesProducts) => {
  const { limit, page, search, category, sortBy } = queries || {};
  try {
    const params = {
      page: page || 1,
      limit: limit || 10,
      ...(search && { search: search }),
      ...(category && { category: category }),
      ...(sortBy && { sortBy: sortBy }),
    } as IQueriesProducts;

    const response = await axiosWithConfig.get('/api/products', { params });

    return response.data as IResponsePagination<IProduct[]>;
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

const getMyProducts = async () => {
  try {
    const response = await axiosWithConfig.get('/api/products/my-products');
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

const getSimiliarProductsByCategory = async (category: string, productId: string) => {
  try {
    const params = {
      category,
      productId,
    };
    const response = await axiosWithConfig.get('/api/products/similiar', { params });
    return response.data as IResponse<IProduct[]>;
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.code === 'ERR_NETWORK') {
      throw Error(error.message);
    }
    if (error instanceof AxiosError && error.response?.data?.errors) {
      throw Error(error.response.data.errors);
    }
  }
};

const createProduct = async (data: ProductCreateType) => {
  try {
    const formData = new FormData();
    let key: keyof typeof data;
    for (key in data) {
      const value = data[key];
      if (checkProperty(value)) {
        formData.append(key, value);
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
        formData.append(key, value);
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
export {
  getProducts,
  getMyProducts,
  getProductById,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
  getSimiliarProductsByCategory,
};
