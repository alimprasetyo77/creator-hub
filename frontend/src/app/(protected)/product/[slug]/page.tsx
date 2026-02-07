'use client';
import { use, useState } from 'react';
import {
  Star,
  ShoppingCart,
  Download,
  Shield,
  RefreshCw,
  Heart,
  Check,
  ChevronLeft,
  FileText,
  Info,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { ProductCard } from '@/components/product-card';
import { useGetProduct, useSimiliarProducts } from '@/hooks/use-products';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { useCreateOrder } from '@/hooks/use-orders';
import { formatIDR } from '@/lib/utils';
import { ProductDetailSkeleton } from '@/components/my-purchases/detail/product-detail-skeleton';
import categoriesColors from '@/constants/categories-colors';
import Image from 'next/image';
import { toast } from 'sonner';

interface Params {
  params: Promise<{ slug: string }>;
}

export default function page({ params }: Params) {
  const { slug } = use(params);
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const isAdmin = user?.role === 'ADMIN';
  const [activeTab, setActiveTab] = useState('overview');
  const { product, isLoading: isLoadingProduct } = useGetProduct({ slug });
  const { similiarProducts, isLoading: isLoadingSimiliarProducts } = useSimiliarProducts(
    product?.category.name!,
    product?.id!,
  );
  const { createOrder, isPending } = useCreateOrder();

  const onClickBuyProduct = (productId: string) => {
    if (isAdmin) return;
    if (!isAuthenticated) {
      toast.info('Please login first to buy this product.');
      return;
    }
    createOrder({
      product_id: productId,
    });
  };

  if (isLoadingProduct || isLoadingSimiliarProducts) {
    return <ProductDetailSkeleton />;
  }
  if (!product) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-linear-to-b from-blue-50 to-white'>
        <div className='text-center'>
          <h2>Product not found</h2>
          <Button onClick={() => router.push('marketplace')} className='mt-4'>
            Back to Marketplace
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-linear-to-b from-blue-50 to-white'>
      {/* Header */}
      <div className='border-b bg-white/50 backdrop-blur-sm'>
        <div className='container mx-auto px-4 py-4 md:px-6'>
          <Button variant='ghost' onClick={() => router.push('/explore')}>
            <ChevronLeft className='mr-2 h-4 w-4' />
            Back to Marketplace
          </Button>
        </div>
      </div>

      <div className='container mx-auto px-4 py-8 md:px-6'>
        <div className='grid lg:grid-cols-6'>
          {/* Main content - 2 columns */}
          <div className='lg:col-span-3 space-y-6'>
            {/* Product Image */}
            <div className='group relative overflow-hidden rounded-2xl border bg-white shadow-sm'>
              <div className='absolute inset-0 bg-linear-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100' />
              <div className='relative p-2 '>
                <Image
                  src={product.thumbnail}
                  alt={product.title}
                  width={800}
                  height={600}
                  className='h-auto w-full max-h-[600px] rounded-xl object-contain transition-transform duration-700 group-hover:scale-[1.02]'
                />
              </div>
            </div>

            {/* Product Header */}
            <Card className='border-none shadow-sm'>
              <CardContent className='p-6'>
                <div className='mb-4 flex flex-wrap items-center gap-2'>
                  <Badge
                    variant={'outline'}
                    className={`bg-linear-to-r ${
                      categoriesColors[product.category.name]
                    } border-0 text-white`}
                  >
                    {product.category.label}
                  </Badge>
                  {product.featured && (
                    <Badge className='border-0 bg-linear-to-r from-blue-600 to-purple-600 text-white'>
                      ✨ Featured
                    </Badge>
                  )}
                </div>

                <h1 className='mb-4 font-medium text-lg'>{product.title}</h1>

                <div className='flex flex-wrap items-center gap-4'>
                  <div className='flex items-center gap-2'>
                    <div className='flex items-center gap-1'>
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${
                            i < Math.floor(product.rating || 4.7)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'fill-gray-200 text-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                    <span className='bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
                      {2}
                    </span>
                    <span className='text-muted-foreground'>({200} reviews)</span>
                  </div>
                  <Separator orientation='vertical' className='h-6' />
                  <div className='flex items-center gap-2 text-muted-foreground'>
                    <Download className='h-4 w-4' />
                    <span>{product.sales} sales</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tabs for content */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className='w-full'>
              <TabsList className='grid w-full grid-cols-2 bg-muted'>
                <TabsTrigger value='overview'>
                  <FileText className='mr-2 h-4 w-4' />
                  Overview
                </TabsTrigger>

                <TabsTrigger value='details'>
                  <Info className='mr-2 h-4 w-4' />
                  Details
                </TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value='overview' className='mt-6 space-y-6'>
                <Card className='border-none shadow-sm'>
                  <CardContent className='p-6'>
                    <h2 className='mb-4'>About this product</h2>
                    <p className='text-muted-foreground leading-relaxed'>{product.description}</p>

                    <div className='mt-8 space-y-4'>
                      <h3>What's included:</h3>
                      <div className='grid gap-4 sm:grid-cols-2'>
                        <div className='flex items-start gap-3 rounded-lg border bg-linear-to-br from-emerald-50 to-teal-50 p-4'>
                          <div className='rounded-lg bg-white p-2 shadow-sm'>
                            <Download className='h-5 w-5 text-emerald-600' />
                          </div>
                          <div>
                            <div className='font-medium'>Instant Download</div>
                            <p className='text-sm text-muted-foreground'>
                              Get access immediately after purchase
                            </p>
                          </div>
                        </div>
                        <div className='flex items-start gap-3 rounded-lg border bg-linear-to-br from-blue-50 to-cyan-50 p-4'>
                          <div className='rounded-lg bg-white p-2 shadow-sm'>
                            <Shield className='h-5 w-5 text-blue-600' />
                          </div>
                          <div>
                            <div className='font-medium'>Lifetime Access</div>
                            <p className='text-sm text-muted-foreground'>Free updates and support forever</p>
                          </div>
                        </div>
                        <div className='flex items-start gap-3 rounded-lg border bg-linear-to-br from-violet-50 to-purple-50 p-4'>
                          <div className='rounded-lg bg-white p-2 shadow-sm'>
                            <RefreshCw className='h-5 w-5 text-violet-600' />
                          </div>
                          <div>
                            <div className='font-medium'>Money-back Guarantee</div>
                            <p className='text-sm text-muted-foreground'>30-day refund policy</p>
                          </div>
                        </div>
                        <div className='flex items-start gap-3 rounded-lg border bg-linear-to-br from-pink-50 to-rose-50 p-4'>
                          <div className='rounded-lg bg-white p-2 shadow-sm'>
                            <Check className='h-5 w-5 text-pink-600' />
                          </div>
                          <div>
                            <div className='font-medium'>Commercial License</div>
                            <p className='text-sm text-muted-foreground'>Use in unlimited projects</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Creator Card */}
                <Card className='border-none shadow-sm'>
                  <CardContent className='p-6'>
                    <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
                      <div className='flex items-center gap-4'>
                        <div className='relative'>
                          <div className='absolute -inset-0.5 rounded-full bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 opacity-75 blur' />
                          <Avatar className='relative h-16 w-16 border-2 border-white'>
                            <AvatarImage src={product.user.avatar} alt={product.user.full_name} />
                            <AvatarFallback>{product.user.full_name.charAt(0)}</AvatarFallback>
                          </Avatar>
                        </div>
                        <div>
                          <h3>{product.user.full_name}</h3>
                          <p className='text-sm text-muted-foreground'>Digital Creator • 1.2k followers</p>
                        </div>
                      </div>
                      <Button variant='outline'>
                        <Heart className='mr-2 h-4 w-4' />
                        Follow
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Reviews Tab */}
              <TabsContent value='reviews' className='mt-6 space-y-6'>
                {/* Rating Overview */}
                <Card className='border-none shadow-sm'>
                  <CardContent className='p-6'>
                    <h2 className='mb-6'>Customer Reviews</h2>

                    <div className='grid gap-8 md:grid-cols-2'>
                      {/* Average Rating */}
                      <div className='flex flex-col items-center justify-center rounded-xl bg-linear-to-br from-blue-50 to-purple-50 p-8'>
                        <div className='mb-2 bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-6xl text-transparent'>
                          {20}
                        </div>
                        <div className='mb-2 flex items-center gap-1'>
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-5 w-5 ${
                                i < Math.floor(Number(20) / 5)
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'fill-gray-200 text-gray-200'
                              }`}
                            />
                          ))}
                        </div>
                        <p className='text-muted-foreground'>Based on {20} reviews</p>
                      </div>

                      {/* Rating Distribution */}
                      <div className='space-y-3'>
                        <div key={2} className='flex items-center gap-3'>
                          <div className='flex w-12 items-center gap-1'>
                            <span className='text-sm text-muted-foreground'>{4}</span>
                            <Star className='h-3 w-3 fill-yellow-400 text-yellow-400' />
                          </div>
                          <Progress value={4} className='h-2 flex-1' />
                          <span className='w-12 text-right text-sm text-muted-foreground'>{4}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Details Tab */}
              <TabsContent value='details' className='mt-6'>
                <Card className='border-none shadow-sm'>
                  <CardContent className='p-6'>
                    <h2 className='mb-6'>Product Details</h2>

                    <div className='grid gap-4 sm:grid-cols-2'>
                      <div className='rounded-lg border bg-muted/50 p-4'>
                        <div className='mb-1 text-sm text-muted-foreground'>License Type</div>
                        <div className='font-medium'>Personal & Commercial</div>
                      </div>
                      <div className='rounded-lg border bg-muted/50 p-4'>
                        <div className='mb-1 text-sm text-muted-foreground'>File Format</div>
                        <div className='font-medium'>ZIP, PDF, Figma</div>
                      </div>
                      <div className='rounded-lg border bg-muted/50 p-4'>
                        <div className='mb-1 text-sm text-muted-foreground'>File Size</div>
                        <div className='font-medium'>24.5 MB</div>
                      </div>
                      <div className='rounded-lg border bg-muted/50 p-4'>
                        <div className='mb-1 text-sm text-muted-foreground'>Last Updated</div>
                        <div className='font-medium'>October 2024</div>
                      </div>
                      <div className='rounded-lg border bg-muted/50 p-4'>
                        <div className='mb-1 text-sm text-muted-foreground'>Category</div>
                        <div className='font-medium'>{product.category.name.replace('-', ' ')}</div>
                      </div>
                      <div className='rounded-lg border bg-muted/50 p-4'>
                        <div className='mb-1 text-sm text-muted-foreground'>Published</div>
                        <div className='font-medium'>
                          {new Date(product.created_at).toLocaleDateString('en-US', {
                            month: 'long',
                            year: 'numeric',
                          })}
                        </div>
                      </div>
                    </div>

                    <Separator className='my-6' />

                    <div className='space-y-3'>
                      <h3>Features</h3>
                      <div className='grid gap-2'>
                        <div className='flex items-center gap-2'>
                          <Check className='h-4 w-4 text-emerald-600' />
                          <span className='text-muted-foreground'>
                            200+ professionally designed components
                          </span>
                        </div>
                        <div className='flex items-center gap-2'>
                          <Check className='h-4 w-4 text-emerald-600' />
                          <span className='text-muted-foreground'>
                            Fully customizable and organized layers
                          </span>
                        </div>
                        <div className='flex items-center gap-2'>
                          <Check className='h-4 w-4 text-emerald-600' />
                          <span className='text-muted-foreground'>Regular updates and improvements</span>
                        </div>
                        <div className='flex items-center gap-2'>
                          <Check className='h-4 w-4 text-emerald-600' />
                          <span className='text-muted-foreground'>Compatible with latest design tools</span>
                        </div>
                        <div className='flex items-center gap-2'>
                          <Check className='h-4 w-4 text-emerald-600' />
                          <span className='text-muted-foreground'>Comprehensive documentation included</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar - 1 column */}
          <div className='lg:col-span-2 lg:col-start-5  '>
            <div className='sticky top-20'>
              <Card className='border-none shadow-lg'>
                <CardContent className='p-6'>
                  {/* Price */}
                  <div className='mb-6'>
                    <div className='mb-2 bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-4xl text-transparent'>
                      {formatIDR(product.price)}
                    </div>
                    <p className='text-sm text-muted-foreground'>One-time payment</p>
                  </div>

                  {/* Action Buttons */}
                  <div className='space-y-3'>
                    {isAdmin ? (
                      <div className='rounded-lg border border-muted bg-muted/50 p-4'>
                        <p className='text-center text-sm text-muted-foreground'>
                          Admin accounts cannot purchase products. This feature is only available for buyers
                          and creators.
                        </p>
                      </div>
                    ) : (
                      <>
                        <Button
                          className='w-full bg-linear-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
                          size='lg'
                          onClick={() => onClickBuyProduct(product.id)}
                          disabled={isPending}
                        >
                          <ShoppingCart className='mr-2 h-5 w-5' />
                          Buy Now
                        </Button>
                        <Button variant='outline' size='lg' className='w-full'>
                          <Heart className='mr-2 h-5 w-5' />
                          Add to Wishlist
                        </Button>
                      </>
                    )}
                  </div>

                  <Separator className='my-6' />

                  {/* Trust Badges */}
                  <div className='space-y-3 text-sm'>
                    <div className='flex items-center gap-3 rounded-lg bg-linear-to-br from-emerald-50 to-teal-50 p-3'>
                      <div className='rounded-lg bg-white p-2 shadow-sm'>
                        <Shield className='h-4 w-4 text-emerald-600' />
                      </div>
                      <div className='flex-1 text-muted-foreground'>Secure payment via Stripe</div>
                    </div>
                    <div className='flex items-center gap-3 rounded-lg bg-linear-to-br from-blue-50 to-cyan-50 p-3'>
                      <div className='rounded-lg bg-white p-2 shadow-sm'>
                        <Download className='h-4 w-4 text-blue-600' />
                      </div>
                      <div className='flex-1 text-muted-foreground'>Instant download access</div>
                    </div>
                    <div className='flex items-center gap-3 rounded-lg bg-linear-to-br from-violet-50 to-purple-50 p-3'>
                      <div className='rounded-lg bg-white p-2 shadow-sm'>
                        <RefreshCw className='h-4 w-4 text-violet-600' />
                      </div>
                      <div className='flex-1 text-muted-foreground'>30-day refund policy</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {similiarProducts && similiarProducts.length > 0 && (
          <div className='mt-16'>
            <h2 className='mb-8 text-lg font-medium'>Related Products</h2>
            <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
              {similiarProducts?.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
