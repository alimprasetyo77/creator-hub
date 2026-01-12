'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { registerSchema, RegisterType } from '@/types/api/auth-type';
import { EyeClosedIcon, EyeIcon, ShoppingBag } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { useRegister } from '@/hooks/use-auth';
import { Input } from '@/components/ui/input';
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from '@/components/ui/field';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function page() {
  const [showPassword, setShowPassword] = useState(false);
  const { register, isLoading } = useRegister();
  const router = useRouter();
  const form = useForm<RegisterType>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      full_name: '',
      email: '',
      password: '',
      role: 'USER',
    },
  });

  const onSubmit = form.handleSubmit(async (data: RegisterType) => {
    try {
      await register(data);
      form.reset();
      router.push('/login');
    } catch (error) {
      if ((error as Error).message === 'Email already exists') {
        form.setError('email', { message: (error as Error).message });
      }
    }
  });

  return (
    <div className='flex min-h-screen items-center justify-center bg-linear-to-b from-blue-50 to-white px-4 py-12'>
      <div className='w-full max-w-md'>
        <div className='mb-8 text-center'>
          <button className='mx-auto mb-4 flex items-center gap-2 transition-opacity hover:opacity-80'>
            <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-linear-to-br from-blue-600 to-purple-600'>
              <ShoppingBag className='h-6 w-6 text-white' />
            </div>
            <span className='text-2xl'>CreatorHub</span>
          </button>
        </div>

        <Card>
          <CardHeader className='space-y-1'>
            <CardTitle className='text-center text-2xl'>Create an account</CardTitle>
            <CardDescription className='text-center'>Get started with CreatorHub today</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className='space-y-4'>
              <FieldGroup className='gap-4'>
                <Controller
                  control={form.control}
                  name='full_name'
                  render={({ field, fieldState }) => (
                    <Field className='gap-2'>
                      <FieldLabel htmlFor={field.name}>Full Name</FieldLabel>
                      <Input id={field.name} type='text' placeholder='John Doe' {...field} />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
                <Controller
                  control={form.control}
                  name='email'
                  render={({ field, fieldState }) => (
                    <Field className='gap-2'>
                      <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                      <Input id={field.name} type='email' placeholder='you@example.com' {...field} />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />

                <Controller
                  control={form.control}
                  name='password'
                  render={({ field, fieldState }) => (
                    <Field className='gap-2'>
                      <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                      <div className='relative'>
                        <Input
                          id={field.name}
                          type={showPassword ? 'text' : 'password'}
                          placeholder='••••••••'
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
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />

                <Controller
                  control={form.control}
                  name='role'
                  render={({ field, fieldState }) => (
                    <Field className='gap-2'>
                      <FieldLabel>I want to</FieldLabel>
                      <RadioGroup
                        defaultValue={field.value.toLowerCase()}
                        onValueChange={(v) => field.onChange(v.toUpperCase())}
                      >
                        <FieldLabel className=''>
                          <Field orientation={'horizontal'}>
                            <RadioGroupItem value='user' id='user' />
                            <FieldContent>
                              <FieldTitle>Buy digital products</FieldTitle>
                              <FieldDescription>Browse and purchase from creators</FieldDescription>
                            </FieldContent>
                          </Field>
                        </FieldLabel>
                        <FieldLabel>
                          <Field orientation={'horizontal'}>
                            <RadioGroupItem value='creator' id='creator' />
                            <FieldContent>
                              <FieldTitle>Sell my products</FieldTitle>
                              <FieldDescription>Start earning from digital products</FieldDescription>
                            </FieldContent>
                          </Field>
                        </FieldLabel>
                      </RadioGroup>
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
              </FieldGroup>
              <Button
                type='submit'
                className='w-full bg-linear-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
                disabled={isLoading || form.formState.isSubmitting || !form.formState.isDirty}
              >
                {isLoading ? 'Creating account...' : 'Create account'}
              </Button>
            </form>

            <p className='mt-6 text-center text-sm text-muted-foreground'>
              Already have an account?{' '}
              <button onClick={() => router.push('/login')} className='text-blue-600 hover:underline'>
                Sign in
              </button>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
