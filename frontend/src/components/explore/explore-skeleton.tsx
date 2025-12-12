import { Skeleton } from '@/components/ui/skeleton';
import { ProductCardSkeleton } from '../product-card-skeleton';

export function ExploreSkeleton() {
  return (
    <div className='min-h-screen bg-linear-to-b from-blue-50 to-white'>
      <div className='container mx-auto px-4 py-8 md:px-6'>
        <div className='mb-8 '>
          <Skeleton className='mb-2 h-10 w-64' />
          <Skeleton className='h-5 w-96' />
        </div>

        <div className='mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between'>
          <div className='flex-1 lg:max-w-md '>
            <Skeleton className='h-10 w-full rounded-md ' />
          </div>

          <div className='flex flex-wrap gap-3 '>
            <Skeleton className='h-10 w-[180px] rounded-md ' />
            <Skeleton className='h-10 w-[180px] rounded-md ' />
          </div>
        </div>

        <div className='mb-6'>
          <Skeleton className='h-4 w-32' />
        </div>

        <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
