'use client';
import { useEffect, useState } from 'react';
import { User, Mail, Lock, Shield, Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { useAuth } from '@/contexts/auth-context';
import { changePasswordSchema, ChangePasswordType, profileSchema, ProfileType } from '@/types/api/user-type';
import { useChangePassword, useDeleteUser, useUpdateUser } from '@/hooks/use-users';
import { toast } from 'sonner';

export default function page() {
  const [previewImage, setPreviewImage] = useState('');
  const { changePassword } = useChangePassword({
    onSuccess: ({ message }) => {
      formChangePassword.reset();
      toast.success(message);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  const { updateUser } = useUpdateUser();
  const { deleteUser } = useDeleteUser();
  const { user } = useAuth();

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

  const formChangePassword = useForm<ChangePasswordType>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    },
  });

  const onSubmitUpdateUser = form.handleSubmit((data: ProfileType) => {
    updateUser(data);
  });

  const onSubmitChangePassword = formChangePassword.handleSubmit((data: ChangePasswordType) => {
    changePassword(data);
  });

  const handleDeleteUser = () => {
    deleteUser();
  };
  return (
    <div className='min-h-screen bg-linear-to-b from-blue-50 to-white'>
      <div className='ml-48 max-w-4xl px-4 py-8 md:px-6'>
        <div className='mb-8'>
          <h1>Profile Settings</h1>
          <p className='text-muted-foreground'>Manage your account settings and preferences</p>
        </div>

        <div className='space-y-6'>
          {/* Profile Information */}
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

          {/* Security */}
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
                  disabled={
                    formChangePassword.formState.isSubmitting || !formChangePassword.formState.isDirty
                  }
                >
                  Update Password
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Account Details */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Shield className='h-5 w-5' />
                Account Details
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='flex items-center justify-between rounded-lg border p-4'>
                <div>
                  <p>Account Status</p>
                  <p className='text-sm text-muted-foreground'>Your account is active</p>
                </div>
                <div className='flex h-10 w-10 items-center justify-center rounded-full bg-green-100'>
                  <div className='h-3 w-3 rounded-full bg-green-600' />
                </div>
              </div>

              <div className='flex items-center justify-between rounded-lg border p-4'>
                <div>
                  <p>Member Since</p>
                  <p className='text-sm text-muted-foreground'>
                    {new Date(user?.created_at ?? '-').toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'numeric',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                <Mail className='h-5 w-5 text-muted-foreground' />
              </div>

              <Separator />

              <div className='space-y-3'>
                <h4 className='text-sm'>Danger Zone</h4>
                <div className='rounded-lg border border-destructive/50 p-4'>
                  <h4 className='mb-1'>Delete Account</h4>
                  <p className='mb-4 text-sm text-muted-foreground'>
                    Permanently delete your account and all associated data. This action cannot be undone.
                  </p>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant='destructive' size='sm' className='opacity-50 hover:opacity-100'>
                        Delete Account
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete your account and remove
                          your data from our servers.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteUser}>Continue</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

  function newFunction(data: { full_name: string; email: string; role: 'USER' | 'CREATOR'; avatar?: any }) {
    if (data.avatar[0] instanceof FileList) {
      console.log('yes');
    } else {
      console.log('no');
    }
    return;
  }
}
