import { useOverviewAdmin } from '@/hooks/use-admin';
import StatsCard from '@/components/stats-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { Activity, DollarSign, Package, TrendingUp, Users } from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { formatIDR } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function OverviewAdmin() {
  const { overview, isLoading } = useOverviewAdmin();
  if (isLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-lg font-medium'>Admin Dashboard</h2>
        <p className='text-muted-foreground'>Platform overview and management</p>
      </div>

      <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-4'>
        <StatsCard
          title='Gross Sales'
          value={formatIDR(overview?.summary.grossSales || 0)}
          icon={<DollarSign className='h-6 w-6 text-blue-600' />}
        />
        <StatsCard
          title='Platform Revenue'
          value={formatIDR(overview?.summary.platformRevenue || 0)}
          icon={<TrendingUp className='h-6 w-6 text-purple-600' />}
        />
        <StatsCard
          title='Total Users'
          value={overview?.summary.totalUsers || 0}
          icon={<Users className='h-6 w-6 text-blue-600' />}
        />
        <StatsCard
          title='Total Products'
          value={overview?.summary.totalProducts || 0}
          icon={<Package className='h-6 w-6 text-purple-600' />}
        />
      </div>

      <div className='grid gap-6 lg:grid-cols-2'>
        <Card>
          <CardHeader>
            <CardTitle>Sales & Platform Revenue</CardTitle>
            <p className='text-sm text-muted-foreground'>
              Blue: Total sales volume • Purple: Platform commission (5%)
            </p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width='100%' height={300}>
              <BarChart data={overview?.overview.salesAndPlatformRevenue}>
                <CartesianGrid strokeDasharray='3 3' stroke='#e5e7eb' />
                <XAxis dataKey='month' stroke='#6b7280' />
                <YAxis stroke='#6b7280' />
                <Tooltip
                  formatter={(value: number, name: string) => {
                    if (name === 'sales') return [`$${value}`, 'Gross Sales'];
                    if (name === 'platform_revenue') return [`$${value}`, 'Platform Revenue'];
                    return [value, name];
                  }}
                />
                <Bar dataKey='grossSales' fill='#3b82f6' radius={[8, 8, 0, 0]} name='Gross Sales' />
                <Bar dataKey='platformRevenue' fill='#8b5cf6' radius={[8, 8, 0, 0]} name='Platform Revenue' />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Products by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width='100%' height={300}>
              <PieChart>
                <Pie
                  data={overview?.overview.productsByCategory}
                  cx='50%'
                  cy='50%'
                  labelLine={false}
                  label={({ category, percent }) => `${category} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill='#8884d8'
                  nameKey={'category'}
                  dataKey='totalProducts'
                >
                  {overview?.overview.productsByCategory.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            {overview?.overview.recentActivities.map((transaction) => (
              <div key={transaction.id} className='flex items-center gap-4'>
                <div className='flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-blue-500/10 to-purple-500/10'>
                  <Activity className='h-5 w-5 text-blue-600' />
                </div>
                <div className='flex-1'>
                  <p className='text-sm'>
                    {transaction.customerName} purchased {transaction.title}
                  </p>
                  <p className='text-sm text-muted-foreground'>
                    {new Date(transaction.createdAt).toLocaleString('id-ID', {
                      day: 'numeric',
                      month: 'numeric',
                      year: 'numeric',
                      hour: 'numeric',
                      minute: 'numeric',
                    })}
                  </p>
                </div>
                <Badge variant='default'>{formatIDR(transaction.price)}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
