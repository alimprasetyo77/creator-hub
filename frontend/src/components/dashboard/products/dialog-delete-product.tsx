'use client';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useDeleteProduct } from '@/hooks/use-products';
import { IProduct } from '@/types/api/product-type';
import { Trash2 } from 'lucide-react';

interface IDialogViewProductProps {
  deleteProduct: IProduct | null;
  setDeleteProduct: React.Dispatch<React.SetStateAction<IProduct | null>>;
}

export default function DialogDeleteProduct({ deleteProduct, setDeleteProduct }: IDialogViewProductProps) {
  const { mutate: handleDeleteProduct, isPending } = useDeleteProduct();
  return (
    <AlertDialog open={deleteProduct !== null} onOpenChange={() => setDeleteProduct(null)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the product
            <strong> "{deleteProduct?.title}"</strong> and all associated data.
            {deleteProduct && deleteProduct.sales > 0 && (
              <span className='mt-2 block text-destructive'>
                ⚠️ This product has {deleteProduct.sales} sales and generated $
                {deleteProduct.price * deleteProduct.sales} in revenue.
              </span>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className='bg-destructive text-white hover:bg-destructive/90'
            onClick={() => handleDeleteProduct(deleteProduct?.id as string)}
            disabled={isPending}
          >
            <Trash2 className='mr-2 h-4 w-4' />
            Delete Product
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
