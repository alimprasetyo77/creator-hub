import { ProductCardSkeleton } from '../product-card-skeleton';

export function ExploreSkeleton() {
  return (
    <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
      {Array.from({ length: 8 }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
