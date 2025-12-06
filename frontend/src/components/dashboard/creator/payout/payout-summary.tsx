import { IPayoutSummary } from '@/types/api/creator-type';
import { Card, CardContent } from '@/components/ui/card';
import { formatIDR } from '@/lib/utils';
import { Clock, DollarSign, Wallet } from 'lucide-react';

interface PayoutSummaryProps {
  payoutSummary: IPayoutSummary;
}
export default function PayoutSummary({ payoutSummary }: PayoutSummaryProps) {
  return (
    <div className='grid gap-6 md:grid-cols-3'>
      <Card>
        <CardContent className='p-6'>
          <div className='mb-2 flex items-center justify-between'>
            <p className='text-sm text-muted-foreground'>Available Balance</p>
            <Wallet className='h-4 w-4 text-muted-foreground' />
          </div>
          <p className='text-3xl'>{formatIDR(payoutSummary?.availableBalance!)}</p>
          <p className='mt-2 text-sm text-green-600'>Ready to withdraw</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className='p-6'>
          <div className='mb-2 flex items-center justify-between'>
            <p className='text-sm text-muted-foreground'>Pending Balance</p>
            <Clock className='h-4 w-4 text-muted-foreground' />
          </div>
          <p className='text-3xl'>{formatIDR(payoutSummary?.pendingBalance!)}</p>
          <p className='mt-2 text-sm text-muted-foreground'>Processing...</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className='p-6'>
          <div className='mb-2 flex items-center justify-between'>
            <p className='text-sm text-muted-foreground'>Total Withdrawn</p>
            <DollarSign className='h-4 w-4 text-muted-foreground' />
          </div>
          <p className='text-3xl'>{formatIDR(payoutSummary?.totalWithdrawal!)}</p>
          <p className='mt-2 text-sm text-muted-foreground'>Lifetime</p>
        </CardContent>
      </Card>
    </div>
  );
}
