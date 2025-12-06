import { formatIDR } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { IPayout } from '@/types/api/creator-type';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface PayoutHistoryTableProps {
  payoutHistory: IPayout[];
}

export default function PayoutHistoryTable({ payoutHistory }: PayoutHistoryTableProps) {
  const badgeVariantsForPayoutType = {
    success: ' bg-green-500 text-white hover:bg-green-600',
    pending: 'border-transparent bg-yellow-500 text-white hover:bg-yellow-600',
    failed: 'bg-red-500 text-white hover:bg-red-600',
    rejected: 'bg-gray-500 text-white hover:bg-gray-600',
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payout History</CardTitle>
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
            {payoutHistory?.length > 0 ? (
              payoutHistory?.map((payout: any) => (
                <TableRow key={payout.id}>
                  <TableCell className='font-mono text-sm'>{payout.id}</TableCell>
                  <TableCell className='text-sm'>{formatIDR(payout.amount)}</TableCell>
                  <TableCell className='text-sm'>{payout.method}</TableCell>
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
