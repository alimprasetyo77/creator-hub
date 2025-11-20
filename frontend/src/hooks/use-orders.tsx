import { createProduct } from '@/lib/services/product-api';
import { ProductCreateType } from '@/types/api/product-type';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: (data: ProductCreateType) => createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-products', 'products', 'product'] });
    },
    onError: ({ message }) => {
      toast.error(message);
    },
  });

  return {
    createProduct: mutate,
    isPending,
  };
};
