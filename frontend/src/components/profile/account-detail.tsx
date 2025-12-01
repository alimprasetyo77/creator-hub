'use client';

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
} from '../ui/alert-dialog';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Mail, Shield } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { useDeleteUser } from '@/hooks/use-users';

export default function AccountDetail() {
  const { deleteUser } = useDeleteUser();
  const { user } = useAuth();
  const handleDeleteUser = () => {
    deleteUser();
  };
  return (
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
                    This action cannot be undone. This will permanently delete your account and remove your
                    data from our servers.
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
  );
}
