import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatIDR } from '@/lib/utils';
import { IPayout } from '@/types/api/creator-type';

interface PayoutHistoryTableProps {
  payoutHistory: IPayout[];
}

export default function PayoutHistoryTable({ payoutHistory }: PayoutHistoryTableProps) {
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
                    <Badge variant='default'>{payout.status}</Badge>
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
