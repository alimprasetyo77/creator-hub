import { features } from '@/constants/home';
import { Card, CardContent } from '../ui/card';

export default function Features() {
  return (
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
                  <feature.icon className='size-5' />
                </div>
                <h3 className='mb-3 text-xl'>{feature.title}</h3>
                <p className='text-muted-foreground'>{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
