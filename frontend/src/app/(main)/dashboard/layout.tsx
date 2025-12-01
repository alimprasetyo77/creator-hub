import { ReactNode } from 'react';
import SidebarNav from '../../../components/layouts/sidebar';
import { LayoutDashboard, Package, Receipt, Upload, Wallet } from 'lucide-react';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const sidebarItems = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard className='size-5' /> },
    { id: 'products', label: 'My Products', icon: <Package className='size-5' /> },
    { id: 'upload', label: 'Upload Product', icon: <Upload className='size-5' /> },
    { id: 'transactions', label: 'Transactions', icon: <Receipt className='size-5' /> },
    { id: 'payouts', label: 'Payouts', icon: <Wallet className='size-5' /> },
  ];

  return (
    <div className='flex min-h-screen'>
      <aside className='hidden w-64 border-r bg-muted/30 lg:block'>
        <div className='fixed top-16 h-[calc(100vh-4rem)] overflow-y-auto w-[inherit]'>
          <SidebarNav items={sidebarItems} />
        </div>
      </aside>
      <main className='flex-1'>
        <div className='p-6 md:p-8'>{children}</div>
      </main>
    </div>
  );
}
