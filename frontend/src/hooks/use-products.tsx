import {
  createProduct,
  deleteProduct,
  getMyProducts,
  getProductById,
  getProductBySlug,
  getProducts,
  updateProduct,
} from '@/services/product-service';
import { ProductCreateType, ProductUpdateType } from '@/types/api/product-type';
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
    enabled: !!slug || !!id,
  });

  return {
    product: data?.data,
    isLoading,
  };
};

export const useMyProducts = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['my-products'],
    queryFn: () => getMyProducts(),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
  return {
    products: data?.data,
    isLoading,
  };
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: (data: ProductCreateType) => createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-products'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
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

export const useUpdateProduct = (productId: string) => {
  const qc = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: (data: ProductUpdateType) => updateProduct(productId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['my-products'] });
      qc.invalidateQueries({ queryKey: ['product', productId] });
      qc.invalidateQueries({ queryKey: ['products'] });
    },
    onError: ({ message }) => {
      toast.error(message);
    },
  });

  return {
    updateProduct: mutate,
    isPending,
  };
};
export const useDeleteProduct = () => {
  const qc = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: (productId: string) => deleteProduct(productId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['my-products'] });
      qc.invalidateQueries({ queryKey: ['products'] });
    },
    onError: ({ message }) => {
      toast.error(message);
    },
  });

  return {
    mutate,
    isPending,
  };
};
