'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { Button, Card, Input } from '@/components/ui';

export default function LoginPage() {
  const searchParams = useSearchParams();
  const next = searchParams.get('next') || '/dashboard';

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="min-h-screen">
      <div className="container-page flex min-h-screen items-center justify-center py-10">
        <div className="w-full max-w-md">
          <div className="mb-6">
            <div className="text-lg font-semibold text-slate-900">Admin Login</div>
            <div className="mt-1 text-sm text-slate-600">
              เข้าสู่ระบบเพื่อจัดการ Facebook Page Monitor
            </div>
          </div>

          <Card title="เข้าสู่ระบบ">
            <form
              className="space-y-4"
              onSubmit={async (e) => {
                e.preventDefault();
                setLoading(true);
                setError(null);

                const form = new FormData(e.currentTarget);
                const email = String(form.get('email') || '');
                const password = String(form.get('password') || '');

                const res = await signIn('credentials', {
                  email,
                  password,
                  redirect: false
                });

                setLoading(false);

                if (!res || res.error) {
                  setError('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
                  return;
                }

                window.location.href = next;
              }}
            >
              <Input name="email" label="Email" type="email" placeholder="admin@company.com" required />
              <Input name="password" label="Password" type="password" required />

              {error && (
                <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                  {error}
                </div>
              )}

              <div className="flex items-center justify-between">
                <Button type="submit" disabled={loading}>
                  {loading ? 'Logging in…' : 'Login'}
                </Button>
                <div className="text-xs text-slate-500">Forgot password: ติดต่อ super admin</div>
              </div>
            </form>
          </Card>

          <div className="mt-6 text-xs text-slate-500">
            หมายเหตุ: สำหรับ dev เริ่มต้นใช้ seed เพื่อสร้าง super admin ได้
          </div>
        </div>
      </div>
    </div>
  );
}
