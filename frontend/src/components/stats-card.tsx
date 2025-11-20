import { ReactNode } from 'react';
import { Card, CardContent } from './ui/card';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export default function StatsCard({ title, value, icon, trend, className }: StatsCardProps) {
  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardContent className='p-6'>
        <div className='flex items-center justify-between'>
          <div className='flex-1'>
            <p className='text-sm text-muted-foreground'>{title}</p>
            <h3 className='mt-2 text-3xl'>{value}</h3>
            {trend && (
              <p className={cn('mt-2 text-sm', trend.isPositive ? 'text-green-600' : 'text-red-600')}>
                {trend.isPositive ? '+' : ''}
                {trend.value}% from last month
              </p>
            )}
          </div>
          <div className='flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500/10 to-purple-500/10'>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
