import { Skeleton } from '../ui/skeleton';

export default function SidebarSkeleton() {
  return (
    <nav className='flex flex-col gap-1 p-4  '>
      {Array.from({ length: 5 }).map((_, index) => {
        return (
          <button
            className={'flex items-center gap-3 rounded-lg px-3 py-2 transition-colors w-full'}
            key={index}
          >
            <Skeleton className='size-6 ' />
            <Skeleton className='w-full h-6' />
          </button>
        );
      })}
    </nav>
  );
}
