import ProfileInformationForm from '@/components/profile/profile-information-form';
import SecurityForm from '@/components/profile/security-form';
import AccountDetail from '@/components/profile/account-detail';

export default function page() {
  return (
    <div className='min-h-screen bg-linear-to-b from-blue-50 to-white'>
      <div className='ml-48 max-w-4xl px-4 py-8 md:px-6'>
        <div className='mb-8'>
          <h1 className='text-lg font-medium'>Profile Settings</h1>
          <p className='text-muted-foreground'>Manage your account settings and preferences</p>
        </div>

        <div className='space-y-6'>
          {/* Profile Information */}
          <ProfileInformationForm />

          {/* Security */}
          <SecurityForm />

          {/* Account Details */}
          <AccountDetail />
        </div>
      </div>
    </div>
  );
}
