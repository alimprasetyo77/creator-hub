'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles, Trash2 } from 'lucide-react';
import { Upload as UploadIcon } from 'lucide-react';
import { Field, FieldContent, FieldError, FieldGroup, FieldLabel, FieldTitle } from '@/components/ui/field';
import { Controller, useForm } from 'react-hook-form';
import { ProductCreateSchema, ProductCreateType } from '@/types/api/product-type';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import Image from 'next/image';
import { useCategories } from '@/hooks/use-categories';
import { useCreateProduct } from '@/hooks/use-products';
import { formatIDR } from '@/lib/utils';
import { useGenerateProductDescription } from '@/hooks/use-creator';
import { GenerateProductDescriptionType } from '@/types/api/creator-type';
import { toast } from 'sonner';

export default function Upload() {
  const { categories } = useCategories();
  const { createProduct, isPending: isPendingProduct } = useCreateProduct();
  const { generateProductDescription, isPending: isPendingProductDescription } =
    useGenerateProductDescription();
  const [previewImg, setPreviewImg] = useState('');

  const form = useForm<ProductCreateType>({
    resolver: zodResolver(ProductCreateSchema),
    defaultValues: {
      title: '',
      description: '',
      price: '',
      categoryId: '',
      thumbnail: '',
      files: '',
    },
  });

  const handleGenerateProductDescription = () => {
    const payload: Partial<GenerateProductDescriptionType> = {};
    if (!form.getValues('title') || !form.getValues('categoryId')) {
      toast.message('Please fill the title and category for generate product description.');
      return;
    }
    const category = categories?.find((category) => category.id === form.getValues('categoryId'));
    if (!category) {
      toast.message('Please fill the category for generate product description.');
      return;
    }
    payload.title = form.getValues('title');
    payload.category = category.name;

    generateProductDescription(payload as GenerateProductDescriptionType, {
      onSuccess: ({ data }) => {
        data && form.setValue('description', data as string);
      },
    });
  };

  const onSubmit = form.handleSubmit((data: ProductCreateType) => {
    createProduct(data, {
      onSuccess: () => {
        form.reset();
        setPreviewImg('');
      },
    });
  });

  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-lg font-medium'>Upload New Product</h2>
        <p className='text-muted-foreground'>Add a new digital product to your store</p>
      </div>

      <Card>
        <CardContent className='p-6'>
          <form className='space-y-6' onSubmit={onSubmit}>
            <FieldGroup>
              <Controller
                control={form.control}
                name='title'
                render={({ field }) => (
                  <Field>
                    <FieldLabel htmlFor={field.name}>Product Title</FieldLabel>
                    <Input id={field.name} placeholder='Enter product title...' {...field} />
                    <FieldError>{form.formState.errors.title?.message}</FieldError>
                  </Field>
                )}
              />

              <Field className='grid gap-6 md:grid-cols-2'>
                <Controller
                  control={form.control}
                  name='price'
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel htmlFor={field.name}>Price (IDR)</FieldLabel>
                      <Input
                        id={field.name}
                        type='text'
                        placeholder='Enter product price...'
                        {...field}
                        onChange={(e) => {
                          let raw = e.target.value.replace(/[^0-9]/g, '');
                          if (!raw) return form.setValue('price', '');
                          form.setValue('price', formatIDR(+raw));
                        }}
                      />
                      <FieldError>{fieldState.error?.message}</FieldError>
                    </Field>
                  )}
                />
                <Controller
                  control={form.control}
                  name='categoryId'
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel htmlFor={field.name}>Category</FieldLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue placeholder='Select category' />
                        </SelectTrigger>
                        <SelectContent>
                          {categories?.map((category) => (
                            <SelectItem key={category.id} value={category.id} className='capitalize!'>
                              {category.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FieldError>{fieldState.error?.message}</FieldError>
                    </Field>
                  )}
                />
              </Field>

              <Controller
                control={form.control}
                name='description'
                render={({ field, fieldState }) => (
                  <Field>
                    <Field orientation={'horizontal'} className='flex items-center justify-between gap-0'>
                      <FieldLabel htmlFor={field.name}>Description</FieldLabel>
                      <Button
                        type='button'
                        variant='outline'
                        size='sm'
                        disabled={isPendingProductDescription || !!field.value}
                        onClick={handleGenerateProductDescription}
                      >
                        <Sparkles className='mr-2 h-4 w-4' />
                        {isPendingProductDescription ? 'Generating...' : 'Generate with AI'}
                      </Button>
                    </Field>

                    <Textarea
                      id={field.name}
                      placeholder='Describe your product...'
                      {...field}
                      rows={6}
                      readOnly={isPendingProductDescription}
                    />

                    <FieldError>{fieldState.error?.message}</FieldError>
                  </Field>
                )}
              />
              <Controller
                control={form.control}
                name='files'
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldTitle>Product Files</FieldTitle>
                    <Input
                      id={field.name}
                      type='file'
                      accept='.zip,.pdf,.figma'
                      className='hidden'
                      onChange={(e) => {
                        const value = e.target.files;
                        field.onChange(value![0]);
                      }}
                    />

                    <FieldContent className='flex items-center justify-center rounded-lg border-2 border-dashed p-12 '>
                      {field.value ? (
                        <Field orientation={'horizontal'} className='flex items-center justify-center'>
                          <Button type='button' variant={'link'} className=' cursor-pointer'>
                            {field.value.name}
                          </Button>
                          <Button
                            type='button'
                            variant={'destructive'}
                            size={'icon-sm'}
                            className='cursor-pointer'
                            onClick={() => {
                              form.resetField('files');
                            }}
                          >
                            <Trash2 className='size-3.5' />
                          </Button>
                        </Field>
                      ) : (
                        <Field className='text-center gap-0'>
                          <UploadIcon className='mx-auto mb-4 h-12 w-12 text-muted-foreground' />
                          <p className='mb-2'>Drag and drop your files here, or click to browse</p>
                          <p className='text-sm text-muted-foreground'>
                            Supports ZIP, PDF, Figma files (max 100MB)
                          </p>

                          <FieldLabel
                            htmlFor={field.name}
                            className='flex items-center justify-center max-w-fit mx-auto'
                          >
                            <Button asChild type='button' variant={'outline'} className='mt-4 cursor-pointer'>
                              <span>Upload File</span>
                            </Button>
                          </FieldLabel>
                        </Field>
                      )}
                    </FieldContent>
                    <FieldError>{fieldState.error?.message}</FieldError>
                  </Field>
                )}
              />

              <Controller
                control={form.control}
                name='thumbnail'
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldTitle>Thumbnail Image</FieldTitle>
                    <Input
                      id={field.name}
                      type='file'
                      accept='.jpg,.jpeg,.png,.webp'
                      className='hidden'
                      onChange={(e) => {
                        const value = e.target.files;
                        if (value?.length === 0) return;
                        field.onChange(value![0]);
                        setPreviewImg(URL.createObjectURL(value![0]));
                      }}
                    />
                    <FieldContent className='flex items-center justify-center rounded-lg border-2 border-dashed p-12'>
                      {previewImg ? (
                        <Field orientation={'vertical'}>
                          <Image
                            src={previewImg}
                            width={1200}
                            height={900}
                            alt='Product thumbnail'
                            className='object-contain max-h-48 rounded-md '
                          />
                          <Button
                            type='button'
                            variant={'destructive'}
                            size={'sm'}
                            className='max-w-fit  mx-auto cursor-pointer'
                            onClick={() => {
                              form.resetField('thumbnail');
                              setPreviewImg('');
                            }}
                          >
                            <Trash2 className='size-3.5' />
                          </Button>
                        </Field>
                      ) : (
                        <Field className='gap-0 text-center'>
                          <p className='mb-2'>Upload product thumbnail</p>
                          <p className='text-sm text-muted-foreground'>
                            JPG, JPEG, PNG, WEBP (recommended 1200x900px)
                          </p>
                          <FieldLabel
                            htmlFor={field.name}
                            className='flex flex-col items-center justify-center max-w-fit mx-auto'
                          >
                            <Button asChild type='button' variant='outline' className='mt-4'>
                              <span>Upload File</span>
                            </Button>
                          </FieldLabel>
                        </Field>
                      )}
                    </FieldContent>
                    <FieldError>{fieldState.error?.message}</FieldError>
                  </Field>
                )}
              />
            </FieldGroup>

            <Button
              type='submit'
              className='bg-linear-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
              disabled={!form.formState.isValid || form.formState.isSubmitting || isPendingProduct}
            >
              {isPendingProduct ? 'Publishing...' : 'Publish Product'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
