'use client';
import { AlertDialogHeader } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogTitle } from '@/components/ui/dialog';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

interface DialogAddCategoryProps {
  isOpen: 'add' | 'edit' | null;
  setIsOpen: React.Dispatch<React.SetStateAction<'add' | 'edit' | null>>;
}

export default function DialogAddEditCategory({ isOpen, setIsOpen }: DialogAddCategoryProps) {
  const handleSubmit = () => {};

  return (
    <Dialog
      open={isOpen !== null}
      onOpenChange={(v) => {
        if (!v) setIsOpen(null);
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
          <FieldGroup className='space-y-4 py-4'>
            <Field className='space-y-2'>
              <FieldLabel htmlFor='add-name'>Category Name</FieldLabel>
              <Input id='add-name' placeholder='e.g., E-books, Templates, UI Kits' />
            </Field>
            <Field className='space-y-2'>
              <FieldLabel htmlFor='add-slug'>Slug</FieldLabel>
              <Input id='add-slug' placeholder='e.g., ebook, template, ui-kit' />
              <p className='text-sm text-muted-foreground'>URL-friendly identifier (lowercase, no spaces)</p>
            </Field>
            <Field className='space-y-2'>
              <FieldLabel htmlFor='add-description'>Description</FieldLabel>
              <Input id='add-description' placeholder='Brief description of this category' />
            </Field>
          </FieldGroup>
        </form>
        <DialogFooter>
          <Button variant='outline' onClick={() => {}}>
            Cancel
          </Button>
          <Button
            onClick={() => {}}
            className='bg-linear-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
          >
            {isOpen === 'add' ? 'Create' : 'Save'} Category
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
