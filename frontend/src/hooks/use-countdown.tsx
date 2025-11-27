'use client';
import { useEffect, useState } from 'react';
import { getDiffSeconds } from '@/lib/utils';

export default function Countdown({ startTime, expiryTime }: { startTime: string; expiryTime: string }) {
  const [secondsLeft, setSecondsLeft] = useState<number>(getDiffSeconds(startTime, expiryTime));

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          window.location.reload();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const hours = Math.floor(secondsLeft / 3600);
  const minutes = Math.floor(secondsLeft / 60 - hours * 60);
  const seconds = secondsLeft % 60;

  return (
    <div className='*:p-3 *:font-medium *:bg-white *:rounded-xl my-4 space-x-3'>
      <span>{hours}h</span>
      <span>{minutes}m</span>
      <span>{seconds.toString().padStart(2, '0')}s</span>
    </div>
  );
}
