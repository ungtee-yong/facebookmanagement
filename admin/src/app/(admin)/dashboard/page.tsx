import Link from "next/link";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth/server";

export default async function DashboardPage() {
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
    take: 20,
  });

  const recentComments = await db.comment.findMany({
    where: {
      post: { page: pageWhere },
    },
    orderBy: { createdAt: "desc" },
    take: 20,
    select: {
      id: true,
      message: true,
      status: true,
      createdAt: true,
      post: {
        select: {
          fbPostId: true,
          message: true,
          page: { select: { name: true, fbPageId: true } },
        },
      },
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Dashboard</h1>
        <p className="mt-1 text-sm text-zinc-600">
          ดูภาพรวมการเชื่อมต่อเพจ และคอมเมนต์ล่าสุด
        </p>
      </div>

      <section className="rounded-2xl border border-zinc-200 bg-white p-4">
        <div className="mb-3 flex items-center justify-between">
          <div className="text-sm font-semibold">Pages</div>
          <Link href="/settings" className="text-sm text-zinc-700 underline">
            ไปที่ Settings
          </Link>
        </div>

        {pages.length === 0 ? (
          <div className="text-sm text-zinc-600">
            ยังไม่มีเพจในระบบ — ไปที่ <Link className="underline" href="/settings">Settings</Link> เพื่อเชื่อมต่อ
          </div>
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

      <section className="rounded-2xl border border-zinc-200 bg-white p-4">
        <div className="mb-3 flex items-center justify-between">
          <div className="text-sm font-semibold">Recent comments</div>
          <Link href="/reports" className="text-sm text-zinc-700 underline">
            ดูรายงาน
          </Link>
        </div>

        {recentComments.length === 0 ? (
          <div className="text-sm text-zinc-600">ยังไม่มีคอมเมนต์ในฐานข้อมูล</div>
        ) : (
          <div className="divide-y divide-zinc-100">
            {recentComments.map((c) => (
              <div key={c.id} className="py-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="text-sm font-medium truncate">
                      {c.post.page.name ?? c.post.page.fbPageId}
                    </div>
                    <div className="mt-1 text-sm text-zinc-700">
                      {c.message ?? "(no message)"}
                    </div>
                    <div className="mt-1 text-xs text-zinc-500">
                      {new Date(c.createdAt).toLocaleString()} • Status: {c.status}
                    </div>
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
