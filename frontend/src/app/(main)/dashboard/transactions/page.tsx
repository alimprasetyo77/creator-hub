'use client';

import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useCustomerTransactions } from '@/hooks/use-creator';

export default function Transactions() {
  const { transactions, isLoading } = useCustomerTransactions();
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
        <h2>Transactions</h2>
        <p className='text-muted-foreground'>View all your sales and transactions</p>
      </div>

      <Card className='p-4'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions?.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>{transaction.title}</TableCell>
                <TableCell>
                  <div>
                    <p className='text-sm'>{transaction.customer.name}</p>
                    <p className='text-sm text-muted-foreground'>{transaction.customer.email}</p>
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
                <TableCell>${transaction.price}</TableCell>
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
      </Card>
    </div>
  );
}
