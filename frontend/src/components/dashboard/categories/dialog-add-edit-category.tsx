'use client';
import { AlertDialogHeader } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogTitle } from '@/components/ui/dialog';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { useCreateCategory, useUpdateCategory } from '@/hooks/use-categories';
import { ICategoriesAdmin } from '@/types/api/admin-type';
import { CreateCategorySchema, CreateCategoryType, UpdateCategoryType } from '@/types/api/category-type';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';

interface DialogAddCategoryProps {
  isOpen: 'add' | 'edit' | null;
  onClose: () => void;
  category?: ICategoriesAdmin;
}

export default function DialogAddEditCategory({ isOpen, onClose, category }: DialogAddCategoryProps) {
  const { createCategory, isPending: createCategoryIsLoading } = useCreateCategory();
  const { updateCategory, isPending: updateCategoryIsLoading } = useUpdateCategory(category?.id!);

  const form = useForm<CreateCategoryType>({
    resolver: zodResolver(CreateCategorySchema),
    defaultValues: {
      name: '',
      label: '',
    },
  });

  useEffect(() => {
    if (isOpen === 'edit' && category) {
      form.reset({
        name: category.name,
        label: category.label,
      });
    }
  }, [form, isOpen, category]);

  const handleSubmit = form.handleSubmit((data: CreateCategoryType | UpdateCategoryType) => {
    if (isOpen === 'add') {
      createCategory(data as CreateCategoryType, {
        onSettled: () => {
          form.reset();
          onClose();
        },
      });
      return;
    }
    if (isOpen === 'edit') {
      updateCategory(data as UpdateCategoryType, {
        onSettled: () => {
          form.reset();
          onClose();
        },
      });
    }
  });

  return (
    <Dialog
      open={!!isOpen}
      onOpenChange={(v) => {
        if (!v) {
          onClose();
          form.reset();
        }
      }}
    >
      <DialogContent className='sm:max-w-[500px]'>
        <AlertDialogHeader>
          <DialogTitle>{isOpen === 'add' ? 'Add New' : 'Edit'} Category</DialogTitle>
          <DialogDescription>
            Create a new product category. Categories help organize products in the marketplace.
          </DialogDescription>
        </AlertDialogHeader>
        <form onSubmit={handleSubmit}>
          <FieldGroup className='py-4'>
            <Controller
              control={form.control}
              name='name'
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor='add-name'>Category Name</FieldLabel>
                  <Input id='add-name' placeholder='e.g., E-books, Templates, UI Kits' {...field} />
                  {fieldState.error && <FieldError>{fieldState.error.message}</FieldError>}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name='label'
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor='add-label'>Label</FieldLabel>
                  <Input id='add-label' placeholder='e.g., ebook, template, ui-kit' {...field} />
                  <p className='text-sm text-muted-foreground'>
                    URL-friendly identifier (lowercase, no spaces)
                  </p>
                  {fieldState.error && <FieldError>{fieldState.error.message}</FieldError>}
                </Field>
              )}
            />
          </FieldGroup>
          <DialogFooter className='mt-4'>
            <Button
              type='button'
              variant='outline'
              onClick={() => {
                onClose();
                form.reset();
              }}
            >
              Cancel
            </Button>
            <Button
              type='submit'
              className='bg-linear-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
              disabled={!form.formState.isDirty || createCategoryIsLoading || updateCategoryIsLoading}
            >
              {isOpen === 'add' ? 'Create' : 'Save'} Category
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
