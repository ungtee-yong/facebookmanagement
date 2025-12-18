import Link from "next/link";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth/server";
import { canAccessPage } from "@/lib/access";
import { AddFilterForm } from "./AddFilterForm";
import { deleteFilterAction, toggleFilterAction } from "./actions";

export default async function FiltersPage({
  searchParams,
}: {
  searchParams: Promise<{ pageId?: string }>;
}) {
  const user = await requireUser();
  const { pageId: pageIdParam } = await searchParams;

  const pageWhere =
    user.role === "SUPER_ADMIN"
      ? {}
      : { members: { some: { userId: user.id } } };

  const pages = await db.page.findMany({
    where: pageWhere,
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, fbPageId: true, isConnected: true },
    take: 100,
  });

  if (pages.length === 0) {
    return (
      <div className="space-y-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Filters</h1>
          <p className="mt-1 text-sm text-zinc-600">
            กำหนด keyword ที่สนใจ/ไม่สนใจต่อเพจ (include/exclude)
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-4 text-sm text-zinc-700">
          ยังไม่มีเพจในระบบ — ไปที่{" "}
          <Link className="underline" href="/settings">
            Settings
          </Link>{" "}
          เพื่อเพิ่ม/เชื่อมต่อเพจ
        </div>
      </div>
    );
  }

  const selectedPageId =
    (pageIdParam && pages.some((p) => p.id === pageIdParam) && pageIdParam) ||
    pages[0]!.id;

  const ok = await canAccessPage(
    { id: user.id, role: user.role },
    selectedPageId,
  );
  if (!ok) {
    return (
      <div className="rounded-2xl border border-zinc-200 bg-white p-4 text-sm text-zinc-700">
        ไม่มีสิทธิ์เข้าถึงเพจนี้
      </div>
    );
  }

  const filters = await db.keywordFilter.findMany({
    where: { pageId: selectedPageId },
    orderBy: [{ kind: "asc" }, { keyword: "asc" }],
    select: { id: true, kind: true, keyword: true, enabled: true, updatedAt: true },
    take: 500,
  });

  const selectedPage = pages.find((p) => p.id === selectedPageId)!;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Filters</h1>
        <p className="mt-1 text-sm text-zinc-600">
          กำหนด keyword ที่สนใจ/ไม่สนใจต่อเพจ (include/exclude)
        </p>
      </div>

      <section className="rounded-2xl border border-zinc-200 bg-white p-4">
        <div className="mb-3 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-sm font-semibold">Selected page</div>
            <div className="text-xs text-zinc-500">
              {selectedPage.name ?? "(no name)"} • {selectedPage.fbPageId} •{" "}
              {selectedPage.isConnected ? "Connected" : "Not connected"}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-xs text-zinc-500">Switch page:</div>
            <div className="flex flex-wrap gap-2">
              {pages.map((p) => (
                <Link
                  key={p.id}
                  href={`/filters?pageId=${p.id}`}
                  className={
                    "rounded-full border px-3 py-1 text-xs " +
                    (p.id === selectedPageId
                      ? "border-zinc-900 bg-zinc-900 text-white"
                      : "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50")
                  }
                >
                  {p.name ?? p.fbPageId}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <AddFilterForm pageId={selectedPageId} />
      </section>

      <section className="rounded-2xl border border-zinc-200 bg-white p-4">
        <div className="mb-3 text-sm font-semibold">Keywords</div>

        {filters.length === 0 ? (
          <div className="text-sm text-zinc-600">
            ยังไม่มี keyword — เพิ่มจากฟอร์มด้านบนได้เลย
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="text-left text-xs text-zinc-500">
                <tr className="border-b border-zinc-200">
                  <th className="py-2 pr-4">Kind</th>
                  <th className="py-2 pr-4">Keyword</th>
                  <th className="py-2 pr-4">Enabled</th>
                  <th className="py-2 pr-4">Updated</th>
                  <th className="py-2 pr-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {filters.map((f) => (
                  <tr key={f.id}>
                    <td className="py-2 pr-4">
                      <span
                        className={
                          "rounded-full px-2 py-1 text-xs font-medium " +
                          (f.kind === "INCLUDE"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-amber-50 text-amber-700")
                        }
                      >
                        {f.kind}
                      </span>
                    </td>
                    <td className="py-2 pr-4">{f.keyword}</td>
                    <td className="py-2 pr-4">
                      <form action={toggleFilterAction}>
                        <input type="hidden" name="id" value={f.id} />
                        <input type="hidden" name="pageId" value={selectedPageId} />
                        <button
                          className={
                            "rounded-full px-3 py-1 text-xs font-medium " +
                            (f.enabled
                              ? "bg-zinc-900 text-white"
                              : "bg-zinc-100 text-zinc-700")
                          }
                        >
                          {f.enabled ? "On" : "Off"}
                        </button>
                      </form>
                    </td>
                    <td className="py-2 pr-4 text-xs text-zinc-500">
                      {new Date(f.updatedAt).toLocaleString()}
                    </td>
                    <td className="py-2 pr-4 text-right">
                      <form action={deleteFilterAction}>
                        <input type="hidden" name="id" value={f.id} />
                        <input type="hidden" name="pageId" value={selectedPageId} />
                        <button className="text-xs font-medium text-red-700 underline">
                          Delete
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
