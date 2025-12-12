import axiosWithConfig from '../lib/axios-config';
import { LoginType, RegisterType } from '../types/api/auth-type';
import { IResponse } from '../types';

const login = async (data: LoginType) => {
  try {
    const response = await axiosWithConfig.post('/api/users/login', data);
    return response.data as IResponse<{
      role: string;
      token: string;
    }>;
  } catch (error: any) {
    if (error.code === 'ERR_NETWORK') {
      throw Error(error.message);
    }
    throw Error(error.response.data.errors);
  }
};
const register = async (data: RegisterType) => {
  try {
    const response = await axiosWithConfig.post('/api/users/register', data);
    return response.data as IResponse<{}>;
  } catch (error: any) {
    if (error.code === 'ERR_NETWORK') {
      throw Error(error.message);
    }
    throw Error(error.response.data.errors);
  }
};

const logout = async () => {
  try {
    const response = await axiosWithConfig.delete('/api/users/logout');
    return response.data as IResponse<{}>;
  } catch (error: any) {
    if (error.code === 'ERR_NETWORK') {
      throw Error(error.message);
    }
    throw Error(error.response.data.errors);
  }
};

export { login, register, logout };
