'use client';
import StatsCard from '@/components/stats-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useGetMyProducts } from '@/hooks/use-products';
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

export default function Overview() {
  const { myProducts } = useGetMyProducts();
  const monthlyData: any[] = [
    { month: 'May', revenue: 1200, sales: 24 },
    { month: 'Jun', revenue: 1900, sales: 38 },
    { month: 'Jul', revenue: 2400, sales: 48 },
    { month: 'Aug', revenue: 2100, sales: 42 },
    { month: 'Sep', revenue: 2800, sales: 56 },
    { month: 'Oct', revenue: 3200, sales: 64 },
  ];
  return (
    <div className='space-y-6'>
      <div>
        <h2>Creator Dashboard</h2>
        <p className='text-muted-foreground'>Welcome back! Here's your performance overview.</p>
      </div>

      <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-4'>
        <StatsCard
          title='Total Revenue'
          value={`$${999}`}
          icon={<DollarSign className='h-6 w-6 text-blue-600' />}
          trend={{ value: 12.5, isPositive: true }}
        />
        <StatsCard
          title='Total Sales'
          value={99}
          icon={<TrendingUp className='h-6 w-6 text-purple-600' />}
          trend={{ value: 8.2, isPositive: true }}
        />
        <StatsCard
          title='Products'
          value={myProducts?.length || 0}
          icon={<Package className='h-6 w-6 text-blue-600' />}
        />
        <StatsCard
          title='Customers'
          value='1,234'
          icon={<Users className='h-6 w-6 text-purple-600' />}
          trend={{ value: 5.1, isPositive: true }}
        />
      </div>

      <div className='grid gap-6 lg:grid-cols-2'>
        <Card>
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width='100%' height={300}>
              <BarChart data={monthlyData}>
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
              <LineChart data={monthlyData}>
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
            {myProducts?.map((product) => (
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
                <div className='text-right'>
                  <p className='text-sm'>${product.price * product.sales}</p>
                  <p className='text-sm text-muted-foreground'>Revenue</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
