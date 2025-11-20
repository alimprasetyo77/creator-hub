import {
  createProduct,
  getMyProducts,
  getProductById,
  getProductBySlug,
  getProducts,
} from '@/lib/services/product-api';
import { ProductCreateType } from '@/types/api/product-type';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useGetProducts = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
  return {
    products: data?.data,
    isLoading,
  };
};

export const useGetProduct = ({ slug, id }: Partial<{ slug: string; id: string }>) => {
  const { data, isLoading } = useQuery({
    queryKey: ['product', slug, id],
    queryFn: () => (slug ? getProductBySlug(slug) : getProductById(id!)),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  return {
    product: data?.data,
    isLoading,
  };
};

export const useGetMyProducts = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['my-products'],
    queryFn: () => getMyProducts(),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
  return {
    myProducts: data?.data,
    isLoading,
  };
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (data: ProductCreateType) => createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-products', 'products', 'product'] });
    },
    onError: ({ message }) => {
      toast.error(message);
    },
  });

  return {
    createProduct: mutateAsync,
    isPending,
  };
};
