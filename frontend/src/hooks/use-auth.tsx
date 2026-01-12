import { LoginType, RegisterType } from '@/types/api/auth-type';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { login, logout, register } from '@/services/auth-service';
import { useAuth } from '@/contexts/auth-context';

export const useLogin = () => {
  const loginMutation = useMutation({
    mutationFn: (data: LoginType) => login(data),
    onSuccess: ({ message }) => {
      toast.success(message);
    },
    onError: (error) => {
      if (error.message !== 'Email or password is incorrect') {
        toast.error(error.message);
      }
    },
  });

  return {
    login: loginMutation.mutate,
    isLoading: loginMutation.isPending,
  };
};

export const useRegister = () => {
  const registerMutation = useMutation({
    mutationFn: (data: RegisterType) => register(data),
    onSuccess: (data) => {
      toast.success(data.message);
    },
    onError: (error) => {
      if (error.message !== 'Email already exists') {
        toast.error(error.message);
      }
    },
  });

  return {
    register: registerMutation.mutateAsync,
    isLoading: registerMutation.isPending,
  };
};

export const useLogout = () => {
  const { setIsAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const router = useRouter();
  const logoutMutation = useMutation({
    mutationFn: () => logout(),
    onSuccess: () => {
      router.replace('/login');
      queryClient.clear();
      setIsAuthenticated(false);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return {
    logout: logoutMutation.mutate,
  };
};
