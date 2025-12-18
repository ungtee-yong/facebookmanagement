import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth/server";

export default async function ReportsPage() {
  const user = await requireUser();

  const pageWhere =
    user.role === "SUPER_ADMIN"
      ? {}
      : { members: { some: { userId: user.id } } };

  const pages = await db.page.findMany({
    where: pageWhere,
    select: { id: true, name: true, fbPageId: true },
    take: 200,
  });

  const pageIds = pages.map((p) => p.id);

  const [totalComments, newComments, repliedComments] = await Promise.all([
    db.comment.count({ where: { post: { pageId: { in: pageIds } } } }),
    db.comment.count({ where: { status: "NEW", post: { pageId: { in: pageIds } } } }),
    db.comment.count({ where: { status: "REPLIED", post: { pageId: { in: pageIds } } } }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Reports</h1>
        <p className="mt-1 text-sm text-zinc-600">
          สถิติโดยรวมจากข้อมูลในฐานข้อมูล (สามารถต่อยอดเป็นรายวัน/กราฟ/Export ได้)
        </p>
      </div>

      <section className="grid gap-3 md:grid-cols-3">
        <div className="rounded-2xl border border-zinc-200 bg-white p-4">
          <div className="text-xs text-zinc-500">Pages</div>
          <div className="mt-1 text-2xl font-semibold">{pages.length}</div>
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-white p-4">
          <div className="text-xs text-zinc-500">Total comments</div>
          <div className="mt-1 text-2xl font-semibold">{totalComments}</div>
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-white p-4">
          <div className="text-xs text-zinc-500">NEW / REPLIED</div>
          <div className="mt-1 text-2xl font-semibold">
            {newComments} / {repliedComments}
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-zinc-200 bg-white p-4">
        <div className="mb-3 text-sm font-semibold">Pages in scope</div>
        {pages.length === 0 ? (
          <div className="text-sm text-zinc-600">ยังไม่มีเพจ</div>
        ) : (
          <div className="grid gap-2 md:grid-cols-2">
            {pages.map((p) => (
              <div key={p.id} className="rounded-xl border border-zinc-200 p-3">
                <div className="text-sm font-medium">{p.name ?? "(no name)"}</div>
                <div className="text-xs text-zinc-500">{p.fbPageId}</div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
