import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { IProduct, ProductUpdateType } from '@/types/api/product-type';
import { Edit, Sparkles } from 'lucide-react';
import { useRef } from 'react';
import { Controller, useForm } from 'react-hook-form';

interface IDialogViewProductProps {
  editProduct: IProduct | null;
  setEditProduct: React.Dispatch<React.SetStateAction<IProduct | null>>;
}

export default function DialogEditProduct({ editProduct, setEditProduct }: IDialogViewProductProps) {
  const form = useForm<ProductUpdateType>({
    values: {
      title: editProduct?.title || '',
      description: editProduct?.description || '',
      price: editProduct?.price.toString() || '0',
      thumbnail: editProduct?.thumbnail || '',
      categoryId: editProduct?.category.id || '',
    },
  });
  const onSubmit = form.handleSubmit(async (data: ProductUpdateType) => {
    console.log(data);
  });
  return (
    <Dialog open={editProduct !== null} onOpenChange={() => setEditProduct(null)}>
      <DialogContent className='max-w-2xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
          <DialogDescription>Make changes to your product details.</DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit}>
          <FieldGroup className='gap-y-6'>
            <Controller
              control={form.control}
              name='thumbnail'
              render={({ field }) => (
                <Field className='relative gap-y-0 h-48 w-full overflow-hidden rounded-lg group'>
                  <img
                    src={field.value || editProduct?.thumbnail}
                    alt={field.name}
                    className='h-full w-full object-cover '
                  />
                  <Input
                    type='file'
                    className='hidden'
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        field.onChange(URL.createObjectURL(file));
                      }
                    }}
                    id={field.name}
                  />
                  <FieldLabel htmlFor={field.name}>
                    <Edit className='absolute hidden group-hover:block right-2 top-2 size-5 cursor-pointer rounded-full bg-white p-1 text-black hover:bg-gray-200' />
                  </FieldLabel>
                </Field>
              )}
            />

            <Field className='gap-y-4'>
              <Controller
                control={form.control}
                name='title'
                render={({ field }) => (
                  <Field className='gap-y-2'>
                    <Label htmlFor={field.name}>Product Title</Label>
                    <Input
                      {...field}
                      id={field.name}
                      value={field.value!}
                      placeholder='Enter product title...'
                    />
                  </Field>
                )}
              />

              <Field className='grid gap-4 md:grid-cols-2'>
                <Controller
                  control={form.control}
                  name='categoryId'
                  render={({ field }) => (
                    <Field className='gap-y-2'>
                      <Label htmlFor='edit-category'>Category</Label>
                      <Select value={field.value} onValueChange={(value) => field.onChange(value)}>
                        <SelectTrigger>
                          <SelectValue placeholder='Select category' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='ebook'>E-book</SelectItem>
                          <SelectItem value='template'>Template</SelectItem>
                          <SelectItem value='ui-kit'>UI Kit</SelectItem>
                          <SelectItem value='asset'>Asset</SelectItem>
                          <SelectItem value='course'>Course</SelectItem>
                        </SelectContent>
                      </Select>
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
                render={({ field }) => (
                  <Field className='gap-y-2'>
                    <Label htmlFor={field.name}>Price (USD)</Label>
                    <Input
                      {...field}
                      id={field.name}
                      type='number'
                      placeholder='29'
                      min='0'
                      step='0.01'
                      value={field.value}
                    />
                  </Field>
                )}
              />

              <Controller
                control={form.control}
                name='description'
                render={({ field }) => (
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
                    <span>${editProduct?.price! * editProduct?.sales!}</span>
                  </div>
                  <div className='flex justify-between border-t pt-2'>
                    <span className='text-muted-foreground'>Projected Revenue:</span>
                    <span>${parseFloat(form.getValues('price') || '0') * editProduct?.sales!}</span>
                  </div>
                </div>
              </div>
            </Field>

            <div className='flex gap-3'>
              <Button
                type='button'
                className='flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
              >
                <Edit className='mr-2 h-4 w-4' />
                Save Changes
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
