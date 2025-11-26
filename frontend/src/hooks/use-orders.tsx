import { cancelOrder, createOrder, getOrder } from '@/services/order-api';
import { CreateOrderType } from '@/types/api/order-type';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useOrder = (orderId: string) => {
  const { data, isLoading } = useQuery({
    queryKey: ['orders', orderId],
    queryFn: () => getOrder(orderId),
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false,
    enabled: !!orderId,
    retry: false,
    refetchInterval: 1000 * 60,
  });

  return {
    order: data?.data,
    isLoading,
  };
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (data: CreateOrderType) => createOrder(data),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
    onError: ({ message }) => {
      toast.error(message);
    },
  });

  return {
    createOrder: mutateAsync,
    isPending,
  };
};

export const useCancelOrder = () => {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: (transactionIdOrOrderId: string) => cancelOrder(transactionIdOrOrderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
    onError: ({ message }) => {
      toast.error(message);
    },
  });

  return {
    cancelOrder: mutate,
    isPending,
  };
};
