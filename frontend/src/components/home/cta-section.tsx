'use client';
import { Button } from '../ui/button';
import { ArrowRight, Check } from 'lucide-react';
import { redirect } from 'next/navigation';

export default function CTA() {
  return (
    <section className='relative w-full overflow-hidden bg-linear-to-r from-blue-600 via-purple-600 to-blue-600 py-20 text-white md:py-32'>
      <div className='absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-size-[14px_24px]'></div>
      <div className='container mx-auto relative px-4 text-center md:px-6'>
        <h2 className='mb-6 text-4xl text-white md:text-5xl'>Ready to Start Your Creator Journey?</h2>
        <p className='mb-10 text-xl text-blue-100'>
          Join thousands of creators earning from their digital products today
        </p>
        <div className='flex flex-col gap-4 sm:flex-row sm:justify-center'>
          <Button size='lg' variant='secondary' className='text-lg' onClick={() => redirect('/register')}>
            Create Free Account
            <ArrowRight className='ml-2 h-5 w-5' />
          </Button>
          <Button
            size='lg'
            variant='outline'
            className='border-white bg-transparent text-lg text-white hover:bg-white hover:text-blue-600'
            onClick={() => redirect('/explore')}
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
  );
}
