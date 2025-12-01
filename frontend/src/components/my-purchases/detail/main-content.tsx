import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { IOrder } from '@/types/api/order-type';
import { Download, FileText, HelpCircle, Mail, Shield } from 'lucide-react';

interface IMainContentProps {
  order: IOrder;
}

export default function MainContent({ order }: IMainContentProps) {
  const licenseKey = `CRHB-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random()
    .toString(36)
    .substring(2, 6)
    .toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

  return (
    <>
      <div className='lg:col-span-2 space-y-6'>
        {/* Product Info */}
        <Card className='border-none shadow-sm py-0'>
          <CardContent className='p-6'>
            <h2 className='mb-4'>Purchased Product</h2>
            <div className='flex flex-col gap-4 sm:flex-row'>
              <img
                src={order.items[0].thumbnail}
                alt={order.items[0].title}
                className='h-32 w-32 rounded-lg object-cover'
              />
              <div className='flex-1'>
                <div className='mb-2 flex items-center gap-2'>
                  <Badge className='bg-linear-to-r from-blue-600 to-purple-600 text-white'>
                    {order.items[0].category.name.replace('-', ' ').toUpperCase()}
                  </Badge>
                </div>
                <h3 className='mb-2'>{order.items[0].title}</h3>
                <p className='mb-3 text-sm text-muted-foreground'>{order.items[0].description}</p>
                <div className='flex items-center gap-2'>
                  <Avatar className='h-6 w-6'>
                    <AvatarImage src={order.items[0].user.avatar} alt={order.items[0].user.full_name} />
                    <AvatarFallback>{order.items[0].user.full_name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className='text-sm text-muted-foreground'>by {order.items[0].user.full_name}</span>
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
              If you have any questions or issues with your purchase, feel free to reach out to the creator or
              our support team.
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
