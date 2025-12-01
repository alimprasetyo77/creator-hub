import { Skeleton } from '@/components/ui/skeleton';

export default function MyPurchasesSkeleton() {
  return (
    <div className='min-h-screen bg-linear-to-b from-blue-50 to-white'>
      <div className='container mx-auto px-4 py-8 md:px-6'>
        {/* Header */}
        <div className='mb-8'>
          <Skeleton className='h-8 w-40 mb-2' />
          <Skeleton className='h-4 w-64' />
        </div>

        {/* Stats Section */}
        <div className='mb-8 grid gap-6 md:grid-cols-3'>
          {[1, 2, 3].map((i) => (
            <div key={i} className='bg-white rounded-lg shadow p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <Skeleton className='h-4 w-24 mb-3' />
                  <Skeleton className='h-8 w-20' />
                </div>
                <Skeleton className='h-12 w-12 rounded-lg' />
              </div>
            </div>
          ))}
        </div>

        {/* Purchase List Skeleton */}
        {[1, 2, 3].map((i) => (
          <div key={i} className='bg-white rounded-lg shadow overflow-hidden mb-4'>
            <div className='p-6 flex flex-col gap-4 md:flex-row md:items-center'>
              {/* Thumbnail */}
              <Skeleton className='h-32 w-32 rounded-lg' />

              <div className='flex-1'>
                {/* Category + Date */}
                <div className='flex items-center gap-2 mb-3'>
                  <Skeleton className='h-5 w-20' />
                  <Skeleton className='h-4 w-32' />
                </div>

                {/* Title */}
                <Skeleton className='h-6 w-56 mb-2' />
                {/* Description */}
                <Skeleton className='h-4 w-full mb-2' />
                <Skeleton className='h-4 w-2/3' />

                {/* Author */}
                <Skeleton className='h-4 w-32 mt-3' />
              </div>

              {/* Price + Buttons */}
              <div className='flex flex-col gap-2 md:items-end'>
                <Skeleton className='h-8 w-24' />
                <div className='flex gap-2'>
                  <Skeleton className='h-10 w-28 rounded-lg' />
                  <Skeleton className='h-10 w-28 rounded-lg' />
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Bottom Loader */}
        <div className='mt-10 flex flex-col items-center justify-center'>
          <Skeleton className='h-6 w-6 rounded-full' />
          <span className='mt-2 text-gray-400 text-sm'>Loading more...</span>
        </div>
      </div>
    </div>
  );
}
