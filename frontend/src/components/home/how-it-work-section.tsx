export default function HowItWork() {
  return (
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
  );
}
