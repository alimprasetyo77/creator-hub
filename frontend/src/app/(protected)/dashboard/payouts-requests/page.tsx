'use client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { usePayoutsRequests, useApprovePayout, useRejectPayout } from '@/hooks/use-admin';
import { formatIDR } from '@/lib/utils';
import { AlertCircle, Check, DollarSign, X } from 'lucide-react';

export default function PayoutsRequests() {
  const { payoutsRequests, isLoading } = usePayoutsRequests();
  const { approvePayout, isPending: isApprovePending } = useApprovePayout();
  const { rejectPayout, isPending: isRejectPending } = useRejectPayout();
  const handleApprovePayout = (payoutId: string) => approvePayout(payoutId);
  const handleRejectPayout = (payoutId: string) => rejectPayout(payoutId);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-lg font-medium'>Payout Requests</h2>
          <p className='text-muted-foreground'>Manage creator payout requests</p>
        </div>
      </div>

      <div className='grid gap-6 md:grid-cols-3'>
        <Card>
          <CardContent>
            <div className='flex items-center gap-4'>
              <div className='flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100'>
                <AlertCircle className='h-6 w-6 text-yellow-600' />
              </div>
              <div>
                <p className='text-sm text-muted-foreground'>Pending Requests</p>
                <p className='text-2xl'>{payoutsRequests?.pendingRequest}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <div className='flex items-center gap-4'>
              <div className='flex h-12 w-12 items-center justify-center rounded-full bg-green-100'>
                <Check className='h-6 w-6 text-green-600' />
              </div>
              <div>
                <p className='text-sm text-muted-foreground'>Approved This Month</p>
                <p className='text-2xl'>{payoutsRequests?.successRequest}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <div className='flex items-center gap-4'>
              <div className='flex h-12 w-12 items-center justify-center rounded-full bg-blue-100'>
                <DollarSign className='h-6 w-6 text-blue-600' />
              </div>
              <div>
                <p className='text-sm text-muted-foreground'>Total Paid Out</p>
                <p className='text-2xl'>{formatIDR(payoutsRequests?.totalPaidOut || 0)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className='p-4'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Request ID</TableHead>
              <TableHead>Creator</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className='w-[100px]'>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payoutsRequests?.data.map((request) => (
              <TableRow key={request.id}>
                <TableCell className='font-mono text-sm'>{request.id}</TableCell>
                <TableCell>
                  <div className='flex items-center gap-3'>
                    <Avatar>
                      <AvatarImage src={request.creator.avatar} alt={request.creator.name} />
                      <AvatarFallback>{request.creator.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className='text-sm'>{request.creator.name}</p>
                      <p className='text-sm text-muted-foreground'>{request.creator.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className='text-lg'>{formatIDR(request.amount)}</TableCell>
                <TableCell>{request.method}</TableCell>
                <TableCell>
                  {new Date(request.date).toLocaleString('id-ID', {
                    day: 'numeric',
                    month: 'numeric',
                    year: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                  })}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      request.status === 'approved'
                        ? 'default'
                        : request.status === 'pending'
                        ? 'secondary'
                        : 'outline'
                    }
                  >
                    {request.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {request.status === 'PENDING' && (
                    <div className='flex gap-2'>
                      <Button
                        size='sm'
                        variant='default'
                        disabled={isApprovePending}
                        onClick={() => handleApprovePayout(request.id)}
                      >
                        <Check className='h-4 w-4' />
                      </Button>
                      <Button
                        size='sm'
                        variant='outline'
                        disabled={isRejectPending}
                        onClick={() => handleRejectPayout(request.id)}
                      >
                        <X className='h-4 w-4' />
                      </Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
