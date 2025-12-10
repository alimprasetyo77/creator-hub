'use client';
import { formatIDR } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { usePayoutHistory } from '@/hooks/use-creator';
import { PayoutHistorySkeleton } from './payout-history-skeleton';

export default function PayoutHistoryTable() {
  const { payoutHistory, isLoading: historyLoading } = usePayoutHistory();

  const badgeVariantsForPayoutType = {
    success: ' bg-green-500 text-white hover:bg-green-600',
    pending: 'border-transparent bg-yellow-500 text-white hover:bg-yellow-600',
    failed: 'bg-red-500 text-white hover:bg-red-600',
    rejected: 'bg-gray-500 text-white hover:bg-gray-600',
  };

  return historyLoading ? (
    <PayoutHistorySkeleton />
  ) : (
    <Card>
      <CardHeader className='gap-0'>
        <CardTitle>Payout History</CardTitle>
        <p className='text-sm text-muted-foreground mt-1'>View all your completed and pending withdrawals</p>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Payout ID</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payoutHistory && payoutHistory?.length > 0 ? (
              payoutHistory?.map((payout) => (
                <TableRow key={payout.id}>
                  <TableCell className='font-mono text-sm'>{payout.id}</TableCell>
                  <TableCell className='text-sm'>{formatIDR(payout.amount)}</TableCell>
                  <TableCell className='text-sm'>{payout.method.name}</TableCell>
                  <TableCell className='text-sm'>
                    {new Date(payout.date).toLocaleString('id-ID', {
                      day: 'numeric',
                      month: 'numeric',
                      year: 'numeric',
                      hour: 'numeric',
                      minute: 'numeric',
                    })}
                  </TableCell>
                  <TableCell>
                    <Badge className={(badgeVariantsForPayoutType as any)[payout.status.toLowerCase()]}>
                      {payout.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className='h-24 text-center'>
                  No payouts found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
