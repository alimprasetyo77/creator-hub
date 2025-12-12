'use client';

import { useState } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useGetProducts } from '@/hooks/use-products';
import { ProductCard } from '@/components/product-card';
import { ExploreSkeleton } from '@/components/explore/explore-skeleton';
import { useCategories } from '@/hooks/use-categories';

export default function Explore() {
  const { categories } = useCategories();
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const { products, isLoading } = useGetProducts();

  if (isLoading) {
    return <ExploreSkeleton />;
  }

  if (!products || products?.length === 0) return <div>No products found</div>;

  const filteredProducts = products?.filter((product) => {
    const matchesSearch =
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = category === 'all' || product.category.name === (category as string);
    return matchesSearch && matchesCategory;
  });

  const sortedProducts = [...filteredProducts!].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'popular':
      default:
        return b.sales - a.sales;
    }
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
              <SelectTrigger className='w-[180px] bg-white'>
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
                {/* <SelectItem value='ebook'>E-books</SelectItem>
                <SelectItem value='template'>Templates</SelectItem>
                <SelectItem value='ui-kit'>UI Kits</SelectItem>
                <SelectItem value='asset'>Assets</SelectItem>
                <SelectItem value='course'>Courses</SelectItem> */}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className='w-[180px] bg-white'>
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
            Showing {sortedProducts.length} {sortedProducts.length === 1 ? 'product' : 'products'}
          </p>
        </div>

        {/* Products grid */}
        {sortedProducts.length > 0 ? (
          <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
            {sortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
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
        )}
      </div>
    </div>
  );
}
