'use client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '../../components/ui/badge';

import {
  ArrowRight,
  Check,
  Clock,
  DollarSign,
  Shield,
  Sparkles,
  Star,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react';
import { redirect } from 'next/navigation';

export default function Home() {
  const testimonials = [
    {
      name: 'Alex Thompson',
      role: 'Product Designer',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
      content:
        'CreatorHub made it incredibly easy to sell my design resources. The platform is intuitive and the payments are seamless.',
    },
    {
      name: 'Maria Garcia',
      role: 'Content Creator',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
      content:
        "I've sold over $10,000 worth of templates in just 3 months. The AI-powered descriptions saved me hours of work!",
    },
    {
      name: 'James Lee',
      role: 'Developer',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
      content:
        'The best platform for selling digital products. Clean interface, great features, and excellent customer support.',
    },
  ];

  const features = [
    {
      icon: <Sparkles className='h-6 w-6' />,
      title: 'AI-Powered Descriptions',
      description: 'Generate compelling product descriptions instantly with our advanced AI assistant.',
    },
    {
      icon: <Shield className='h-6 w-6' />,
      title: 'Secure Payments',
      description: 'Stripe-powered payment processing ensures safe and reliable transactions for everyone.',
    },
    {
      icon: <TrendingUp className='h-6 w-6' />,
      title: 'Analytics Dashboard',
      description: 'Track your sales, revenue, and performance with detailed real-time analytics.',
    },
    {
      icon: <Users className='h-6 w-6' />,
      title: 'Global Marketplace',
      description: 'Reach millions of buyers from around the world looking for quality digital products.',
    },
    {
      icon: <DollarSign className='h-6 w-6' />,
      title: 'Instant Payouts',
      description: 'Get paid instantly when you make a sale. No waiting periods or complicated withdrawals.',
    },
    {
      icon: <Clock className='h-6 w-6' />,
      title: 'Launch in Minutes',
      description: 'Set up your store and start selling in just a few clicks. No technical skills required.',
    },
  ];

  const stats = [
    { value: '50K+', label: 'Active Creators' },
    { value: '$2M+', label: 'Creator Earnings' },
    { value: '100K+', label: 'Products Sold' },
    { value: '4.9/5', label: 'Average Rating' },
  ];

  return (
    <div className='flex flex-col items-center'>
      {/* Hero Section */}
      <section className='relative overflow-hidden bg-linear-to-br from-blue-50 via-purple-50/30 to-white py-20 md:py-32 w-full'>
        <div className='absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-size-[14px_24px]'></div>
        <div className='container mx-auto relative px-4 md:px-6'>
          <div className='mx-auto  max-w-4xl text-center'>
            <Badge className='mb-6 bg-linear-to-r from-blue-600 to-purple-600 text-white'>
              <Zap className='mr-1 h-3 w-3' />
              AI-Powered Digital Marketplace
            </Badge>

            <h1 className='mb-6 bg-linear-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-5xl text-transparent md:text-7xl'>
              Sell Your Digital Products with Confidence
            </h1>
            <p className='mb-10 text-xl text-muted-foreground md:text-2xl'>
              Join the modern marketplace where creators sell e-books, templates, UI kits, and digital assets.
              Launch your store in minutes with AI assistance and secure payments.
            </p>
            <div className='flex flex-col gap-4 sm:flex-row sm:justify-center'>
              <Button
                size='lg'
                className='bg-linear-to-r from-blue-600 to-purple-600 text-lg text-white hover:from-blue-700 hover:to-purple-700'
                onClick={() => redirect('marketplace')}
              >
                Explore Marketplace
                <ArrowRight className='ml-2 h-5 w-5' />
              </Button>
              <Button size='lg' variant='outline' className='text-lg' onClick={() => redirect('register')}>
                Start Selling Free
              </Button>
            </div>
            {/* Stats */}
            <div className='mt-16 grid grid-cols-2 gap-6 md:grid-cols-4'>
              {stats.map((stat, index) => (
                <div key={index} className='text-center'>
                  <div className='mb-1 bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-3xl text-transparent md:text-4xl'>
                    {stat.value}
                  </div>
                  <div className='text-sm text-muted-foreground'>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className='bg-white py-20 md:py-32'>
        <div className='container px-4 md:px-6'>
          <div className='mb-16 text-center'>
            <h2 className='mb-4 text-4xl md:text-5xl'>Everything You Need to Succeed</h2>
            <p className='mx-auto max-w-2xl text-xl text-muted-foreground'>
              Powerful tools and features designed to help creators grow their business
            </p>
          </div>
          <div className='grid gap-8 md:grid-cols-2 lg:grid-cols-3'>
            {features.map((feature, index) => (
              <Card key={index} className='border-none shadow-sm transition-all hover:shadow-md'>
                <CardContent className='p-8'>
                  <div className='mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-linear-to-br from-blue-600 to-purple-600 text-white'>
                    {feature.icon}
                  </div>
                  <h3 className='mb-3 text-xl'>{feature.title}</h3>
                  <p className='text-muted-foreground'>{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className='bg-linear-to-b from-muted/30 to-white py-20 md:py-32'>
        <div className='container px-4 md:px-6'>
          <div className='mb-16 text-center'>
            <h2 className='mb-4 text-4xl md:text-5xl'>How It Works</h2>
            <p className='mx-auto max-w-2xl text-xl text-muted-foreground'>
              Start selling your digital products in three simple steps
            </p>
          </div>
          <div className='grid gap-8 md:grid-cols-3'>
            <div className='relative text-center'>
              <div className='mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-linear-to-br from-blue-600 to-purple-600 text-2xl text-white'>
                1
              </div>
              <h3 className='mb-3 text-xl'>Create Your Account</h3>
              <p className='text-muted-foreground'>
                Sign up for free in seconds. No credit card required to get started.
              </p>
            </div>
            <div className='relative text-center'>
              <div className='mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-linear-to-br from-blue-600 to-purple-600 text-2xl text-white'>
                2
              </div>
              <h3 className='mb-3 text-xl'>Upload Your Products</h3>
              <p className='text-muted-foreground'>
                Add your digital products with AI-generated descriptions and beautiful previews.
              </p>
            </div>
            <div className='relative text-center'>
              <div className='mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-linear-to-br from-blue-600 to-purple-600 text-2xl text-white'>
                3
              </div>
              <h3 className='mb-3 text-xl'>Start Earning</h3>
              <p className='text-muted-foreground'>
                Sell to customers worldwide and receive instant payouts to your account.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className='bg-white py-20 md:py-32'>
        <div className='container px-4 md:px-6'>
          <div className='mb-16 text-center'>
            <h2 className='mb-4 text-4xl md:text-5xl'>Loved by Creators Worldwide</h2>
            <p className='mx-auto max-w-2xl text-xl text-muted-foreground'>
              See what our community of successful creators has to say
            </p>
          </div>
          <div className='grid gap-8 md:grid-cols-2 lg:grid-cols-3'>
            {testimonials.map((testimonial, index) => (
              <Card key={index} className='border-none shadow-sm'>
                <CardContent className='p-8'>
                  <div className='mb-4 flex gap-1'>
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className='h-5 w-5 fill-yellow-400 text-yellow-400' />
                    ))}
                  </div>
                  <p className='mb-6 text-muted-foreground'>{testimonial.content}</p>
                  <div className='flex items-center gap-3'>
                    <Avatar className='h-12 w-12'>
                      <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                      <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className='font-medium'>{testimonial.name}</p>
                      <p className='text-sm text-muted-foreground'>{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className='relative w-full overflow-hidden bg-linear-to-r from-blue-600 via-purple-600 to-blue-600 py-20 text-white md:py-32'>
        <div className='absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-size-[14px_24px]'></div>
        <div className='container mx-auto relative px-4 text-center md:px-6'>
          <h2 className='mb-6 text-4xl text-white md:text-5xl'>Ready to Start Your Creator Journey?</h2>
          <p className='mb-10 text-xl text-blue-100'>
            Join thousands of creators earning from their digital products today
          </p>
          <div className='flex flex-col gap-4 sm:flex-row sm:justify-center'>
            <Button size='lg' variant='secondary' className='text-lg' onClick={() => redirect('register')}>
              Create Free Account
              <ArrowRight className='ml-2 h-5 w-5' />
            </Button>
            <Button
              size='lg'
              variant='outline'
              className='border-white bg-transparent text-lg text-white hover:bg-white hover:text-blue-600'
              onClick={() => redirect('marketplace')}
            >
              Browse Products
            </Button>
          </div>
          <div className='mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-blue-100'>
            <div className='flex items-center gap-2'>
              <Check className='h-5 w-5' />
              <span>No setup fees</span>
            </div>
            <div className='flex items-center gap-2'>
              <Check className='h-5 w-5' />
              <span>Instant payouts</span>
            </div>
            <div className='flex items-center gap-2'>
              <Check className='h-5 w-5' />
              <span>AI-powered tools</span>
            </div>
            <div className='flex items-center gap-2'>
              <Check className='h-5 w-5' />
              <span>24/7 support</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className='border-t w-full bg-muted/30 py-12'>
        <div className='container mx-auto px-4 md:px-6'>
          <div className='grid gap-8 md:grid-cols-4'>
            <div>
              <h4 className='mb-4'>CreatorHub</h4>
              <p className='text-sm text-muted-foreground'>
                The modern marketplace for digital creators worldwide.
              </p>
            </div>
            <div>
              <h4 className='mb-4 text-sm'>Product</h4>
              <ul className='space-y-2 text-sm text-muted-foreground'>
                <li>
                  <button className='hover:text-foreground' onClick={() => redirect('marketplace')}>
                    Explore
                  </button>
                </li>
                <li>
                  <button className='hover:text-foreground'>Features</button>
                </li>
                <li>
                  <button className='hover:text-foreground'>How It Works</button>
                </li>
              </ul>
            </div>
            <div>
              <h4 className='mb-4 text-sm'>Company</h4>
              <ul className='space-y-2 text-sm text-muted-foreground'>
                <li>
                  <button className='hover:text-foreground'>About</button>
                </li>
                <li>
                  <button className='hover:text-foreground'>Blog</button>
                </li>
                <li>
                  <button className='hover:text-foreground'>Careers</button>
                </li>
              </ul>
            </div>
            <div>
              <h4 className='mb-4 text-sm'>Support</h4>
              <ul className='space-y-2 text-sm text-muted-foreground'>
                <li>
                  <button className='hover:text-foreground'>Help Center</button>
                </li>
                <li>
                  <button className='hover:text-foreground'>Contact</button>
                </li>
                <li>
                  <button className='hover:text-foreground'>Terms</button>
                </li>
                <li>
                  <button className='hover:text-foreground'>Privacy</button>
                </li>
              </ul>
            </div>
          </div>
          <div className='mt-8 border-t pt-8 text-center text-sm text-muted-foreground'>
            © 2025 CreatorHub. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
