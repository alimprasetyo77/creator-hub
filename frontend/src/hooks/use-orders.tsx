import { cancelOrder, checkoutOrder, createOrder } from '@/services/order-api';
import { CreateOrderType } from '@/types/api/order-type';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (data: CreateOrderType) => createOrder(data),
    onSuccess: async ({ data }) => {
      queryClient.invalidateQueries({ queryKey: ['my-products', 'products', 'product'] });
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
      queryClient.invalidateQueries({ queryKey: ['my-products', 'products', 'product'] });
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
