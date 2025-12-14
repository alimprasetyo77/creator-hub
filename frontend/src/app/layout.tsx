import { Geist, Geist_Mono } from 'next/font/google';
import type { Metadata } from 'next';
import './globals.css';
import Providers from '@/app/providers';
import { AuthProvider } from '@/contexts/auth-context';
import { cookies } from 'next/headers';
import ProtectedRoute from '@/components/protected-routes';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'CreatorHub',
  description:
    'Digital Product Marketplace. Sell your designs and templates. Buy from talented creators. Get started now.',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  return (
    <html lang='en'>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>
          <AuthProvider hasToken={!!token}>
            <ProtectedRoute>{children}</ProtectedRoute>
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
