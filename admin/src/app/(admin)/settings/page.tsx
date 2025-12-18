import Link from "next/link";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth/server";
import { CreatePageForm } from "./CreatePageForm";

export default async function SettingsPage() {
  const user = await requireUser();

  const pageWhere =
    user.role === "SUPER_ADMIN"
      ? {}
      : { members: { some: { userId: user.id } } };

  const pages = await db.page.findMany({
    where: pageWhere,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      fbPageId: true,
      isConnected: true,
      connectedAt: true,
    },
    take: 100,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Settings</h1>
        <p className="mt-1 text-sm text-zinc-600">
          เชื่อมต่อเพจกับ Facebook App และจัดการการเชื่อมต่อ
        </p>
      </div>

      <section className="rounded-2xl border border-zinc-200 bg-white p-4">
        <div className="mb-2 text-sm font-semibold">Facebook connection</div>
        <div className="text-sm text-zinc-700">
          <a
            href="/api/facebook/connect"
            className="inline-flex h-10 items-center rounded-xl bg-zinc-900 px-4 text-sm font-medium text-white hover:bg-zinc-800"
          >
            Connect Facebook App
          </a>
        </div>
        <div className="mt-2 text-xs text-zinc-500">
          ต้องตั้งค่า <code className="rounded bg-zinc-100 px-1">FACEBOOK_APP_ID</code>,{" "}
          <code className="rounded bg-zinc-100 px-1">FACEBOOK_APP_SECRET</code>,{" "}
          <code className="rounded bg-zinc-100 px-1">FACEBOOK_REDIRECT_URI</code>
        </div>
      </section>

      {user.role === "SUPER_ADMIN" ? <CreatePageForm /> : null}

      <section className="rounded-2xl border border-zinc-200 bg-white p-4">
        <div className="mb-3 flex items-center justify-between">
          <div className="text-sm font-semibold">Pages</div>
          <Link href="/filters" className="text-sm text-zinc-700 underline">
            ไปที่ Filters
          </Link>
        </div>

        {pages.length === 0 ? (
          <div className="text-sm text-zinc-600">ยังไม่มีเพจในระบบ</div>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {pages.map((p) => (
              <div key={p.id} className="rounded-xl border border-zinc-200 p-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium">{p.name ?? "(no name)"}</div>
                    <div className="truncate text-xs text-zinc-500">Page ID: {p.fbPageId}</div>
                  </div>
                  <div
                    className={
                      "shrink-0 rounded-full px-2 py-1 text-xs font-medium " +
                      (p.isConnected
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-zinc-100 text-zinc-700")
                    }
                  >
                    {p.isConnected ? "Connected" : "Not connected"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
