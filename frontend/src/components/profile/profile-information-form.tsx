'use client';
import { Loader, User } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Field, FieldContent, FieldDescription, FieldError, FieldGroup, FieldLabel } from '../ui/field';
import { Controller, useForm } from 'react-hook-form';
import { Input } from '../ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { profileSchema, ProfileType } from '@/types/api/user-type';
import { zodResolver } from '@hookform/resolvers/zod';
import { useUpdateUser } from '@/hooks/use-users';
import { useAuth } from '@/contexts/auth-context';
import { useState } from 'react';

export default function ProfileInformationForm() {
  const [previewImage, setPreviewImage] = useState('');

  const { user } = useAuth();
  const { updateUser } = useUpdateUser();

  const form = useForm<ProfileType>({
    resolver: zodResolver(profileSchema),
    values: user
      ? {
          full_name: user.full_name,
          email: user.email,
          role: user.role as 'USER' | 'CREATOR',
          avatar: '',
        }
      : {
          full_name: '',
          email: '',
          role: 'USER',
          avatar: '',
        },
  });

  const onSubmitUpdateUser = form.handleSubmit((data: ProfileType) => {
    updateUser(data);
  });
  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <User className='h-5 w-5' />
          Profile Information
        </CardTitle>
        <CardDescription>Update your personal information and account details</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmitUpdateUser} className='space-y-6'>
          <FieldGroup className='gap-4'>
            <Controller
              control={form.control}
              name='avatar'
              render={({ field, fieldState }) => (
                <Field>
                  <Input
                    id={field.name}
                    type='file'
                    hidden
                    onChange={(e) => {
                      const value = e.target.files;
                      const valuePreviewImage = URL.createObjectURL(value![0]);
                      setPreviewImage(valuePreviewImage);

                      field.onChange(value![0]);
                    }}
                  />

                  <Field orientation={'horizontal'} className='flex items-center gap-6'>
                    <Avatar className='h-24 w-24'>
                      <AvatarImage
                        src={previewImage !== '' ? previewImage : user?.avatar}
                        alt={user?.full_name}
                      />
                      <AvatarFallback>{user?.full_name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <FieldContent className='gap-0'>
                      <FieldLabel htmlFor={field.name}>
                        <Button
                          asChild
                          type='button'
                          variant='outline'
                          disabled={form.formState.isSubmitting}
                        >
                          <span>Change Avatar</span>
                        </Button>
                      </FieldLabel>

                      <p className='mt-2 text-sm text-muted-foreground'>JPG, PNG or GIF. Max 2MB.</p>
                      {fieldState.error && <FieldError>{fieldState.error.message}</FieldError>}
                    </FieldContent>
                  </Field>
                </Field>
              )}
            />
          </FieldGroup>

          <Separator />

          <Field className='grid gap-4 md:grid-cols-2'>
            <Controller
              control={form.control}
              name='full_name'
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>Full Name</FieldLabel>
                  <Input
                    id={field.name}
                    placeholder='John Doe'
                    disabled={form.formState.isSubmitting}
                    {...field}
                  />
                  {fieldState.error && <FieldError>{fieldState.error.message}</FieldError>}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name='email'
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                  <Input
                    id={field.name}
                    type='email'
                    placeholder='you@example.com'
                    {...field}
                    disabled={form.formState.isSubmitting}
                  />
                  {fieldState.error && <FieldError>{fieldState.error.message}</FieldError>}
                </Field>
              )}
            />
          </Field>

          <Controller
            control={form.control}
            name='role'
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel htmlFor={field.name}>Account Type</FieldLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className='max-w-1/2' disabled={form.formState.isSubmitting}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='USER'>Buyer</SelectItem>
                    <SelectItem value='CREATOR'>Creator</SelectItem>
                  </SelectContent>
                </Select>
                {fieldState.error && <FieldError>{fieldState.error.message}</FieldError>}
                <FieldDescription>
                  {field.value.toLowerCase() === 'creator'
                    ? 'You can sell digital products on the platform'
                    : 'You can purchase digital products from creators'}
                </FieldDescription>
              </Field>
            )}
          />

          <Button
            type='submit'
            className='bg-linear-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
            disabled={!form.formState.isDirty || form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? <Loader /> : 'Save changes'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
