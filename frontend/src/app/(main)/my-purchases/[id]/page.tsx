'use client';

import {
  Download,
  Calendar,
  CreditCard,
  FileText,
  CheckCircle,
  Shield,
  ArrowLeft,
  Mail,
  HelpCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { use } from 'react';
import { useRouter } from 'next/navigation';
import { useOrder } from '@/hooks/use-orders';
import { formatIDR } from '@/lib/utils';

interface PurchaseDetailProps {
  params: Promise<{ id: string }>;
}

export default function PurchaseDetail({ params }: PurchaseDetailProps) {
  const { id } = use(params);
  const router = useRouter();
  const { order, isLoading } = useOrder(id);

  if (isLoading) {
    return (
      <div className='min-h-screen bg-linear-to-b from-blue-50 to-white'>
        <div className='container px-4 py-8 md:px-6'>
          <h1>Loading...</h1>
        </div>
      </div>
    );
  }
  if (!order) return null;

  const invoiceNumber = `INV-${id.toUpperCase()}-${new Date(
    order?.paymentInfo.transactionTime as any
  ).getFullYear()}`;

  const licenseKey = `CRHB-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random()
    .toString(36)
    .substring(2, 6)
    .toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

  return (
    <div className='min-h-screen bg-linear-to-b from-blue-50 to-white'>
      {/* Header */}
      <div className='border-b bg-white/50 backdrop-blur-sm'>
        <div className='container mx-auto px-4 py-4 md:px-6'>
          <Button variant='ghost' onClick={() => router.push('/my-purchases')}>
            <ArrowLeft className='mr-2 h-4 w-4' />
            Back to My Purchases
          </Button>
        </div>
      </div>

      <div className='container mx-auto px-4 py-8 md:px-6'>
        <div className='mb-6'>
          <div className='mb-2 flex items-center gap-2'>
            <CheckCircle className='h-6 w-6 text-emerald-600' />
            <h1>Order Complete</h1>
          </div>
          <p className='text-muted-foreground'>
            Thank you for your purchase! Your order details and download links are below.
          </p>
        </div>

        <div className='grid gap-8 lg:grid-cols-3'>
          {/* Main Content - 2 columns */}
          <div className='lg:col-span-2 space-y-6'>
            {/* Product Info */}
            <Card className='border-none shadow-sm py-0'>
              <CardContent className='p-6'>
                <h2 className='mb-4'>Purchased Product</h2>
                <div className='flex flex-col gap-4 sm:flex-row'>
                  <img
                    src={order.items[0].product.thumbnail}
                    alt={order.items[0].product.title}
                    className='h-32 w-32 rounded-lg object-cover'
                  />
                  <div className='flex-1'>
                    <div className='mb-2 flex items-center gap-2'>
                      <Badge className='bg-linear-to-r from-blue-600 to-purple-600 text-white'>
                        {order.items[0].product.category.name.replace('-', ' ').toUpperCase()}
                      </Badge>
                    </div>
                    <h3 className='mb-2'>{order.items[0].product.title}</h3>
                    <p className='mb-3 text-sm text-muted-foreground'>{order.items[0].product.description}</p>
                    <div className='flex items-center gap-2'>
                      <Avatar className='h-6 w-6'>
                        <AvatarImage
                          src={order.items[0].product.user.avatar}
                          alt={order.items[0].product.user.full_name}
                        />
                        <AvatarFallback>{order.items[0].product.user.full_name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className='text-sm text-muted-foreground'>
                        by {order.items[0].product.user.full_name}
                      </span>
                    </div>
                  </div>
                </div>

                <Separator className='my-6' />

                {/* Download Section */}
                <div className='space-y-3'>
                  <h3>Download Your Files</h3>
                  <div className='rounded-lg border bg-linear-to-br from-blue-50 to-purple-50 p-4'>
                    <div className='mb-3 flex items-start gap-3'>
                      <div className='rounded-lg bg-white p-2 shadow-sm'>
                        <Download className='h-5 w-5 text-blue-600' />
                      </div>
                      <div className='flex-1'>
                        <div className='mb-1 font-medium'>Product Files</div>
                        <p className='mb-3 text-sm text-muted-foreground'>
                          All files are ready for download. You have lifetime access to these files.
                        </p>
                        <Button
                          className='w-full bg-linear-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 sm:w-auto'
                          onClick={() => window.open('downloadUrl', '_blank')}
                        >
                          <Download className='mr-2 h-4 w-4' />
                          Download Now
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* License Information */}
            <Card className='border-none shadow-sm py-0'>
              <CardContent className='p-6'>
                <div className='mb-4 flex items-center gap-2'>
                  <Shield className='h-5 w-5 text-blue-600' />
                  <h2>License Information</h2>
                </div>

                <div className='space-y-4'>
                  <div className='rounded-lg border bg-muted/50 p-4'>
                    <div className='mb-1 text-sm text-muted-foreground'>License Key</div>
                    <div className='font-mono text-lg'>{licenseKey}</div>
                    <p className='mt-2 text-sm text-muted-foreground'>
                      Save this license key for your records. You may need it for product activation.
                    </p>
                  </div>

                  <div className='grid gap-3 sm:grid-cols-2'>
                    <div className='rounded-lg border bg-muted/50 p-3'>
                      <div className='mb-1 text-sm text-muted-foreground'>License Type</div>
                      <div>Personal & Commercial</div>
                    </div>
                    <div className='rounded-lg border bg-muted/50 p-3'>
                      <div className='mb-1 text-sm text-muted-foreground'>Usage Rights</div>
                      <div>Unlimited Projects</div>
                    </div>
                  </div>

                  <div className='rounded-lg border-l-4 border-blue-600 bg-blue-50 p-4'>
                    <h4 className='mb-2'>What you can do:</h4>
                    <ul className='space-y-1 text-sm text-muted-foreground'>
                      <li>✓ Use in personal and commercial projects</li>
                      <li>✓ Modify and customize the files</li>
                      <li>✓ Use in unlimited client projects</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Support */}
            <Card className='border-none shadow-sm py-0'>
              <CardContent className='p-6'>
                <div className='mb-4 flex items-center gap-2'>
                  <HelpCircle className='h-5 w-5 text-blue-600' />
                  <h2>Need Help?</h2>
                </div>

                <div className='grid gap-3 sm:grid-cols-2'>
                  <Button variant='outline' className='justify-start'>
                    <Mail className='mr-2 h-4 w-4' />
                    Contact Creator
                  </Button>
                  <Button variant='outline' className='justify-start'>
                    <FileText className='mr-2 h-4 w-4' />
                    View Documentation
                  </Button>
                </div>

                <p className='mt-4 text-sm text-muted-foreground'>
                  If you have any questions or issues with your purchase, feel free to reach out to the
                  creator or our support team.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - 1 column */}
          <div className='lg:col-span-1'>
            <div className='sticky top-20 space-y-6'>
              {/* Order Summary */}
              <Card className='border-none shadow-sm py-0'>
                <CardContent className='p-6'>
                  <h3 className='mb-4'>Order Summary</h3>

                  <div className='space-y-4'>
                    <div className='flex items-center gap-3 rounded-lg bg-muted/50 p-3'>
                      <Calendar className='h-5 w-5 text-muted-foreground' />
                      <div className='flex-1'>
                        <div className='text-sm text-muted-foreground'>Purchase Date</div>
                        <div>
                          {new Date(order.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </div>
                      </div>
                    </div>

                    <div className='flex items-center gap-3 rounded-lg bg-muted/50 p-3'>
                      <FileText className='h-5 w-5 text-muted-foreground' />
                      <div className='flex-1'>
                        <div className='text-sm text-muted-foreground'>Invoice Number</div>
                        <div className='font-mono text-sm'>{invoiceNumber}</div>
                      </div>
                    </div>

                    <div className='flex items-center gap-3 rounded-lg bg-muted/50 p-3'>
                      <CreditCard className='h-5 w-5 text-muted-foreground' />
                      <div className='flex-1'>
                        <div className='text-sm text-muted-foreground'>Payment Method</div>
                        <div>Stripe</div>
                      </div>
                    </div>
                  </div>

                  <Separator className='my-6' />

                  <div className='space-y-2'>
                    <div className='flex justify-between text-sm'>
                      <span className='text-muted-foreground'>Product Price</span>
                      <span>{formatIDR(order.items[0].product.price)}</span>
                    </div>
                    <div className='flex justify-between text-sm'>
                      <span className='text-muted-foreground'>Processing Fee</span>
                      <span>{formatIDR(0)}</span>
                    </div>
                    <Separator className='my-3' />
                    <div className='flex justify-between'>
                      <span>Total Paid</span>
                      <span className='bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-2xl text-transparent'>
                        {formatIDR(+order.paymentInfo.grossAmount)}
                      </span>
                    </div>
                  </div>

                  <Button variant='outline' className='mt-6 w-full'>
                    <FileText className='mr-2 h-4 w-4' />
                    Download Invoice
                  </Button>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className='border-none shadow-sm py-0'>
                <CardContent className='p-6'>
                  <h3 className='mb-4'>Quick Actions</h3>
                  <div className='space-y-2'>
                    <Button
                      variant='outline'
                      className='w-full justify-start'
                      onClick={() => router.push('/my-purchases')}
                    >
                      View All Purchases
                    </Button>
                    <Button
                      variant='outline'
                      className='w-full justify-start'
                      onClick={() => router.push('/explore')}
                    >
                      Browse More Products
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
