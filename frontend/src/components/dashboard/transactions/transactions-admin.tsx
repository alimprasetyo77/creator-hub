import { PaginationCustom } from '@/components/pagination';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useTransactionsAdmin } from '@/hooks/use-admin';
import { formatIDR } from '@/lib/utils';
import { useState } from 'react';

export default function TransactionsAdmin() {
  const { transactions, isLoading } = useTransactionsAdmin();
  const [page, setPage] = useState(1);
  if (isLoading) {
    return <div>Loading...</div>;
  }
  const badgeVariantsForPaymentType = {
    paid: ' bg-green-500 text-white hover:bg-green-600',
    pending: 'border-transparent bg-yellow-500 text-white hover:bg-yellow-600',
    failed: 'bg-red-500 text-white hover:bg-red-600',
    expired: 'bg-gray-500 text-white hover:bg-gray-600',
  };
  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-lg font-medium'>Transactions</h2>
        <p className='text-muted-foreground'>View all platform transactions</p>
      </div>

      <Card className='p-4 '>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Transaction ID</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Buyer</TableHead>
              <TableHead>Creator</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions?.data?.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>{transaction.id}</TableCell>
                <TableCell>{transaction.title}</TableCell>
                <TableCell>
                  <div>
                    <p className='text-sm'>{transaction.buyer.name}</p>
                    <p className='text-sm text-muted-foreground'>{transaction.buyer.email}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p className='text-sm'>{transaction.seller.name}</p>
                    <p className='text-sm text-muted-foreground'>{transaction.seller.email}</p>
                  </div>
                </TableCell>
                <TableCell>
                  {new Date(transaction.createdAt).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'numeric',
                    year: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                  })}
                </TableCell>
                <TableCell>{formatIDR(transaction.price)}</TableCell>
                <TableCell>
                  <Badge
                    className={(badgeVariantsForPaymentType as any)[transaction.orderStatus.toLowerCase()]}
                  >
                    {transaction.orderStatus}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <PaginationCustom page={page} totalPages={transactions?.totalPages || 1} onPageChange={setPage} />
      </Card>
    </div>
  );
}
