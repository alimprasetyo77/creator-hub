import {
  createPayout,
  createWithdrawalMethod,
  deleteWithdrawalMethod,
  getCustomerTransactions,
  getOverview,
  getPayoutHistory,
  getPayoutSummary,
  getWithdrawalMethods,
  setDefaultWidrawalMethod,
} from '@/services/creator-service';
import { CreatePayoutType, CreateWithdrawalMethodType } from '@/types/api/creator-type';
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

export const useWithdrawalMethods = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['withdrawal-methods'],
    queryFn: () => getWithdrawalMethods(),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });
  return {
    withdrawalMethods: data?.data,
    isLoading,
  };
};

export const useCreateWithdrawalMethod = () => {
  const qc = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: (data: CreateWithdrawalMethodType) => createWithdrawalMethod(data),
    onSuccess: ({ message }) => {
      qc.invalidateQueries({ queryKey: ['withdrawal-methods'] });
      toast.error(message);
    },
    onError: ({ message }) => {
      toast.error(message);
    },
  });
  return {
    createWithdrawalMethod: mutate,
    isPending,
  };
};

export const useSetDefaultWithdrawalMethod = () => {
  const qc = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: (data: string) => setDefaultWidrawalMethod(data),
    onSuccess: ({ message }) => {
      qc.invalidateQueries({ queryKey: ['withdrawal-methods'] });
      toast.error(message);
    },
    onError: ({ message }) => {
      toast.error(message);
    },
  });
  return {
    setDefaultWidrawalMethod: mutate,
    isPending,
  };
};

export const useDeleteWithdrawalMethod = () => {
  const qc = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: (data: string) => deleteWithdrawalMethod(data),
    onSuccess: ({ message }) => {
      qc.invalidateQueries({ queryKey: ['withdrawal-methods'] });
      toast.error(message);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  return {
    deleteWithdrawalMethod: mutate,
    isPending,
  };
};
