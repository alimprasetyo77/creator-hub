import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function PayoutSummarySkeleton() {
  return (
    <div className='grid gap-6 md:grid-cols-3'>
      {/* Card 1 */}
      <Card>
        <CardContent className='p-6'>
          <div className='mb-2 flex items-center justify-between'>
            <Skeleton className='h-4 w-32' />
            <Skeleton className='h-4 w-4 rounded-full' />
          </div>
          <Skeleton className='h-8 w-40' />
          <Skeleton className='mt-2 h-4 w-28' />
        </CardContent>
      </Card>

      {/* Card 2 */}
      <Card>
        <CardContent className='p-6'>
          <div className='mb-2 flex items-center justify-between'>
            <Skeleton className='h-4 w-32' />
            <Skeleton className='h-4 w-4 rounded-full' />
          </div>
          <Skeleton className='h-8 w-40' />
          <Skeleton className='mt-2 h-4 w-24' />
        </CardContent>
      </Card>

      {/* Card 3 */}
      <Card>
        <CardContent className='p-6'>
          <div className='mb-2 flex items-center justify-between'>
            <Skeleton className='h-4 w-32' />
            <Skeleton className='h-4 w-4 rounded-full' />
          </div>
          <Skeleton className='h-8 w-40' />
          <Skeleton className='mt-2 h-4 w-20' />
        </CardContent>
      </Card>
    </div>
  );
}
