import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';

export function PayoutHistorySkeleton() {
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
            {[1, 2, 3, 4].map((i) => (
              <TableRow key={i}>
                <TableCell>
                  <Skeleton className='w-24 h-4' />
                </TableCell>
                <TableCell>
                  <Skeleton className='w-16 h-4' />
                </TableCell>
                <TableCell>
                  <Skeleton className='w-20 h-4' />
                </TableCell>
                <TableCell>
                  <Skeleton className='w-28 h-4' />
                </TableCell>
                <TableCell>
                  <Skeleton className='w-20 h-6 rounded-md' />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
