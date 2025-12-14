'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { EyeClosedIcon, EyeIcon, ShoppingBag } from 'lucide-react';
import { loginSchema, LoginType } from '@/types/api/auth-type';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { redirect, useRouter } from 'next/navigation';
import { useLogin } from '@/hooks/use-auth';
import { useState } from 'react';
import { useAuth } from '@/contexts/auth-context';

export default function page() {
  const [showPassword, setShowPassword] = useState(false);
  const { setIsAuthenticated } = useAuth();
  const { login } = useLogin();
  const router = useRouter();
  const form = useForm<LoginType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = form.handleSubmit((data: LoginType) =>
    login(data, {
      onSuccess: ({ data }) => {
        setIsAuthenticated(true);
        if (data.role === 'ADMIN' || data.role === 'CREATOR') {
          router.replace('/dashboard');
        } else {
          router.replace('/explore');
        }
      },
      onError: (error) => {
        form.setError('root', { message: error.message });
      },
    })
  );

  return (
    <div className='flex min-h-screen items-center justify-center bg-linear-to-b from-blue-50 to-white px-4'>
      <div className='w-full max-w-md'>
        <div className='mb-8 text-center'>
          <button
            onClick={() => redirect('/')}
            className='mx-auto mb-4 flex items-center gap-2 transition-opacity hover:opacity-80'
          >
            <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-linear-to-br from-blue-600 to-purple-600'>
              <ShoppingBag className='h-6 w-6 text-white' />
            </div>
            <span className='text-2xl'>CreatorHub</span>
          </button>
        </div>

        <Card>
          <CardHeader className='space-y-1'>
            <CardTitle className='text-center text-2xl'>Welcome back</CardTitle>
            <CardDescription className='text-center'>
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form id='login-form' onSubmit={onSubmit} className='space-y-4'>
              <FieldGroup className='gap-4'>
                <Controller
                  control={form.control}
                  name='email'
                  render={({ field, fieldState }) => (
                    <Field className='gap-2'>
                      <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                      <Input
                        {...field}
                        id={field.name}
                        placeholder='you@example.com'
                        disabled={form.formState.isSubmitting}
                      />
                      {fieldState.error && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
                <Controller
                  control={form.control}
                  name='password'
                  render={({ field, fieldState }) => (
                    <Field className='gap-2'>
                      <Field orientation={'horizontal'}>
                        <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                        <button
                          type='button'
                          onClick={() => redirect('forgot-password')}
                          className='text-sm text-blue-600 hover:underline'
                        >
                          Forgot password?
                        </button>
                      </Field>
                      <div className='relative'>
                        <Input
                          id={field.name}
                          type={showPassword ? 'text' : 'password'}
                          placeholder='••••••••'
                          disabled={form.formState.isSubmitting}
                          {...field}
                        />
                        <span onClick={() => setShowPassword((prev) => !prev)}>
                          {showPassword ? (
                            <EyeClosedIcon className='h-4 w-4 absolute right-3 -translate-y-1/2 top-1/2 cursor-pointer text-gray-700' />
                          ) : (
                            <EyeIcon className='h-4 w-4 absolute right-3 -translate-y-1/2 top-1/2 cursor-pointer text-gray-700' />
                          )}
                        </span>
                      </div>
                      {fieldState.error && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
                {form.formState.errors.root && <FieldError errors={[form.formState.errors.root]} />}
              </FieldGroup>

              <Field>
                <Button
                  type='submit'
                  className='w-full bg-linear-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
                  disabled={form.formState.isSubmitting || !form.formState.isDirty}
                >
                  Sign In
                </Button>
              </Field>
            </form>

            <div className='relative my-6'>
              <div className='absolute inset-0 flex items-center'>
                <span className='w-full border-t' />
              </div>
              <div className='relative flex justify-center text-xs'>
                <span className='bg-background px-2 text-muted-foreground'>Or continue with</span>
              </div>
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <Button variant='outline' type='button'>
                <svg className='mr-2 h-4 w-4' viewBox='0 0 24 24'>
                  <path
                    d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
                    fill='#4285F4'
                  />
                  <path
                    d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
                    fill='#34A853'
                  />
                  <path
                    d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'
                    fill='#FBBC05'
                  />
                  <path
                    d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
                    fill='#EA4335'
                  />
                </svg>
                Google
              </Button>
              <Button variant='outline' type='button'>
                <svg className='mr-2 h-4 w-4' fill='currentColor' viewBox='0 0 24 24'>
                  <path d='M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z' />
                </svg>
                GitHub
              </Button>
            </div>

            <p className='mt-6 text-center text-sm text-muted-foreground'>
              Don't have an account?{' '}
              <button onClick={() => redirect('/register')} className='text-blue-600 hover:underline'>
                Sign up
              </button>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
