import { testimonials } from '@/constants/home';

import { Card, CardContent } from '../ui/card';
import { Star } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

export default function Testimonial() {
  return (
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
  );
}
