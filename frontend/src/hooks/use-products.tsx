import { getProductById, getProductBySlug, getProducts } from '@/lib/services/product-api';
import { useQuery } from '@tanstack/react-query';

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
