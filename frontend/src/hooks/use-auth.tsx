import { LoginType, RegisterType } from '@/types/api/auth-type';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
// import { useAuth } from '@/contexts/auth-context';
import { login, logout, register } from '@/lib/services/auth-api';

export const useLogin = () => {
  const router = useRouter();
  const loginMutation = useMutation({
    mutationFn: (data: LoginType) => login(data),
    onSuccess: ({ message }) => {
      toast.success(message);
      router.replace('/');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return {
    login: loginMutation.mutate,
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
  };
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const logoutMutation = useMutation({
    mutationFn: () => logout(),
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ['user'] });
      router.replace('/login');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return {
    logout: logoutMutation.mutate,
  };
};
