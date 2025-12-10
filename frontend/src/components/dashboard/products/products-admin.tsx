'use client';
import DialogDeleteProduct from '@/components/dashboard/products/dialog-delete-product';
import DialogEditProduct from '@/components/dashboard/products/dialog-edit-product';
import DialogViewProduct from '@/components/dashboard/products/dialog-view-product';
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
import { useGetProducts } from '@/hooks/use-products';
import { formatIDR } from '@/lib/utils';
import { IProduct } from '@/types/api/product-type';
import { Edit, Eye, MoreVertical, Trash2 } from 'lucide-react';
import { useState } from 'react';

export default function ProductsAdmin() {
  const { products } = useGetProducts();
  const [viewProduct, setViewProduct] = useState<IProduct | null>(null);
  const [editProduct, setEditProduct] = useState<IProduct | null>(null);
  const [deleteProduct, setDeleteProduct] = useState<IProduct | null>(null);
  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-lg font-medium'>Product Management</h2>
        <p className='text-muted-foreground'>Manage all products on the platform</p>
      </div>

      <Card className='p-4'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='w-[350px]'>Product</TableHead>
              <TableHead>Creator</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Sales</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className='w-[50px]'></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products?.map((product) => (
              <TableRow key={product.id}>
                <TableCell className='w-[350px]'>
                  <div className='flex items-center gap-3'>
                    <img
                      src={product.thumbnail}
                      alt={product.title}
                      className='h-12 w-12 rounded-lg object-cover'
                    />
                    <p className='text-sm text-wrap'>{product.title}</p>
                  </div>
                </TableCell>
                <TableCell>{product.user.full_name}</TableCell>
                <TableCell>{product.category.name}</TableCell>
                <TableCell>{formatIDR(product.price)}</TableCell>
                <TableCell>{product.sales}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      product.status === 'active'
                        ? 'default'
                        : product.status === 'draft'
                        ? 'secondary'
                        : 'outline'
                    }
                  >
                    {product.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant='ghost' size='icon'>
                        <MoreVertical className='h-4 w-4' />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='end'>
                      <DropdownMenuItem onClick={() => setViewProduct(product)}>
                        <Eye className='mr-2 h-4 w-4' />
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setEditProduct(product)}>
                        <Edit className='mr-2 h-4 w-4' />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className='text-destructive'
                        onClick={() => setDeleteProduct(product)}
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

      {/* Dialog Section */}
      {viewProduct && (
        <DialogViewProduct
          viewProduct={viewProduct}
          setViewProduct={setViewProduct}
          onNavigateEdit={(product) => {
            setViewProduct(null);
            setEditProduct(product);
          }}
        />
      )}
      {editProduct && <DialogEditProduct editProduct={editProduct} setEditProduct={setEditProduct} />}
      {deleteProduct && (
        <DialogDeleteProduct deleteProduct={deleteProduct} setDeleteProduct={setDeleteProduct} />
      )}
    </div>
  );
}
