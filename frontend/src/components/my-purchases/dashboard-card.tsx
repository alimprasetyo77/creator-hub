'use client';
import { IMyDashboardPurchasesInfo } from '@/types/api/user-type';
import { Card, CardContent } from '../ui/card';
import { BanknoteArrowDown, Calendar, Package } from 'lucide-react';
import { formatIDR } from '@/lib/utils';

interface DashboardCardProps {
  dashboardInfo: IMyDashboardPurchasesInfo;
}
export default function DashboardCard({ dashboardInfo }: DashboardCardProps) {
  if (!dashboardInfo) return null;
  return (
    <div className='mb-8 grid gap-6 md:grid-cols-3'>
      <Card className='py-0'>
        <CardContent className='p-6'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm text-muted-foreground'>Total Purchases</p>
              <h3 className='mt-2 text-3xl'>{dashboardInfo?.totalPurchases}</h3>
            </div>
            <div className='flex h-12 w-12 items-center justify-center rounded-lg bg-linear-to-br from-blue-500/10 to-purple-500/10'>
              <Package className='h-6 w-6 text-blue-600' />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className='py-0'>
        <CardContent className='p-6'>
          <div className='flex items-center justify-between '>
            <div className='min-w-0'>
              <p className='text-sm text-muted-foreground'>Total Spent</p>
              <h3 className='mt-2 text-3xl'>{formatIDR(dashboardInfo?.totalSpent as number)}</h3>
            </div>
            <div className='flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-linear-to-br from-blue-500/10 to-purple-500/10'>
              <BanknoteArrowDown className='h-6 w-6 text-purple-600' />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className='py-0'>
        <CardContent className='p-6'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm text-muted-foreground'>Last Purchase</p>
              <h3 className='mt-2'>
                {new Date(dashboardInfo?.lastPurchase || '').toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </h3>
            </div>
            <div className='flex h-12 w-12 items-center justify-center rounded-lg bg-linear-to-br from-blue-500/10 to-purple-500/10'>
              <Calendar className='h-6 w-6 text-blue-600' />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
