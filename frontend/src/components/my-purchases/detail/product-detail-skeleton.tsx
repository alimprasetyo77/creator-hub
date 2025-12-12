import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';

export function ProductDetailSkeleton() {
  return (
    <div className='min-h-screen bg-linear-to-b from-blue-50 to-white'>
      {/* Header Skeleton */}
      <div className='border-b bg-white/50 backdrop-blur-sm'>
        <div className='container mx-auto px-4 py-4 md:px-6'>
          <Skeleton className='h-9 w-40' /> {/* Back Button */}
        </div>
      </div>

      <div className='container mx-auto px-4 py-8 md:px-6'>
        <div className='grid lg:grid-cols-6 gap-8'>
          {/* Main Content - Left Side (3 cols) */}
          <div className='lg:col-span-3 space-y-6'>
            {/* Product Image Skeleton */}
            <Skeleton className='aspect-video w-full rounded-2xl border' />

            {/* Product Header Skeleton */}
            <Card className='border-none shadow-sm'>
              <CardContent className='p-6'>
                <div className='mb-4 flex gap-2'>
                  <Skeleton className='h-6 w-24 rounded-full' />
                  <Skeleton className='h-6 w-24 rounded-full' />
                </div>
                <Skeleton className='mb-4 h-10 w-3/4' /> {/* Title */}
                <div className='flex items-center gap-4'>
                  <Skeleton className='h-6 w-32' /> {/* Rating */}
                  <Skeleton className='h-6 w-24' /> {/* Sales */}
                </div>
              </CardContent>
            </Card>

            {/* Tabs Skeleton */}
            <div className='w-full'>
              <div className='grid w-full grid-cols-2 gap-2 rounded-lg bg-muted p-1'>
                <Skeleton className='h-9 w-full rounded-md' />
                <Skeleton className='h-9 w-full rounded-md' />
              </div>

              <div className='mt-6 space-y-6'>
                <Card className='border-none shadow-sm'>
                  <CardContent className='p-6 space-y-4'>
                    <Skeleton className='h-7 w-48' /> {/* About Title */}
                    <div className='space-y-2'>
                      <Skeleton className='h-4 w-full' />
                      <Skeleton className='h-4 w-full' />
                      <Skeleton className='h-4 w-2/3' />
                    </div>
                    {/* Feature Grid Skeleton */}
                    <div className='mt-8 grid gap-4 sm:grid-cols-2'>
                      {[...Array(4)].map((_, i) => (
                        <Skeleton key={i} className='h-20 w-full rounded-lg' />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* Sidebar - Right Side (2 cols) */}
          <div className='lg:col-span-2 lg:col-start-5'>
            <div className='sticky top-20'>
              <Card className='border-none shadow-lg'>
                <CardContent className='p-6 space-y-6'>
                  <div>
                    <Skeleton className='mb-2 h-10 w-32' /> {/* Price */}
                    <Skeleton className='h-4 w-24' />
                  </div>

                  <div className='space-y-3'>
                    <Skeleton className='h-12 w-full' /> {/* Buy Button */}
                    <Skeleton className='h-12 w-full' /> {/* Wishlist Button */}
                  </div>

                  <div className='space-y-3'>
                    <Skeleton className='h-14 w-full rounded-lg' />
                    <Skeleton className='h-14 w-full rounded-lg' />
                    <Skeleton className='h-14 w-full rounded-lg' />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
