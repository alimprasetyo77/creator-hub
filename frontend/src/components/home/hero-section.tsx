'use client';
import { ArrowRight, Zap } from 'lucide-react';
import { Button } from '../ui/button';

import { Badge } from '../ui/badge';
import { redirect } from 'next/navigation';
import { stats } from '@/constants/home';

export default function Hero() {
  return (
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
              onClick={() => redirect('/explore')}
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
  );
}
