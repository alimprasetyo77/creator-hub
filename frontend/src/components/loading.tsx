import { motion } from 'motion/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Loader2, ArrowLeft, Play, Sparkles, Package, TrendingUp, Zap, Check } from 'lucide-react';
import { redirect } from 'next/navigation';

export default function Loading() {
  return (
    <div className='min-h-screen bg-gradient-to-b from-blue-50 to-white py-12'>
      {/* Subtle Grid Background Pattern */}
      <div className='absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]'></div>

      <div className='container relative z-10 px-4 md:px-6'>
        {/* Header */}
        <div className='mb-8'>
          <Button variant='ghost' onClick={() => redirect('landing')} className='mb-4'>
            <ArrowLeft className='mr-2 h-4 w-4' />
            Back to Home
          </Button>

          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className='text-center'>
            <Badge className='mb-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white'>
              <Sparkles className='mr-1 h-3 w-3' />
              Loading Experience
            </Badge>
            <h1 className='mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent'>
              Loading Screen Demo
            </h1>
            <p className='mx-auto max-w-2xl text-muted-foreground'>
              A clean and professional loading experience that matches CreatorHub's design system
            </p>
          </motion.div>
        </div>

        {/* Main Demo Card */}
        <div className='mx-auto max-w-5xl'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className='overflow-hidden border-none shadow-lg'>
              <CardHeader>
                <div className='flex items-start justify-between'>
                  <div>
                    <CardTitle className='flex items-center gap-2'>
                      <Loader2 className='h-6 w-6 text-blue-600' />
                      Interactive Loading Preview
                    </CardTitle>
                    <CardDescription className='mt-2'>
                      Experience the loading animation in action
                    </CardDescription>
                  </div>
                  <Badge variant='outline' className='border-blue-200 text-blue-600'>
                    Live Demo
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className='space-y-6'>
                {/* Preview Container */}
                <div className='overflow-hidden rounded-xl border-2 border-blue-100 bg-gradient-to-b from-blue-50 to-white shadow-inner'>
                  <div className='relative flex h-96 items-center justify-center'>
                    {/* Background Grid */}
                    <div className='absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]'></div>

                    {/* Floating Orbs */}
                    <motion.div
                      className='absolute left-1/4 top-1/4 h-32 w-32 rounded-full bg-blue-200/30 blur-2xl'
                      animate={{
                        scale: [1, 1.2, 1],
                        x: [0, 20, 0],
                        y: [0, -10, 0],
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                    />
                    <motion.div
                      className='absolute bottom-1/4 right-1/4 h-32 w-32 rounded-full bg-purple-200/30 blur-2xl'
                      animate={{
                        scale: [1, 1.3, 1],
                        x: [0, -20, 0],
                        y: [0, 10, 0],
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        delay: 0.5,
                      }}
                    />

                    {/* Main Content */}
                    <div className='relative z-10 text-center'>
                      {/* Logo */}
                      <motion.div
                        animate={{
                          backgroundPosition: ['0% center', '100% center', '0% center'],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: 'linear',
                        }}
                        style={{
                          backgroundSize: '200% auto',
                        }}
                        className='mb-2 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-4xl font-medium text-transparent'
                      >
                        CreatorHub
                      </motion.div>
                      <p className='mb-8 text-sm text-muted-foreground'>Digital Marketplace for Creators</p>

                      {/* Spinner */}
                      <div className='relative mx-auto mb-6 h-24 w-24'>
                        <motion.div
                          className='absolute inset-0 rounded-full border-4 border-blue-200'
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: 'linear',
                          }}
                          style={{
                            borderTopColor: '#2563eb',
                            borderRightColor: '#9333ea',
                          }}
                        />
                        <motion.div
                          className='absolute inset-3 rounded-full border-4 border-purple-200'
                          animate={{ rotate: -360 }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: 'linear',
                          }}
                          style={{
                            borderTopColor: '#9333ea',
                            borderRightColor: '#2563eb',
                          }}
                        />
                        <div className='absolute inset-6 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-purple-600'>
                          <motion.div
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: 'easeInOut',
                            }}
                          >
                            <Loader2 className='h-6 w-6 text-white' />
                          </motion.div>
                        </div>

                        {/* Orbiting Icons */}
                        {[Sparkles, Package, TrendingUp, Zap].map((Icon, i) => (
                          <motion.div
                            key={i}
                            className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'
                            animate={{ rotate: 360 }}
                            transition={{
                              duration: 4,
                              repeat: Infinity,
                              ease: 'linear',
                              delay: i * 0.25,
                            }}
                          >
                            <motion.div
                              style={{
                                transform: `translateY(-40px) rotate(-${i * 90}deg)`,
                              }}
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                delay: i * 0.25,
                              }}
                            >
                              <div className='flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-md'>
                                <Icon className='h-3 w-3 text-blue-600' />
                              </div>
                            </motion.div>
                          </motion.div>
                        ))}
                      </div>

                      {/* Text */}
                      <motion.p
                        className='mb-3 text-sm text-muted-foreground'
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                        }}
                      >
                        Loading your experience
                      </motion.p>

                      {/* Dots */}
                      <div className='flex justify-center gap-1.5'>
                        {[0, 1, 2, 3].map((i) => (
                          <motion.div
                            key={i}
                            className='h-1.5 w-1.5 rounded-full bg-gradient-to-r from-blue-600 to-purple-600'
                            animate={{
                              scale: [1, 1.3, 1],
                              opacity: [0.4, 1, 0.4],
                            }}
                            transition={{
                              duration: 1.5,
                              repeat: Infinity,
                              delay: i * 0.2,
                            }}
                          />
                        ))}
                      </div>

                      {/* Mini Stats */}
                      <div className='mt-8 flex justify-center gap-6'>
                        {[
                          { label: 'Active Creators', value: '50K+' },
                          { label: 'Products', value: '100K+' },
                          { label: 'Rating', value: '4.9/5' },
                        ].map((stat, i) => (
                          <motion.div
                            key={i}
                            className='text-center'
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 + i * 0.1 }}
                          >
                            <div className='bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-sm text-transparent'>
                              {stat.value}
                            </div>
                            <div className='text-xs text-muted-foreground'>{stat.label}</div>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Particles */}
                    {[...Array(8)].map((_, i) => (
                      <motion.div
                        key={i}
                        className='absolute h-1 w-1 rounded-full'
                        style={{
                          left: `${20 + Math.random() * 60}%`,
                          top: `${80}%`,
                          background: i % 2 === 0 ? 'rgba(37, 99, 235, 0.3)' : 'rgba(147, 51, 234, 0.3)',
                        }}
                        animate={{
                          y: [0, -80],
                          opacity: [0, 0.6, 0],
                        }}
                        transition={{
                          duration: Math.random() * 2 + 1.5,
                          repeat: Infinity,
                          delay: Math.random() * 1,
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className='flex flex-col gap-3 sm:flex-row'>
                  <Button
                    onClick={() => redirect('loading')}
                    className='flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
                    size='lg'
                  >
                    <Play className='mr-2 h-5 w-5' />
                    View Full Screen Demo
                  </Button>

                  <Button variant='outline' onClick={() => redirect('marketplace')} size='lg'>
                    Go to Marketplace
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className='mt-8 grid gap-6 md:grid-cols-2'
          >
            {/* Design Features */}
            <Card className='border-none shadow-sm'>
              <CardHeader>
                <CardTitle className='flex items-center gap-2 text-lg'>
                  <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-purple-600'>
                    <Sparkles className='h-4 w-4 text-white' />
                  </div>
                  Design Features
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-3'>
                {[
                  'Consistent with CreatorHub design system',
                  'Subtle gradient backgrounds and effects',
                  'Clean typography using default styles',
                  'Smooth animations with Motion React',
                ].map((feature, i) => (
                  <div key={i} className='flex items-start gap-3'>
                    <div className='mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100'>
                      <Check className='h-3 w-3 text-blue-600' />
                    </div>
                    <p className='text-sm text-muted-foreground'>{feature}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Technical Features */}
            <Card className='border-none shadow-sm'>
              <CardHeader>
                <CardTitle className='flex items-center gap-2 text-lg'>
                  <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-pink-600'>
                    <Zap className='h-4 w-4 text-white' />
                  </div>
                  Technical Features
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-3'>
                {[
                  'Auto-redirect after 3 seconds',
                  'Responsive design for all devices',
                  'Performance optimized animations',
                  'Accessible and user-friendly',
                ].map((feature, i) => (
                  <div key={i} className='flex items-start gap-3'>
                    <div className='mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-purple-100'>
                      <Check className='h-3 w-3 text-purple-600' />
                    </div>
                    <p className='text-sm text-muted-foreground'>{feature}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Info Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className='mt-8'
          >
            <Card className='border-none bg-gradient-to-br from-blue-50 to-purple-50 shadow-sm'>
              <CardContent className='p-8 text-center'>
                <h3 className='mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
                  Perfect for Your Async Operations
                </h3>
                <p className='text-sm text-muted-foreground'>
                  Use this loading screen for data fetching, payment processing, file uploads, or any
                  asynchronous operation in your CreatorHub application.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
