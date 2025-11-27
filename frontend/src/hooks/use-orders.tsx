import { cancelOrder, createOrder, getOrder } from '@/services/order-api';
import { CreateOrderType } from '@/types/api/order-type';
import { useMutation, useQuery, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { toast } from 'sonner';

type OrderResponse = Awaited<ReturnType<typeof getOrder>>;

export function useOrder(
  orderId: string,
  options?: Omit<UseQueryOptions<OrderResponse, Error, OrderResponse, any[]>, 'queryKey' | 'queryFn'>
): {
  order: OrderResponse['data'] | undefined;
  isLoading: boolean;
} {
  const { data, isLoading } = useQuery({
    queryKey: ['orders', orderId],
    queryFn: () => getOrder(orderId),
    enabled: !!orderId,
    refetchOnWindowFocus: false,
    retry: false,
    ...options,
  });

  return {
    order: data?.data,
    isLoading,
  };
}

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
