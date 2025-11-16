'use client';

import { ShoppingBag, User, LogOut, LayoutDashboard, Menu } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { useLogout } from '@/hooks/use-auth';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

export default function Navbar() {
  const pathname = usePathname();
  const { logout } = useLogout();
  const { user } = useAuth();
  const router = useRouter();
  return (
    <nav className='sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60'>
      <div className='container mx-auto flex h-16 items-center justify-between px-4 md:px-6'>
        <div className='flex items-center gap-6'>
          <button
            onClick={() => router.push('/')}
            className='flex items-center gap-2 transition-opacity hover:opacity-80'
          >
            <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-blue-600 to-purple-600'>
              <ShoppingBag className='h-5 w-5 text-white' />
            </div>
            <span className='text-xl'>CreatorHub</span>
          </button>

          <div className='hidden items-center gap-1 md:flex'>
            <Button
              variant={pathname === '/marketplace' ? 'secondary' : 'ghost'}
              onClick={() => router.push('/explore')}
            >
              Explore
            </Button>
            {user?.role.toLowerCase() === 'creator' && (
              <Button
                variant={pathname === '/creator-dashboard' ? 'secondary' : 'ghost'}
                onClick={() => router.push('/creator-dashboard')}
              >
                Dashboard
              </Button>
            )}
            {user?.role.toLowerCase() === 'admin' && (
              <Button
                variant={pathname === '/admin-dashboard' ? 'secondary' : 'ghost'}
                onClick={() => router.push('/admin-dashboard')}
              >
                Admin
              </Button>
            )}
          </div>
        </div>

        <div className='flex items-center gap-2'>
          {!user?.token ? (
            <>
              <Button variant='ghost' onClick={() => router.push('/login')}>
                Log in
              </Button>
              <Button
                className='hidden bg-linear-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 sm:inline-flex'
                onClick={() => router.push('/register')}
              >
                Get Started
              </Button>
            </>
          ) : (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant='ghost' className='relative h-10 w-10 rounded-full'>
                    <Avatar className='h-10 w-10'>
                      <AvatarImage src={user?.avatar} alt={user?.full_name} />
                      <AvatarFallback>{user?.full_name?.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className='w-56' align='end'>
                  <div className='flex items-center justify-start gap-2 p-2'>
                    <div className='flex flex-col space-y-1'>
                      <p className='leading-none'>{user?.full_name?.split(' ')[0]}</p>
                      <p className='text-muted-foreground text-sm leading-none'>{user?.email}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  {user?.role?.toLowerCase() === 'creator' && (
                    <DropdownMenuItem onClick={() => router.push('creator-dashboard')}>
                      <LayoutDashboard className='mr-2 h-4 w-4' />
                      <span>Creator Dashboard</span>
                    </DropdownMenuItem>
                  )}
                  {user?.role?.toLowerCase() === 'user' && (
                    <DropdownMenuItem onClick={() => router.push('/my-purchases')}>
                      <LayoutDashboard className='mr-2 h-4 w-4' />
                      <span>My Purchases</span>
                    </DropdownMenuItem>
                  )}
                  {user?.role?.toLowerCase() === 'admin' && (
                    <DropdownMenuItem onClick={() => router.push('/admin-dashboard')}>
                      <LayoutDashboard className='mr-2 h-4 w-4' />
                      <span>Admin Dashboard</span>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={() => router.push('/profile')}>
                    <User className='mr-2 h-4 w-4' />
                    <span>Profile Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => logout()}>
                    <LogOut className='mr-2 h-4 w-4' />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button variant='ghost' size='icon' className='md:hidden'>
                <Menu className='h-5 w-5' />
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
