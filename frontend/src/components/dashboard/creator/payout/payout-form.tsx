'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCreatePayout } from '@/hooks/use-creator';
import { formatIDR } from '@/lib/utils';
import { createPayoutSchema, CreatePayoutType } from '@/types/api/creator-type';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreditCard } from 'lucide-react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

const PayoutForm = () => {
  const { createPayout, isPending } = useCreatePayout();
  const [fee, setFee] = useState(0);
  const [total, setTotal] = useState(0);
  const form = useForm<CreatePayoutType>({
    resolver: zodResolver(createPayoutSchema),
    defaultValues: {
      amount: '0',
      method: '',
    },
  });

  const onSubmit = form.handleSubmit((data: CreatePayoutType) => {
    createPayout(data, {
      onSettled: () => {
        setFee(0);
        setTotal(0);
        form.reset();
      },
    });
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Request Withdrawal</CardTitle>
      </CardHeader>
      <CardContent>
        <form className='space-y-6' onSubmit={onSubmit}>
          <FieldGroup className='grid gap-6 md:grid-cols-2 '>
            <Controller
              control={form.control}
              name='amount'
              render={({ field, fieldState }) => (
                <Field className='space-y-0'>
                  <FieldLabel htmlFor='amount'>Withdrawal Amount (IDR)</FieldLabel>
                  <Input
                    id='amount'
                    type='text'
                    placeholder='Enter amount'
                    {...field}
                    onChange={(e) => {
                      let raw = e.target.value.replace(/[^0-9]/g, '');
                      if (!raw) return form.setValue('amount', '');
                      setFee(parseInt(raw) * 0.02);
                      setTotal(parseInt(raw) * 0.98);
                      form.setValue('amount', formatIDR(+raw));
                    }}
                  />
                  <FieldDescription className='text-sm text-muted-foreground'>
                    Minimum withdrawal: Rp 500,000
                  </FieldDescription>
                  {fieldState.error && <p className='text-sm text-destructive'>{fieldState.error.message}</p>}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name='method'
              render={({ field, fieldState }) => (
                <Field className='space-y-0'>
                  <FieldLabel htmlFor='method'>Withdrawal Method</FieldLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder='Select method' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='bank'>Bank Transfer</SelectItem>
                      <SelectItem value='paypal'>PayPal</SelectItem>
                      <SelectItem value='stripe'>Stripe</SelectItem>
                    </SelectContent>
                  </Select>
                  {fieldState.error && <p className='text-sm text-destructive'>{fieldState.error.message}</p>}
                </Field>
              )}
            />

            <Field className='col-span-2 rounded-lg border bg-muted/50 p-4 space-y-0'>
              <div className='space-y-2 text-sm'>
                <div className='flex justify-between'>
                  <span className='text-muted-foreground'>Withdrawal Amount:</span>
                  <span>{form.watch('amount')}</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-muted-foreground'>Processing Fee (2%):</span>
                  <span>{formatIDR(fee)}</span>
                </div>
                <div className='flex justify-between border-t pt-2'>
                  <span>You'll receive:</span>
                  <span className='text-xl'>{formatIDR(total)}</span>
                </div>
              </div>
            </Field>
          </FieldGroup>
          <Button
            type='submit'
            className='bg-linear-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
            disabled={!form.formState.isDirty || isPending}
          >
            <CreditCard className='mr-2 h-4 w-4' />
            Request Withdrawal
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default PayoutForm;
