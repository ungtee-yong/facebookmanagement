import Link from "next/link";
import { logoutAction } from "@/app/(auth)/login/actions";
import type { UserRole } from "@prisma/client";

const NAV: Array<{ href: string; label: string; roles?: UserRole[] }> = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/filters", label: "Filters" },
  { href: "/settings", label: "Settings" },
  { href: "/reports", label: "Reports" },
  { href: "/users", label: "Manage Users", roles: ["SUPER_ADMIN"] },
];

export function AdminShell({
  user,
  children,
}: {
  user: { id: string; email: string; name: string | null; role: UserRole };
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl">
        <aside className="hidden w-64 flex-col border-r border-zinc-200 bg-white p-4 md:flex">
          <div className="mb-6">
            <div className="text-sm font-semibold tracking-tight">Facebook Page Monitor</div>
            <div className="text-xs text-zinc-500">Admin Console</div>
          </div>

          <nav className="flex flex-col gap-1">
            {NAV.filter((i) => !i.roles || i.roles.includes(user.role)).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="mt-auto rounded-xl border border-zinc-200 bg-zinc-50 p-3">
            <div className="text-sm font-medium truncate">{user.name ?? user.email}</div>
            <div className="text-xs text-zinc-500">Role: {user.role}</div>
            <form action={logoutAction} className="mt-3">
              <button className="w-full rounded-lg bg-zinc-900 px-3 py-2 text-sm font-medium text-white hover:bg-zinc-800">
                Logout
              </button>
            </form>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex items-center justify-between border-b border-zinc-200 bg-white px-4 py-3 md:px-6">
            <div className="text-sm font-semibold">Admin</div>
            <div className="text-xs text-zinc-500">{user.email}</div>
          </header>

          <main className="flex-1 p-4 md:p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
