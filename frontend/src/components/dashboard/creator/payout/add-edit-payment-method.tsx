'use client';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCreateWithdrawalMethod } from '@/hooks/use-creator';
import {
  createWithdrawalMethodSchema,
  CreateWithdrawalMethodType,
  IWithdrawalMethod,
} from '@/types/api/creator-type';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreditCard } from 'lucide-react';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';

interface AddEditPaymentMethodProps {
  isOpenAddEditPaymentMethod: 'add' | 'edit' | null;
  setIsOpenAddEditPaymentMethod: React.Dispatch<React.SetStateAction<'add' | 'edit' | null>>;
  paymentMethod?: IWithdrawalMethod;
}

export default function AddEditPaymentMethod({
  isOpenAddEditPaymentMethod,
  setIsOpenAddEditPaymentMethod,
  paymentMethod,
}: AddEditPaymentMethodProps) {
  const { createWithdrawalMethod, isPending: createWithdrawalMethodPending } = useCreateWithdrawalMethod();

  const form = useForm<CreateWithdrawalMethodType>({
    resolver: zodResolver(createWithdrawalMethodSchema),
    defaultValues: {
      name: '',
      type: 'BANK_TRANSFER',
      details: {},
    },
  });

  useEffect(() => {
    if (paymentMethod) {
      form.reset(paymentMethod);
    }
  }, [isOpenAddEditPaymentMethod, paymentMethod]);

  useEffect(() => {
    if (!paymentMethod && form.watch('type') === 'BANK_TRANSFER') {
      form.setValue('details', {
        account_name: '',
        account_number: '',
        bank_name: '',
      });
    }
    if (!paymentMethod && form.watch('type') === 'E_WALLET') {
      form.setValue('details', {
        provider: '',
        phone: '',
      });
    }
  }, [form.watch('type')]);

  const onSubmit = form.handleSubmit((data: CreateWithdrawalMethodType) => {
    console.log(data);
    // createWithdrawalMethod(data);
    // setIsOpenAddEditPaymentMethod(null);
  });

  return (
    <Dialog
      open={isOpenAddEditPaymentMethod !== null}
      onOpenChange={() => {
        setIsOpenAddEditPaymentMethod(null);
        form.reset();
      }}
    >
      <DialogContent className='max-w-2xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>
            {isOpenAddEditPaymentMethod === 'edit' ? 'Edit Payment Method' : 'Add New Payment Method'}
          </DialogTitle>
          <DialogDescription>
            {isOpenAddEditPaymentMethod === 'edit'
              ? 'Make changes to your payment method details.'
              : 'Add a new payment method to your account.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit}>
          <FieldGroup className='gap-y-6'>
            <Controller
              control={form.control}
              name='name'
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor='pm-name'>Name</FieldLabel>
                  <Input id='pm-name' placeholder='e.g., My BCA Account or PayPal Main' {...field} />
                  {fieldState.error && <FieldError>{fieldState.error.message}</FieldError>}
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name='type'
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor='pm-type'>Type</FieldLabel>
                  <Select defaultValue={paymentMethod?.type ?? undefined} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder='Select type' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='BANK_TRANSFER'>Bank Transfer</SelectItem>
                      <SelectItem value='E_WALLET'>E-Wallet</SelectItem>
                    </SelectContent>
                  </Select>
                  {fieldState.error && <FieldError>{fieldState.error.message}</FieldError>}
                </Field>
              )}
            />
            {form.watch('type') === 'BANK_TRANSFER' && (
              <>
                <Controller
                  control={form.control}
                  name='details.account_name'
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel htmlFor='pm-account-name'>Account Name</FieldLabel>
                      <Input id='pm-account-name' placeholder='Enter account holder name...' {...field} />
                      {fieldState.error && <FieldError>{fieldState.error.message}</FieldError>}
                    </Field>
                  )}
                />

                <Controller
                  control={form.control}
                  name='details.account_number'
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel htmlFor='pm-account-number'>Account Number</FieldLabel>
                      <Input id='pm-account-number' placeholder='Enter account number...' {...field} />
                      {fieldState.error && <FieldError>{fieldState.error.message}</FieldError>}
                    </Field>
                  )}
                />

                <Controller
                  control={form.control}
                  name='details.bank_name'
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel htmlFor='pm-bank-name'>Bank Name</FieldLabel>
                      <Input id='pm-bank-name' placeholder='e.g., Bank Central Asia (BCA)' {...field} />
                      {fieldState.error && <FieldError>{fieldState.error.message}</FieldError>}
                    </Field>
                  )}
                />
              </>
            )}
            {form.watch('type') === 'E_WALLET' && (
              <>
                <Controller
                  control={form.control}
                  name='details.provider'
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel htmlFor='pm-wallet-provider'>Wallet Provider</FieldLabel>
                      <Input id='pm-wallet-provider' placeholder='Enter wallet provider...' {...field} />
                      {fieldState.error && <FieldError>{fieldState.error.message}</FieldError>}
                    </Field>
                  )}
                />

                <Controller
                  control={form.control}
                  name='details.phone'
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel htmlFor='pm-phone'>Phone</FieldLabel>
                      <Input id='pm-phone' placeholder='Enter phone...' {...field} />
                      {fieldState.error && <FieldError>{fieldState.error.message}</FieldError>}
                    </Field>
                  )}
                />
              </>
            )}
            <div className='flex gap-3'>
              <Button
                type='submit'
                className='flex-1 bg-linear-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
                onClick={() => {}}
              >
                <CreditCard className='mr-2 h-4 w-4' />
                {isOpenAddEditPaymentMethod === 'edit' ? 'Save Changes' : 'Add Payment Method'}
              </Button>
              <Button
                type='button'
                variant='outline'
                onClick={() => {
                  setIsOpenAddEditPaymentMethod(null);
                  form.reset();
                }}
              >
                Cancel
              </Button>
            </div>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
}
