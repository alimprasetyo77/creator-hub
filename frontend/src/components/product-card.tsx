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

interface ProductCardProps {
  product: IProduct;
}

export function ProductCard({ product }: ProductCardProps) {
  const { createOrder, isPending } = useCreateOrder();
  const categoryColors: any = {
    'E-Book': 'bg-blue-100 text-blue-700',
    template: 'bg-purple-100 text-purple-700',
    'Ui-Kit': 'bg-pink-100 text-pink-700',
    asset: 'bg-green-100 text-green-700',
    course: 'bg-orange-100 text-orange-700',
  };
  const onClickBuyProduct = async () => {
    createOrder({
      product_id: product.id,
    });
  };

  return (
    <Card className='group  overflow-hidden transition-all hover:shadow-lg py-0 gap-2'>
      <Link href={'/product/' + product.slug} className='cursor-pointer'>
        <div className='relative aspect-5/3 overflow-hidden bg-muted border'>
          <img
            src={product.thumbnail}
            alt={product.title}
            className='h-full w-full object-cover transition-transform duration-300 group-hover:scale-105 '
          />
          {product.featured && (
            <Badge className='absolute right-2 top-2 bg-linear-to-r from-blue-600 to-purple-600 text-white'>
              Featured
            </Badge>
          )}
        </div>

        <CardContent className='px-4 py-2'>
          <div className='mb-2 flex items-center gap-2'>
            <Badge variant='secondary' className={(categoryColors as any)[product.category.name as any]}>
              {product.category.name.replace('-', ' ')}
            </Badge>
            <div className='flex items-center gap-1 text-sm text-muted-foreground'>
              <Star className='h-3.5 w-3.5 fill-yellow-400 text-yellow-400' />
              <span>{product.rating}</span>
            </div>
          </div>

          <h3 className='mb-2 line-clamp-2'>{product.title}</h3>
          <p className='mb-3 line-clamp-2 text-sm text-muted-foreground'>{product.description}</p>

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

        <Button
          size='sm'
          className='bg-linear-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 '
          onClick={onClickBuyProduct}
          disabled={isPending}
        >
          <ShoppingCart className='mr-2 h-4 w-4' />
          Buy Now
        </Button>
      </CardFooter>
    </Card>
  );
}
