'use client';
import PayoutForm from '@/components/dashboard/creator/payout/payout-form';
import { PayoutHistorySkeleton } from '@/components/dashboard/creator/payout/payout-history-skeleton';
import PayoutHistoryTable from '@/components/dashboard/creator/payout/payout-history-table';
import PayoutSummary from '@/components/dashboard/creator/payout/payout-summary';
import { PayoutSummarySkeleton } from '@/components/dashboard/creator/payout/payout-summary-skeleton';
import { usePayoutHistory, usePayoutSummary } from '@/hooks/use-creator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building2, Clock, CreditCard } from 'lucide-react';
import PaymentMethod from '@/components/dashboard/creator/payout/payment-method';
export default function Payouts() {
  const { payoutSummary, isLoading: summaryLoading } = usePayoutSummary();
  const { payoutHistory, isLoading: historyLoading } = usePayoutHistory();

  return (
    <div className='space-y-6'>
      <div>
        <h2>Payouts & Withdrawals</h2>
        <p className='text-muted-foreground'>Manage your earnings and withdraw funds</p>
      </div>
      {summaryLoading ? <PayoutSummarySkeleton /> : <PayoutSummary payoutSummary={payoutSummary!} />}
      <Tabs defaultValue='withdraw'>
        <TabsList className='grid w-full grid-cols-3'>
          <TabsTrigger value='withdraw'>
            <CreditCard className='mr-2 h-4 w-4' />
            Withdraw
          </TabsTrigger>
          <TabsTrigger value='methods'>
            <Building2 className='mr-2 h-4 w-4' />
            Payment Methods
          </TabsTrigger>
          <TabsTrigger value='history'>
            <Clock className='mr-2 h-4 w-4' />
            History
          </TabsTrigger>
        </TabsList>
        <TabsContent value='withdraw'>
          <PayoutForm />
        </TabsContent>
        <TabsContent value='methods'>
          <PaymentMethod />
        </TabsContent>
        <TabsContent value='history'>
          {historyLoading ? <PayoutHistorySkeleton /> : <PayoutHistoryTable payoutHistory={payoutHistory!} />}
        </TabsContent>
      </Tabs>
    </div>
  );
}
