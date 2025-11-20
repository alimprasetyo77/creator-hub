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
    <nav className='flex flex-col gap-1 p-4 '>
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => navigateTo(item.id)}
          className={cn(
            'flex items-center gap-3 rounded-lg px-3 py-2 transition-colors w-full text-sm ',
            pathToCompare === item.id
              ? 'bg-slate-200/70 text-sidebar-foreground '
              : 'text-sidebar-primary/90 hover:bg-slate-200/50 hover:text-foreground cursor-pointer'
          )}
        >
          {item.icon}
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  );
}
