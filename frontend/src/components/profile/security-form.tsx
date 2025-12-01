'use client';
import { Lock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Field, FieldError, FieldGroup, FieldLabel } from '../ui/field';
import { Controller, useForm } from 'react-hook-form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useChangePassword } from '@/hooks/use-users';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { changePasswordSchema, ChangePasswordType } from '@/types/api/user-type';
export default function SecurityForm() {
  const { changePassword } = useChangePassword({
    onSuccess: ({ message }) => {
      formChangePassword.reset();
      toast.success(message);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const formChangePassword = useForm<ChangePasswordType>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    },
  });

  const onSubmitChangePassword = formChangePassword.handleSubmit((data: ChangePasswordType) => {
    changePassword(data);
  });
  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Lock className='h-5 w-5' />
          Security
        </CardTitle>
        <CardDescription>Update your password and security settings</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmitChangePassword} className='space-y-4'>
          <FieldGroup className='gap-4'>
            <Controller
              control={formChangePassword.control}
              name='currentPassword'
              render={({ field, fieldState }) => (
                <Field className='gap-2'>
                  <FieldLabel htmlFor={field.name}>Current Password</FieldLabel>
                  <Input
                    id={field.name}
                    type='password'
                    placeholder='••••••••'
                    {...field}
                    disabled={formChangePassword.formState.isSubmitting}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              control={formChangePassword.control}
              name='newPassword'
              render={({ field, fieldState }) => (
                <Field className='gap-2'>
                  <FieldLabel htmlFor={field.name}>New Password</FieldLabel>
                  <Input
                    id={field.name}
                    type='password'
                    placeholder='••••••••'
                    {...field}
                    disabled={formChangePassword.formState.isSubmitting}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              control={formChangePassword.control}
              name='confirmNewPassword'
              render={({ field, fieldState }) => (
                <Field className='gap-2'>
                  <FieldLabel htmlFor={field.name}>Confirm New Password</FieldLabel>
                  <Input
                    id={field.name}
                    type='password'
                    placeholder='••••••••'
                    {...field}
                    disabled={formChangePassword.formState.isSubmitting}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </FieldGroup>

          <Button
            type='submit'
            variant='outline'
            disabled={formChangePassword.formState.isSubmitting || !formChangePassword.formState.isDirty}
          >
            Update Password
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
