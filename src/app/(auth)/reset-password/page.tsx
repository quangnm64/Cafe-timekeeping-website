import { ChangePasswordPage } from '@/modules/auth/components/form-reset-password';

export default function Page() {
  return (
    <ChangePasswordPage
      onBack={function (): void {
        throw new Error('Function not implemented.');
      }}
    />
  );
}
