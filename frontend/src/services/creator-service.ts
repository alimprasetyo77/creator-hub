import axiosWithConfig from '@/lib/axios-config';
import { IResponse } from '@/types';
import { IOverview } from '@/types/api/creator-type';
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

export { getOverview };
