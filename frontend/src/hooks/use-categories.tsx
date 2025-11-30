import { createCategory, getCategories } from '@/services/category-service';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useCategories = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });
  return {
    categories: data?.data,
    isLoading,
  };
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: (name: string) => createCategory(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
    onError: ({ message }) => {
      toast.error(message);
    },
  });

  return {
    createCategory: mutate,
    isPending,
  };
};
