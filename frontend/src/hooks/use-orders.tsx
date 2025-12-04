import { cancelOrder, createCompleteOrder, createOrder, getOrder } from '@/services/order-service';
import { CreateCompleteOrderType, CreateOrderType } from '@/types/api/order-type';
import { useMutation, useQuery, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

type OrderResponse = Awaited<ReturnType<typeof getOrder>>;

export function useOrder(
  orderId: string,
  options?: Omit<UseQueryOptions<OrderResponse, Error, OrderResponse, any[]>, 'queryKey' | 'queryFn'>
) {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['order', orderId],
    queryFn: () => getOrder(orderId),
    enabled: !!orderId,
    refetchOnWindowFocus: false,
    retry: false,
    ...options,
  });

  return {
    order: data?.data,
    refetch,
    isLoading,
  };
}

export const useCreateOrder = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: (data: CreateOrderType) => createOrder(data),
    onSuccess: async ({ data }) => {
      queryClient.invalidateQueries({ queryKey: ['orders', data.orderId] });
      queryClient.invalidateQueries({ queryKey: ['my-purchases'] });
      router.replace(`/checkout/${data.orderId}`);
    },
    onError: ({ message }) => {
      toast.error(message);
    },
  });

  return {
    createOrder: mutate,
    isPending,
  };
};
export const useCreateCompleteOrder = () => {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (data: CreateCompleteOrderType) => createCompleteOrder(data),
    onSuccess: ({ data }) => {
      queryClient.invalidateQueries({ queryKey: ['order', data.orderId] });
      queryClient.invalidateQueries({ queryKey: ['my-purchases'] });
    },
    onSettled(data, error, _variables, _onMutateResult, _context) {
      if (error) {
        queryClient.invalidateQueries({ queryKey: ['order', data?.data.orderId] });
        queryClient.invalidateQueries({ queryKey: ['my-purchases'] });
      }
    },
  });

  return {
    createCompleteOrder: mutateAsync,
    isPending,
  };
};

export const useCancelOrder = () => {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (orderId: string) => cancelOrder(orderId),
    onSuccess: ({ data }) => {
      queryClient.invalidateQueries({ queryKey: ['order', data.orderId] });
    },
    onError: ({ message }) => {
      toast.error(message);
    },
  });

  return {
    cancelOrder: mutateAsync,
    isPending,
  };
};
