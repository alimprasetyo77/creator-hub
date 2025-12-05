'use client';
import PayoutForm from '@/components/dashboard/creator/payout/payout-form';
import { PayoutHistorySkeleton } from '@/components/dashboard/creator/payout/payout-history-skeleton';
import PayoutHistoryTable from '@/components/dashboard/creator/payout/payout-history-table';
import { Card, CardContent } from '@/components/ui/card';

import { useAuth } from '@/contexts/auth-context';
import { usePayoutHistory } from '@/hooks/use-creator';
import { formatIDR } from '@/lib/utils';
import { Clock, DollarSign, Wallet } from 'lucide-react';

export default function Payouts() {
  const { payoutHistory, isLoading } = usePayoutHistory();
  const { user } = useAuth();
  const availableBalance = user?.balance || 0;
  const pendingBalance = 0;
  const totalWithdrawn = 0;
  return (
    <div className='space-y-6'>
      <div>
        <h2>Payouts & Withdrawals</h2>
        <p className='text-muted-foreground'>Manage your earnings and withdraw funds</p>
      </div>
      <div className='grid gap-6 md:grid-cols-3'>
        <Card>
          <CardContent className='p-6'>
            <div className='mb-2 flex items-center justify-between'>
              <p className='text-sm text-muted-foreground'>Available Balance</p>
              <Wallet className='h-4 w-4 text-muted-foreground' />
            </div>
            <p className='text-3xl'>{formatIDR(availableBalance)}</p>
            <p className='mt-2 text-sm text-green-600'>Ready to withdraw</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className='p-6'>
            <div className='mb-2 flex items-center justify-between'>
              <p className='text-sm text-muted-foreground'>Pending Balance</p>
              <Clock className='h-4 w-4 text-muted-foreground' />
            </div>
            <p className='text-3xl'>{formatIDR(pendingBalance)}</p>
            <p className='mt-2 text-sm text-muted-foreground'>Processing...</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className='p-6'>
            <div className='mb-2 flex items-center justify-between'>
              <p className='text-sm text-muted-foreground'>Total Withdrawn</p>
              <DollarSign className='h-4 w-4 text-muted-foreground' />
            </div>
            <p className='text-3xl'>{formatIDR(totalWithdrawn)}</p>
            <p className='mt-2 text-sm text-muted-foreground'>Lifetime</p>
          </CardContent>
        </Card>
      </div>
      <PayoutForm />
      {isLoading ? <PayoutHistorySkeleton /> : <PayoutHistoryTable payoutHistory={payoutHistory!} />}
    </div>
  );
}
