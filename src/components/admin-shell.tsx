import Link from 'next/link';
import { LogoutButton } from '@/components/logout-button';

export function AdminShell({
  userLabel,
  children
}: {
  userLabel: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <div className="border-b border-slate-200 bg-white">
        <div className="container-page flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="text-sm font-semibold text-slate-900">
              Facebook Page Monitor
            </Link>
            <nav className="hidden items-center gap-4 text-sm text-slate-600 md:flex">
              <Link className="hover:text-slate-900" href="/dashboard">
                Dashboard
              </Link>
              <Link className="hover:text-slate-900" href="/filters">
                Filter
              </Link>
              <Link className="hover:text-slate-900" href="/settings/facebook">
                Setting
              </Link>
              <Link className="hover:text-slate-900" href="/reports">
                Report
              </Link>
              <Link className="hover:text-slate-900" href="/admin/users">
                Manage User
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden text-xs text-slate-600 sm:block">{userLabel}</div>
            <LogoutButton />
          </div>
        </div>
      </div>

      <main className="container-page py-6">{children}</main>

      <footer className="container-page py-10 text-xs text-slate-500">
        © {new Date().getFullYear()} Facebook Page Monitor
      </footer>
    </div>
  );
}
