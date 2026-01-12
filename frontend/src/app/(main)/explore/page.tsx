'use client';

import { Activity, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useGetProducts } from '@/hooks/use-products';
import { useCategories } from '@/hooks/use-categories';
import { Loader2, Search, SlidersHorizontal } from 'lucide-react';
import { ExploreSkeleton } from '@/components/explore/explore-skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import dynamic from 'next/dynamic';
import { IQueriesProducts } from '@/types/api/product-type';

const ProductCard = dynamic(() => import('@/components/product-card').then((mod) => mod.ProductCard), {
  ssr: false,
});

export default function Explore() {
  const { categories } = useCategories();
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [sortBy, setSortBy] = useState<Required<IQueriesProducts['sortBy']>>('popular');
  const { products, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useGetProducts({
    page: 1,
    limit: 8,
    category: category,
    sortBy,
    search: searchQuery,
  });

  return (
    <div className='min-h-screen bg-linear-to-b from-blue-50 to-white'>
      <div className='container mx-auto px-4 py-8 md:px-6'>
        {/* Header */}
        <div className='mb-8'>
          <h1 className='mb-2 text-lg font-medium'>Explore Digital Products</h1>
          <p className='text-muted-foreground'>
            Discover high-quality digital products from talented creators
          </p>
        </div>

        {/* Filters */}
        <div className='mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between'>
          <div className='relative flex-1 lg:max-w-md bg-white'>
            <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
            <Input
              placeholder='Search products...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='pl-9'
            />
          </div>

          <div className='flex flex-wrap gap-3'>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className='w-45 bg-white'>
                <SlidersHorizontal className='mr-2 h-4 w-4' />
                <SelectValue placeholder='Category' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All Categories</SelectItem>
                {categories?.map((category) => (
                  <SelectItem key={category.id} value={category.name}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={sortBy}
              onValueChange={(value) => setSortBy(value as Required<IQueriesProducts['sortBy']>)}
            >
              <SelectTrigger className='w-45 bg-white'>
                <SelectValue placeholder='Sort by' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='popular'>Most Popular</SelectItem>
                <SelectItem value='rating'>Highest Rated</SelectItem>
                <SelectItem value='price-low'>Price: Low to High</SelectItem>
                <SelectItem value='price-high'>Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results count */}
        <div className='mb-6'>
          <p className='text-sm text-muted-foreground'>
            Showing {products?.length} {products?.length === 1 ? 'product' : 'products'}
          </p>
        </div>

        {/* Products grid */}
        <Activity mode={isLoading ? 'visible' : 'hidden'}>
          <ExploreSkeleton />
        </Activity>

        <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
          {products?.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <Activity mode={products && products.length === 0 ? 'visible' : 'hidden'}>
          <div className='py-20 text-center'>
            <p className='text-muted-foreground'>No products found matching your criteria.</p>
            <Button
              variant='link'
              onClick={() => {
                setSearchQuery('');
                setCategory('all');
              }}
            >
              Clear filters
            </Button>
          </div>
        </Activity>

        <Activity mode={hasNextPage ? 'visible' : 'hidden'}>
          <div className='mt-10 flex justify-center'>
            <Activity mode={!isFetchingNextPage ? 'visible' : 'hidden'}>
              <Button variant='ghost' onClick={() => fetchNextPage()}>
                Load More
              </Button>
            </Activity>

            <Activity mode={isFetchingNextPage ? 'visible' : 'hidden'}>
              <Button size={'icon-sm'} variant={'ghost'}>
                <Loader2 className='size-5 animate-spin' />
              </Button>
            </Activity>
          </div>
        </Activity>
      </div>
    </div>
  );
}
