import {
  createProduct,
  deleteProduct,
  getMyProducts,
  getProductById,
  getProductBySlug,
  getProducts,
  getSimiliarProductsByCategory,
  updateProduct,
} from '@/services/product-service';
import { IQueriesProducts, ProductCreateType, ProductUpdateType } from '@/types/api/product-type';
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useDebounce } from './use-debounce';

export const useGetProducts = (queries: IQueriesProducts) => {
  const debouncedSearchQuery = useDebounce({ value: queries.search || '', delay: 500 });

  const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ['products', { ...queries, search: debouncedSearchQuery }],
    initialPageParam: 1,
    queryFn: ({ pageParam }) => getProducts({ ...queries, page: pageParam, search: debouncedSearchQuery }),
    getNextPageParam: (lastPage) => {
      return lastPage.data.hasMore ? lastPage.data.page + 1 : undefined;
    },
    refetchOnWindowFocus: false,
  });
  return {
    products: data?.pages.flatMap((page) => page.data.data),
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
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

export const useSimiliarProducts = (category: string, productId: string) => {
  const { data, isLoading } = useQuery({
    queryKey: ['similiar-products', category, productId],
    queryFn: () => getSimiliarProductsByCategory(category, productId),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    enabled: !!category && !!productId,
  });
  return {
    similiarProducts: data?.data,
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
