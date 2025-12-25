'use client';

import { Star, ShoppingCart } from 'lucide-react';
import { Card, CardContent, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { IProduct } from '@/types/api/product-type';
import Link from 'next/link';
import { formatIDR } from '@/lib/utils';
import { useCreateOrder } from '@/hooks/use-orders';
import Image from 'next/image';
import { useAuth } from '@/contexts/auth-context';
import { toast } from 'sonner';
import { Activity } from 'react';
import categoriesColors from '@/constants/categories-colors';

interface ProductCardProps {
  product: IProduct;
}

export function ProductCard({ product }: ProductCardProps) {
  const { isAuthenticated, user } = useAuth();
  const { createOrder, isPending } = useCreateOrder();
  const isAdmin = user?.role === 'ADMIN';

  const onClickBuyProduct = () => {
    if (isAdmin) return;
    if (!isAuthenticated) {
      toast.info('Please login first to buy this product.');
      return;
    }
    createOrder({
      product_id: product.id,
    });
  };

  return (
    <Card className='group  overflow-hidden transition-all hover:shadow-lg py-0 gap-2'>
      <Link href={'/product/' + product.slug} className='cursor-pointer'>
        <div className='relative overflow-hidden bg-muted border'>
          <Image
            src={product.thumbnail}
            alt={product.title}
            width={600}
            height={300}
            className={`aspect-3/2 ${
              product.category.name === 'e-book' ? 'object-contain' : 'object-cover'
            } object-top transition-transform duration-300 group-hover:scale-105`}
            loading='eager'
          />
          {product.featured && (
            <Badge className='absolute right-2 top-2 bg-linear-to-r from-blue-600 to-purple-600 text-white'>
              Featured
            </Badge>
          )}
        </div>

        <CardContent className='px-4 py-2 h-44 flex flex-col'>
          <div className='mb-2 flex items-center gap-2'>
            <Badge variant='outline' className={categoriesColors[product.category.name]}>
              {product.category.label}
            </Badge>
            <div className='flex items-center gap-1 text-sm text-muted-foreground'>
              <Star className='h-3.5 w-3.5 fill-yellow-400 text-yellow-400' />
              <span>{product.rating || 4.8}</span>
            </div>
          </div>

          <h3 className='mb-2 line-clamp-2'>{product.title}</h3>
          <p className='mb-3 line-clamp-3 text-sm text-muted-foreground grow'>{product.description}</p>

          <div className='flex items-center gap-2'>
            <Avatar className='h-6 w-6'>
              <AvatarImage src={product.user.avatar} alt={product.user.full_name} />
              <AvatarFallback>{product.user.full_name.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className='text-sm text-muted-foreground'>{product.user.full_name}</span>
          </div>
        </CardContent>
      </Link>

      <CardFooter className='flex items-center justify-between border-t p-4'>
        <span className='text-xl'>{formatIDR(product.price)}</span>
        <Activity mode={isAdmin ? 'hidden' : 'visible'}>
          <Button
            size='sm'
            className='bg-linear-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 '
            onClick={onClickBuyProduct}
            disabled={isPending}
          >
            <ShoppingCart className='mr-2 h-4 w-4' />
            Buy Now
          </Button>
        </Activity>
      </CardFooter>
    </Card>
  );
}
