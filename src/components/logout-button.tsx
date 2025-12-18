'use client';

import { signOut } from 'next-auth/react';

export function LogoutButton() {
  return (
    <button
      className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
      onClick={() => signOut({ callbackUrl: '/login' })}
    >
      Log out
    </button>
  );
}
