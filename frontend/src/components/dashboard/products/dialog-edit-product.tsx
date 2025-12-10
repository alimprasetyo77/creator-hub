'use client';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useCategories } from '@/hooks/use-categories';
import { useUpdateProduct } from '@/hooks/use-products';
import { formatIDR } from '@/lib/utils';
import { IProduct, ProductUpdateSchema, ProductUpdateType } from '@/types/api/product-type';
import { zodResolver } from '@hookform/resolvers/zod';
import { Edit, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface IDialogViewProductProps {
  editProduct: IProduct | null;
  setEditProduct: React.Dispatch<React.SetStateAction<IProduct | null>>;
}

export default function DialogEditProduct({ editProduct, setEditProduct }: IDialogViewProductProps) {
  const [previewThumbnail, setPreviewThumbnail] = useState(editProduct?.thumbnail ?? '');
  const { categories, isLoading: isLoadingCategories } = useCategories();
  const { updateProduct, isPending } = useUpdateProduct(editProduct?.id!);

  const form = useForm<ProductUpdateType>({
    resolver: zodResolver(ProductUpdateSchema),
    defaultValues: editProduct
      ? {
          title: editProduct.title,
          description: editProduct.description,
          price: editProduct.price.toString(),
          thumbnail: '',
          categoryId: editProduct.category.id,
        }
      : undefined,
  });

  const onSubmit = form.handleSubmit((data: ProductUpdateType) => {
    updateProduct(data, {
      onSuccess: ({ message }) => {
        toast.success(message);
        setTimeout(() => {
          setEditProduct(null);
        }, 2000);
      },
      onSettled: () => {
        form.reset();
      },
    });
  });

  return (
    <Dialog open={editProduct !== null} onOpenChange={() => setEditProduct(null)}>
      <DialogContent className='max-w-2xl max-h-[90vh] overflow-y-scroll customScrollBar'>
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
          <DialogDescription>Make changes to your product details.</DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit}>
          <FieldGroup className='gap-y-6'>
            <Controller
              control={form.control}
              name='thumbnail'
              render={({ field, fieldState }) => (
                <Field className='space-y-0'>
                  <Field className='relative gap-y-0 h-48 w-full overflow-hidden rounded-lg group'>
                    {previewThumbnail ? (
                      <img src={previewThumbnail!} alt={field.name} className='h-full w-full object-cover ' />
                    ) : null}
                    <Input
                      type='file'
                      className='hidden'
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setPreviewThumbnail(URL.createObjectURL(file));
                          field.onChange(file);
                        }
                      }}
                      id={field.name}
                    />
                    <FieldLabel htmlFor={field.name}>
                      <Edit className='absolute hidden group-hover:block right-2 top-2 size-5 cursor-pointer rounded-full bg-white p-1 text-black hover:bg-gray-200' />
                    </FieldLabel>
                  </Field>
                  {fieldState.error && <FieldError>{fieldState.error.message}</FieldError>}
                </Field>
              )}
            />

            <Field className='gap-y-4'>
              <Controller
                control={form.control}
                name='title'
                render={({ field, fieldState }) => (
                  <Field className='gap-y-2'>
                    <Label htmlFor={field.name}>Product Title</Label>
                    <Input
                      {...field}
                      id={field.name}
                      value={field.value!}
                      placeholder='Enter product title...'
                    />
                    {fieldState.error && <FieldError>{fieldState.error.message}</FieldError>}
                  </Field>
                )}
              />

              <Field className='grid gap-4 md:grid-cols-2'>
                <Controller
                  control={form.control}
                  name='categoryId'
                  render={({ field, fieldState }) => (
                    <Field className='gap-y-2'>
                      <Label htmlFor='edit-category'>Category</Label>
                      <Select
                        value={field.value}
                        onValueChange={(value) => field.onChange(value)}
                        disabled={isLoadingCategories}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder='Select category' />
                        </SelectTrigger>
                        <SelectContent>
                          {categories?.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {fieldState.error && <FieldError>{fieldState.error.message}</FieldError>}
                    </Field>
                  )}
                />

                {/* <Controller
                control={form.control}
                name='status'
                render={({ field }) => (

              <Field className='gap-y-2'>
                <Label htmlFor='edit-status'>Status</Label>
                <Select
                  value={field.name}
                  onValueChange={(value) => field.onChange(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Select status' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='active'>Active</SelectItem>
                    <SelectItem value='draft'>Draft</SelectItem>
                    <SelectItem value='pending'>Pending</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
                )}
                /> */}
              </Field>

              <Controller
                control={form.control}
                name='price'
                render={({ field, fieldState }) => (
                  <Field className='gap-y-2'>
                    <Label htmlFor={field.name}>Price (IDR)</Label>
                    <Input
                      {...field}
                      id={field.name}
                      type='number'
                      placeholder='29'
                      min='0'
                      step='0.01'
                      value={field.value}
                    />
                    {fieldState.error && <FieldError>{fieldState.error.message}</FieldError>}
                  </Field>
                )}
              />

              <Controller
                control={form.control}
                name='description'
                render={({ field, fieldState }) => (
                  <Field className='gap-y-2'>
                    <Field className='flex items-center justify-between'>
                      <Label htmlFor='edit-description'>Description</Label>
                      <Button type='button' variant='outline' size='sm' onClick={() => {}}>
                        <Sparkles className='mr-2 h-4 w-4' />
                        Generate with AI
                      </Button>
                    </Field>
                    <Textarea
                      {...field}
                      id='edit-description'
                      placeholder='Describe your product...'
                      rows={6}
                      value={field.value}
                    />
                    {fieldState.error && <FieldError>{fieldState.error.message}</FieldError>}
                  </Field>
                )}
              />

              <div className='rounded-lg border bg-muted/50 p-4'>
                <div className='space-y-2 text-sm'>
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>Current Sales:</span>
                    <span>{editProduct?.sales!}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>Current Revenue:</span>
                    <span>{formatIDR(editProduct?.price! * editProduct?.sales!)}</span>
                  </div>
                  <div className='flex justify-between border-t pt-2'>
                    <span className='text-muted-foreground'>Projected Revenue:</span>
                    <span>{formatIDR(parseFloat(form.getValues('price') || '0') * editProduct?.sales!)}</span>
                  </div>
                </div>
              </div>
            </Field>

            <div className='flex gap-3'>
              <Button
                type='submit'
                className='flex-1 bg-linear-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
                disabled={isPending || !form.formState.isDirty}
              >
                <Edit className='mr-2 h-4 w-4' />
                {isPending ? 'Updating...' : 'Update Product'}
              </Button>
              <Button
                type='button'
                variant='outline'
                onClick={() => {
                  form.reset();
                  setEditProduct(null);
                }}
              >
                Cancel
              </Button>
            </div>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
}
