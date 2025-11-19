import { IProduct } from '@/types/api/product-type';
import { CheckCircle } from 'lucide-react';
import { Separator } from './ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

export default function OrderSummary({
  product,
  processingFee,
  total,
}: {
  product: IProduct;
  processingFee: number;
  total: number;
}) {
  return (
    <div className='lg:col-span-1'>
      <div className='sticky top-20'>
        <Card className='border-none shadow-lg'>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='flex gap-4'>
              <img
                src={product.thumbnail}
                alt={product.title}
                className='h-24 w-24 rounded-lg object-cover'
              />
              <div className='flex-1'>
                <h4 className='mb-1 line-clamp-2'>{product.title}</h4>
                <p className='text-sm text-muted-foreground'>by {product.user.full_name}</p>
              </div>
            </div>

            <Separator />

            <div className='space-y-3'>
              <div className='flex justify-between text-sm'>
                <span className='text-muted-foreground'>Product Price</span>
                <span>${product.price.toFixed(2)}</span>
              </div>
              <div className='flex justify-between text-sm'>
                <span className='text-muted-foreground'>Processing Fee</span>
                <span>${processingFee.toFixed(2)}</span>
              </div>
            </div>

            <Separator />

            <div className='flex justify-between items-center'>
              <span className='font-medium'>Total</span>
              <span className='bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-3xl text-transparent'>
                ${total.toFixed(2)}
              </span>
            </div>

            <Separator />

            <div className='rounded-lg bg-linear-to-br from-blue-50 to-purple-50 p-4'>
              <p className='mb-3 font-medium'>What's Included:</p>
              <ul className='space-y-2 text-sm text-muted-foreground'>
                <li className='flex items-center gap-2'>
                  <CheckCircle className='h-4 w-4 text-blue-600' />
                  Instant download access
                </li>
                <li className='flex items-center gap-2'>
                  <CheckCircle className='h-4 w-4 text-blue-600' />
                  Lifetime access
                </li>
                <li className='flex items-center gap-2'>
                  <CheckCircle className='h-4 w-4 text-blue-600' />
                  Free updates forever
                </li>
                <li className='flex items-center gap-2'>
                  <CheckCircle className='h-4 w-4 text-blue-600' />
                  Commercial license
                </li>
              </ul>
            </div>

            <div className='rounded-lg border bg-muted/50 p-4 text-center'>
              <p className='text-sm text-muted-foreground'>🔒 30-day money-back guarantee</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
