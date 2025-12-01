import Navbar from '@/components/layouts/navbar';
import { AuthProvider } from '@/contexts/auth-context';
import { cookies } from 'next/headers';

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token');
  return (
    <>
      <AuthProvider hasToken={!!token}>
        <Navbar />
        {children}
      </AuthProvider>
    </>
  );
}
