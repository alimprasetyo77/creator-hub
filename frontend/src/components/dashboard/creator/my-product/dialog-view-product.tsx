import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { formatIDR } from '@/lib/utils';
import { IProduct } from '@/types/api/product-type';
import { Edit } from 'lucide-react';

interface IDialogViewProductProps {
  viewProduct: IProduct | null;
  setViewProduct: React.Dispatch<React.SetStateAction<IProduct | null>>;
  onNavigateEdit: (product: IProduct) => void;
}

export default function DialogViewProduct({
  viewProduct,
  setViewProduct,
  onNavigateEdit,
}: IDialogViewProductProps) {
  return (
    <Dialog open={viewProduct !== null} onOpenChange={() => setViewProduct(null)}>
      <DialogContent className='max-w-2xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>Product Details</DialogTitle>
          <DialogDescription>Complete information about your product.</DialogDescription>
        </DialogHeader>
        <div className='space-y-6'>
          <div className='relative h-48 w-full overflow-hidden rounded-lg'>
            <img
              src={viewProduct?.thumbnail}
              alt={viewProduct?.title}
              className='h-full w-full object-cover'
            />
          </div>

          <div className='space-y-4'>
            <div>
              <Label>Product Title</Label>
              <p className='mt-1'>{viewProduct?.title}</p>
            </div>

            <div className='grid gap-4 md:grid-cols-3'>
              <div>
                <Label>Category</Label>
                <div className='mt-1'>
                  <Badge variant='secondary'>{viewProduct?.category.name}</Badge>
                </div>
              </div>

              <div>
                <Label>Status</Label>
                <div className='mt-1'>
                  <Badge
                    variant={
                      viewProduct?.status === 'active'
                        ? 'default'
                        : viewProduct?.status === 'draft'
                        ? 'secondary'
                        : 'outline'
                    }
                  >
                    {viewProduct?.status}
                  </Badge>
                </div>
              </div>

              <div>
                <Label>Price</Label>
                <p className='mt-1'>{formatIDR(viewProduct?.price || 0)}</p>
              </div>
            </div>

            <div className='grid gap-4 md:grid-cols-3'>
              <div>
                <Label>Total Sales</Label>
                <p className='mt-1'>{viewProduct?.sales}</p>
              </div>

              <div>
                <Label>Revenue</Label>
                <p className='mt-1'>{formatIDR(viewProduct?.price! * viewProduct?.sales!)}</p>
              </div>

              <div>
                <Label>Rating</Label>
                <p className='mt-1'>⭐ {viewProduct?.rating}</p>
              </div>
            </div>

            <div>
              <Label>Description</Label>
              <p className='mt-1 text-sm text-muted-foreground'>{viewProduct?.description}</p>
            </div>

            <div>
              <Label>Created Date</Label>
              <p className='mt-1 text-sm text-muted-foreground'>
                {new Date(viewProduct?.created_at!).toLocaleDateString('id-ID', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>

            <div>
              <Label>Sales Progress</Label>
              <div className='mt-2'>
                <div className='flex items-center justify-between text-sm mb-1'>
                  <span className='text-muted-foreground'>Progress to 500 sales</span>
                  <span>{Math.round((viewProduct?.sales! / 500) * 100)}%</span>
                </div>
                <Progress value={(viewProduct?.sales! / 500) * 100} className='h-2' />
              </div>
            </div>
          </div>

          <div className='flex gap-3'>
            <Button
              className='flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
              onClick={() => {
                onNavigateEdit(viewProduct!);
              }}
            >
              <Edit className='mr-2 h-4 w-4' />
              Edit Product
            </Button>
            <Button variant='outline' onClick={() => setViewProduct(null)}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
