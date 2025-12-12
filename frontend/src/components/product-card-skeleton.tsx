import { Skeleton } from '@/components/ui/skeleton';

export function ProductCardSkeleton() {
  return (
    <div className='flex flex-col space-y-3 rounded-xl border p-4 bg-white'>
      {/* Image Placeholder */}
      <Skeleton className='aspect-video w-full rounded-lg' />

      <div className='space-y-2'>
        {/* Title */}
        <Skeleton className='h-5 w-4/5' />
        {/* Category/Creator */}
        <Skeleton className='h-4 w-1/4' />
      </div>

      <div className='flex items-center justify-between pt-2'>
        {/* Price */}
        <Skeleton className='h-6 w-20' />
        {/* Button */}
        <Skeleton className='h-8 w-24 rounded-md' />
      </div>
    </div>
  );
}
