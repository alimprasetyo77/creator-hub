import {
  createPayout,
  getCustomerTransactions,
  getOverview,
  getPayoutHistory,
  getPayoutSummary,
} from '@/services/creator-service';
import { CreatePayoutType } from '@/types/api/creator-type';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

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

export const useCustomerTransactions = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['customer-transactions'],
    queryFn: () => getCustomerTransactions(),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });
  return {
    transactions: data?.data,
    isLoading,
  };
};

export const useCreatePayout = () => {
  const qc = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: (data: CreatePayoutType) => createPayout(data),
    onSuccess: ({ message }) => {
      qc.invalidateQueries({ queryKey: ['user'] });
      qc.invalidateQueries({ queryKey: ['payout-history'] });
      qc.invalidateQueries({ queryKey: ['payout-summary'] });
      toast.error(message);
    },
    onError: ({ message }) => {
      toast.error(message);
    },
  });

  return {
    createPayout: mutate,
    isPending,
  };
};

export const usePayoutSummary = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['payout-summary'],
    queryFn: () => getPayoutSummary(),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });
  return {
    payoutSummary: data?.data,
    isLoading,
  };
};

export const usePayoutHistory = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['payout-history'],
    queryFn: () => getPayoutHistory(),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });
  return {
    payoutHistory: data?.data,
    isLoading,
  };
};
