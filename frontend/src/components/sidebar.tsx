'use client';
import { cn } from '@/lib/utils';
import { usePathname, useRouter } from 'next/navigation';
import { ReactNode } from 'react';

interface SidebarNavProps {
  items: { id: string; label: string; icon: ReactNode }[];
}

export default function SidebarNav({ items }: SidebarNavProps) {
  const router = useRouter();
  const pathname = usePathname();
  const pathToCompare = pathname.split('/').pop();
  const navigateTo = (id: string) => {
    router.push(`${pathname.split('/').slice(0, -1).join('/')}/${id}`);
  };
  return (
    <nav className='flex flex-col gap-1 p-4'>
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => navigateTo(item.id)}
          className={cn(
            'flex items-center gap-3 rounded-lg px-3 py-2 transition-colors',
            pathToCompare === item.id
              ? 'bg-secondary text-secondary-foreground'
              : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground'
          )}
        >
          {item.icon}
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  );
}
