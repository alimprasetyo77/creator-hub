'use client';
import { redirect } from 'next/navigation';

export default function Footer() {
  return (
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
  );
}
