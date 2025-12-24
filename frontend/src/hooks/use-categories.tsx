import { createCategory, deleteCategory, getCategories, updateCategory } from '@/services/category-service';
import { CreateCategoryType, UpdateCategoryType } from '@/types/api/category-type';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useCategories = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
    refetchOnWindowFocus: false,
    retry: false,
  });
  return {
    categories: data?.data,
    isLoading,
  };
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: (data: CreateCategoryType) => createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['categories-admin'] });
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

export const useUpdateCategory = (categoryId: string) => {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: (data: UpdateCategoryType) => updateCategory(categoryId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['categories-admin'] });
    },
    onError: ({ message }) => {
      toast.error(message);
    },
  });

  return {
    updateCategory: mutate,
    isPending,
  };
};

export const useDeleteCategory = () => {
  const qc = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: (data: string) => deleteCategory(data),
    onSuccess: ({ message }) => {
      qc.invalidateQueries({ queryKey: ['categories'] });
      qc.invalidateQueries({ queryKey: ['categories-admin'] });
      toast.success(message);
    },
    onError: ({ message }) => {
      toast.error(message);
    },
  });
  return {
    deleteCategory: mutate,
    isPending,
  };
};
