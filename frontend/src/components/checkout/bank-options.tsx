import { bankOptions } from '@/constants/checkout';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { BankOptionType } from '@/app/(protected)/checkout/[id]/page';
import Image from 'next/image';
import { CheckCircle } from 'lucide-react';

interface IBankOptionsProps {
  onSelectBank: (bank: BankOptionType) => void;
  selectedBank: BankOptionType;
}

export default function BankOptions({ selectedBank, onSelectBank }: IBankOptionsProps) {
  return (
    <Card className='border-none shadow-sm'>
      <CardHeader>
        <CardTitle>Select Bank</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='grid grid-cols-2 gap-3'>
          {bankOptions.map((bank) => (
            <button
              key={bank.id}
              onClick={() => onSelectBank(bank.id as BankOptionType)}
              className={`flex items-center gap-3 rounded-lg border-2 p-4 transition-all hover:border-blue-300 ${
                selectedBank === bank.id
                  ? 'border-blue-600 bg-linear-to-br from-blue-50 to-purple-50'
                  : 'border-border bg-white'
              }`}
            >
              <Image
                src={bank.logo}
                alt={bank.name}
                width={80}
                height={80}
                className='w-auto h-6 object-contain object-left'
              />
              <span className='font-medium'>{bank.name}</span>
              {selectedBank === bank.id && <CheckCircle className='ml-auto h-4 w-4 text-blue-600' />}
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
