import axiosWithConfig from '../lib/axios-config';
import { IResponse } from '../types';
import { ChangePasswordType, IUser, ProfileType } from '../types/api/user-type';
import { AxiosError } from 'axios';
import { checkProperty } from '../lib/utils';

const getUser = async () => {
  try {
    const response = await axiosWithConfig.get('/api/users/current');
    return response.data as IResponse<IUser>;
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

const updateUser = async (data: ProfileType) => {
  try {
    const formData = new FormData();
    let key: keyof typeof data;
    for (key in data) {
      const value = data[key];
      if (checkProperty(value)) {
        formData.append(key, value);
      }
    }
    const response = await axiosWithConfig.put('/api/users/current', formData);
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

const changePassword = async (data: ChangePasswordType) => {
  try {
    const response = await axiosWithConfig.patch('/api/users/current/password', data);
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
const deleteUser = async () => {
  try {
    const response = await axiosWithConfig.delete('/api/users/current');
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
export { getUser, updateUser, changePassword, deleteUser };
