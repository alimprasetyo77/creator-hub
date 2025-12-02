import { getOverview } from '@/services/creator-service';
import { useQuery } from '@tanstack/react-query';

export const useOverview = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['overview'],
    queryFn: () => getOverview(),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });
  return {
    overview: data?.data,
    isLoading,
  };
};
