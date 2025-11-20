'use client';
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
import { useGetMyProducts } from '@/hooks/use-products';
import { Edit, Eye, MoreVertical, Trash2, Upload } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Products() {
  const router = useRouter();
  const { myProducts } = useGetMyProducts();
  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h2>My Products</h2>
          <p className='text-muted-foreground'>Manage your digital products</p>
        </div>
        <Button
          className='bg-linear-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
          onClick={() => router.push('/dashboard/upload')}
        >
          <Upload className='mr-2 h-4 w-4' />
          Upload New Product
        </Button>
      </div>

      <Card className='p-4'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Sales</TableHead>
              <TableHead>Revenue</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className='w-[50px]'></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {myProducts?.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <div className='flex items-center gap-3'>
                    <img
                      src={product.thumbnail}
                      alt={product.title}
                      className='h-12 w-12 rounded-lg object-cover'
                    />
                    <div>
                      <p className='text-sm'>{product.title}</p>
                      <p className='text-sm text-muted-foreground'>{product.sales} sales</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant='secondary'>{product.category.name}</Badge>
                </TableCell>
                <TableCell>${product.price}</TableCell>
                <TableCell>{product.sales}</TableCell>
                <TableCell>${product.price * product.sales}</TableCell>
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
                      <DropdownMenuItem>
                        <Eye className='mr-2 h-4 w-4' />
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className='mr-2 h-4 w-4' />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className='text-destructive'>
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
    </div>
  );
}
