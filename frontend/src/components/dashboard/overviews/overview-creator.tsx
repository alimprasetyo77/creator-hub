import StatsCard from '@/components/stats-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useOverviewCreator } from '@/hooks/use-creator';
import { formatIDR } from '@/lib/utils';
import { DollarSign, Package, TrendingUp, Users } from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

export default function OverviewCreator() {
  const { overview, isLoading } = useOverviewCreator();

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
        <h2 className='text-lg font-medium'>Creator Dashboard</h2>
        <p className='text-muted-foreground'>Welcome back! Here's your performance overview.</p>
      </div>

      <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-4'>
        <StatsCard
          title='Total Revenue'
          value={formatIDR(overview?.summary.totalRevenue || 0)}
          icon={<DollarSign className='h-6 w-6 text-blue-600' />}
          trend={{ value: 12.5, isPositive: true }}
        />
        <StatsCard
          title='Total Sales'
          value={overview?.summary.totalSales || 0}
          icon={<TrendingUp className='h-6 w-6 text-purple-600' />}
          trend={{ value: 8.2, isPositive: true }}
        />
        <StatsCard
          title='Products'
          value={overview?.summary.products || 0}
          icon={<Package className='h-6 w-6 text-blue-600' />}
        />
        <StatsCard
          title='Customers'
          value={overview?.summary.customers || 0}
          icon={<Users className='h-6 w-6 text-purple-600' />}
          trend={{ value: 5.1, isPositive: false }}
        />
      </div>

      <div className='grid gap-6 lg:grid-cols-2'>
        <Card>
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width='100%' height={300}>
              <BarChart data={overview?.overview}>
                <CartesianGrid strokeDasharray='3 3' stroke='#e5e7eb' />
                <XAxis dataKey='month' stroke='#6b7280' />
                <YAxis stroke='#6b7280' />
                <Tooltip />
                <Bar dataKey='revenue' fill='url(#colorGradient)' radius={[8, 8, 0, 0]} />
                <defs>
                  <linearGradient id='colorGradient' x1='0' y1='0' x2='0' y2='1'>
                    <stop offset='0%' stopColor='#3b82f6' />
                    <stop offset='100%' stopColor='#8b5cf6' />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sales Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width='100%' height={300}>
              <LineChart data={overview?.overview}>
                <CartesianGrid strokeDasharray='3 3' stroke='#e5e7eb' />
                <XAxis dataKey='month' stroke='#6b7280' />
                <YAxis stroke='#6b7280' />
                <Tooltip />
                <Line
                  type='monotone'
                  dataKey='sales'
                  stroke='#8b5cf6'
                  strokeWidth={3}
                  dot={{ fill: '#8b5cf6', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top Performing Products</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            {overview?.topProducts && overview.topProducts.length > 0 ? (
              overview?.topProducts?.map((product) => (
                <div key={product.id} className='flex items-center gap-4'>
                  <img
                    src={product.thumbnail}
                    alt={product.title}
                    className='h-16 w-16 rounded-lg object-cover'
                  />
                  <div className='flex-1'>
                    <h4 className='text-sm'>{product.title}</h4>
                    <p className='text-sm text-muted-foreground'>{product.sales} sales</p>
                  </div>
                  <div className='flex-1'>
                    <div className='flex items-center justify-between text-sm'>
                      <span className='text-muted-foreground'>Progress</span>
                      <span>{Math.round((product.sales / 500) * 100)}%</span>
                    </div>
                    <Progress value={(product.sales / 500) * 100} className='mt-2' />
                  </div>
                  <div className='text-right w-1/6'>
                    <p className='text-sm'>{formatIDR(product.revenue)}</p>
                    <p className='text-sm text-muted-foreground'>Revenue</p>
                  </div>
                </div>
              ))
            ) : (
              <p className='text-sm text-center text-muted-foreground'>No products found.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
