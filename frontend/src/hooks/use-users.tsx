import { ProfileType, IUser, ChangePasswordType } from '@/types/api/user-type';
import { IResponse } from '@/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { changePassword, deleteUser, getMyPurchases, getUser, updateUser } from '@/services/user-api';
import { toast } from 'sonner';

interface IOptionsProps {
  onSuccess?: (data: any) => void;
  onError?: (err: any) => void;
  enabled?: boolean;
}

export const useMyPurchases = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['my-purchases'],
    queryFn: () => getMyPurchases(),
    retry: false,
    refetchOnWindowFocus: false,
  });
  return {
    myPurchases: data?.data,
    isLoading,
    error,
  };
};
export const useGetUser = (options?: IOptionsProps) => {
  const { data, isLoading, error } = useQuery<IResponse<IUser>, AxiosError>({
    queryKey: ['user'],
    queryFn: getUser,
    retry: false,
    refetchOnWindowFocus: false,
    ...options,
  });
  return {
    data: data?.data,
    isLoading,
    error,
  };
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<IResponse<{}>, AxiosError, ProfileType>({
    mutationFn: updateUser,
    onSuccess: ({ message }) => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
      toast.success(message);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  return {
    updateUser: mutation.mutate,
  };
};

export const useChangePassword = (options?: IOptionsProps) => {
  const mutation = useMutation<IResponse<{}>, AxiosError, ChangePasswordType>({
    mutationFn: changePassword,
    ...options,
  });
  return {
    changePassword: mutation.mutate,
  };
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<IResponse<{}>, AxiosError>({
    mutationFn: () => deleteUser(),
    onSuccess: ({ message }) => {
      queryClient.removeQueries({ queryKey: ['user'] });
      toast.success(message);
      setTimeout(() => window.location.replace('/login'), 1000);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  return {
    deleteUser: mutation.mutate,
  };
};
