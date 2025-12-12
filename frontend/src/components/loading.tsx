'use client';
import { motion } from 'motion/react';
import { Loader2, Sparkles, Package, TrendingUp, Zap } from 'lucide-react';

export function Loading() {
  return (
    <div className='relative flex min-h-screen items-center justify-center overflow-hidden bg-linear-to-b from-blue-50 to-white'>
      {/* Subtle Grid Background Pattern */}
      <div className='absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-size-[14px_24px]'></div>

      {/* Floating Orbs - Subtle */}
      <motion.div
        className='absolute left-1/4 top-1/4 h-64 w-64 rounded-full bg-blue-200/30 blur-3xl'
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 30, 0],
          y: [0, -20, 0],
        }}
        transition={
          {
            //   duration: 8,
            //   repeat: Infinity,
            //   ease: 'easeInOut',
          }
        }
      />
      <motion.div
        className='absolute bottom-1/4 right-1/4 h-64 w-64 rounded-full bg-purple-200/30 blur-3xl'
        animate={{
          scale: [1, 1.3, 1],
          x: [0, -30, 0],
          y: [0, 20, 0],
        }}
        transition={
          {
            //   duration: 8,
            //   repeat: Infinity,
            //   ease: 'easeInOut',
            //   delay: 1,
          }
        }
      />

      {/* Main Content */}
      <div className='relative z-10 text-center'>
        {/* Logo/Brand */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className='mb-12'
        >
          <motion.h1
            className='mb-2 bg-linear-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent'
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
          >
            CreatorHub
          </motion.h1>
          <motion.p
            className='text-muted-foreground'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Digital Marketplace for Creators
          </motion.p>
        </motion.div>

        {/* Loading Spinner Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className='relative mx-auto mb-8 h-32 w-32'
        >
          {/* Outer Ring */}
          <motion.div
            className='absolute inset-0 rounded-full border-4 border-blue-200'
            animate={{
              rotate: 360,
            }}
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

          {/* Inner Ring */}
          <motion.div
            className='absolute inset-4 rounded-full border-4 border-purple-200'
            animate={{
              rotate: -360,
            }}
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

          {/* Center Icon Container */}
          <div className='absolute inset-8 flex items-center justify-center rounded-full bg-linear-to-br from-blue-600 to-purple-600'>
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <Loader2 className='h-8 w-8 text-white' />
            </motion.div>
          </div>

          {/* Orbiting Icons */}
          {[
            { icon: Sparkles, delay: 0 },
            { icon: Package, delay: 0.25 },
            { icon: TrendingUp, delay: 0.5 },
            { icon: Zap, delay: 0.75 },
          ].map((item, i) => (
            <motion.div
              key={i}
              className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'
              animate={{
                rotate: 360,
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'linear',
                delay: item.delay,
              }}
            >
              <motion.div
                style={{
                  transform: `translateY(-52px) rotate(-${i * 90}deg)`,
                }}
                animate={{
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: item.delay,
                }}
              >
                <div className='flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md'>
                  <item.icon className='h-4 w-4 text-blue-600' />
                </div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* Loading Text */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
          <motion.p
            className='mb-4 text-muted-foreground'
            animate={{
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            Loading your experience
          </motion.p>

          {/* Progress Dots */}
          <div className='flex justify-center gap-2'>
            {[0, 1, 2, 3].map((i) => (
              <motion.div
                key={i}
                className='h-2 w-2 rounded-full bg-linear-to-r from-blue-600 to-purple-600'
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.4, 1, 0.4],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
