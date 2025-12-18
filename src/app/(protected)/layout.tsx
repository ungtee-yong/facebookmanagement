import { auth } from '@/auth';
import { AdminShell } from '@/components/admin-shell';

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const userLabel = session?.user?.email ?? 'Unknown';

  return <AdminShell userLabel={userLabel}>{children}</AdminShell>;
}
