'use client';

import DialogAddEditCategory from '@/components/dashboard/categories/dialog-add-edit-category';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useCategoriesAdmin } from '@/hooks/use-admin';
import { useDeleteCategory } from '@/hooks/use-categories';
import { ICategoriesAdmin } from '@/types/api/admin-type';
import { Edit, MoreVertical, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

export default function Categories() {
  const { categories, isLoading } = useCategoriesAdmin();
  const { deleteCategory, isPending: deleteCategoryLoading } = useDeleteCategory();
  const [isOpenDialog, setIsOpenDialog] = useState<'add' | 'edit' | null>(null);
  const [editCategory, setEditCategory] = useState<ICategoriesAdmin | null>(null);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-lg font-medium'>Category Management</h2>
          <p className='text-muted-foreground'>Manage product categories</p>
        </div>
        <Button
          size='sm'
          onClick={() => {
            setIsOpenDialog('add');
          }}
          className='bg-linear-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
        >
          <Plus className='mr-2 h-4 w-4' />
          Add Category
        </Button>
      </div>

      <Card className='p-4'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Label</TableHead>
              <TableHead>Product Count</TableHead>
              <TableHead className='w-[50px]'></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories?.map((category) => (
              <TableRow key={category.id}>
                <TableCell>{category.name}</TableCell>
                <TableCell>
                  <Badge variant='outline'>{category.label}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant='secondary'>{category.productCount} products</Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant='ghost' size='icon'>
                        <MoreVertical className='h-4 w-4' />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='end'>
                      <DropdownMenuItem
                        onClick={() => {
                          setIsOpenDialog('edit');
                          setEditCategory(category);
                        }}
                      >
                        <Edit className='mr-2 h-4 w-4' />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className='text-destructive'
                        onClick={() => {
                          deleteCategory(category.id);
                        }}
                        disabled={deleteCategoryLoading}
                      >
                        <Trash2 className='mr-2 h-4 w-4' />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <DialogAddEditCategory
        isOpen={isOpenDialog}
        onClose={() => {
          setIsOpenDialog(null);
          setEditCategory(null);
        }}
        category={editCategory!}
      />
    </div>
  );
}
