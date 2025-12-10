import {
  approvePayout,
  getCategoriesAdmin,
  getOverviewAdmin,
  getPayoutsRequests,
  getTransactionsAdmin,
  rejectPayout,
} from '@/services/admin-service';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

const useOverviewAdmin = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['overview'],
    queryFn: () => getOverviewAdmin(),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });
  return {
    overview: data?.data,
    isLoading,
  };
};

const useTransactionsAdmin = (page = 1, limit = 10) => {
  const { data, isLoading } = useQuery({
    queryKey: ['transactions-admin'],
    queryFn: () => getTransactionsAdmin(page, limit),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });
  return {
    transactions: data?.data,
    isLoading,
  };
};

const usePayoutsRequests = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['payouts-requests'],
    queryFn: () => getPayoutsRequests(),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });
  return {
    payoutsRequests: data?.data,
    isLoading,
  };
};

const useApprovePayout = () => {
  const qc = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: (payoutId: string) => approvePayout(payoutId),
    onSuccess: ({ message }) => {
      qc.invalidateQueries({ queryKey: ['payouts-requests'] });
      toast.success(message);
    },
    onError: ({ message }) => {
      toast.error(message);
    },
  });
  return {
    approvePayout: mutate,
    isPending,
  };
};
const useRejectPayout = () => {
  const qc = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: (payoutId: string) => rejectPayout(payoutId),
    onSuccess: ({ message }) => {
      qc.invalidateQueries({ queryKey: ['payouts-requests'] });
      toast.success(message);
    },
    onError: ({ message }) => {
      toast.error(message);
    },
  });
  return {
    rejectPayout: mutate,
    isPending,
  };
};

const useCategoriesAdmin = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['categories-admin'],
    queryFn: () => getCategoriesAdmin(),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });
  return {
    categories: data?.data,
    isLoading,
  };
};

export {
  useOverviewAdmin,
  useTransactionsAdmin,
  usePayoutsRequests,
  useApprovePayout,
  useRejectPayout,
  useCategoriesAdmin,
};
