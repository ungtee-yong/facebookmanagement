import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth/server";
import { redirect } from "next/navigation";
import { CreateUserForm } from "./CreateUserForm";
import { resetUserPasswordAction, toggleUserActiveAction } from "./actions";

export default async function UsersPage() {
  const user = await requireUser();

  if (user.role !== "SUPER_ADMIN") {
    redirect("/dashboard");
  }

  const users = await db.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      isActive: true,
      lastLoginAt: true,
      createdAt: true,
      _count: { select: { memberships: true } },
    },
    take: 200,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Manage Users</h1>
        <p className="mt-1 text-sm text-zinc-600">
          สำหรับ super admin ในการสร้าง/ปิดใช้งาน admin และจัดสิทธิ์เข้าถึงแต่ละเพจ
        </p>
      </div>

      <CreateUserForm />

      <section className="rounded-2xl border border-zinc-200 bg-white p-4">
        <div className="mb-3 text-sm font-semibold">Users</div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="text-left text-xs text-zinc-500">
              <tr className="border-b border-zinc-200">
                <th className="py-2 pr-4">Email</th>
                <th className="py-2 pr-4">Name</th>
                <th className="py-2 pr-4">Role</th>
                <th className="py-2 pr-4">Active</th>
                <th className="py-2 pr-4">Pages</th>
                <th className="py-2 pr-4">Last login</th>
                <th className="py-2 pr-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {users.map((u) => (
                <tr key={u.id}>
                  <td className="py-2 pr-4 font-medium">{u.email}</td>
                  <td className="py-2 pr-4">{u.name ?? "-"}</td>
                  <td className="py-2 pr-4">
                    <span className="rounded-full bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-700">
                      {u.role}
                    </span>
                  </td>
                  <td className="py-2 pr-4">
                    <form action={toggleUserActiveAction}>
                      <input type="hidden" name="id" value={u.id} />
                      <button
                        className={
                          "rounded-full px-3 py-1 text-xs font-medium " +
                          (u.isActive
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-zinc-100 text-zinc-700")
                        }
                      >
                        {u.isActive ? "Active" : "Disabled"}
                      </button>
                    </form>
                  </td>
                  <td className="py-2 pr-4">{u._count.memberships}</td>
                  <td className="py-2 pr-4 text-xs text-zinc-500">
                    {u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleString() : "-"}
                  </td>
                  <td className="py-2 pr-4 text-right">
                    <form action={resetUserPasswordAction}>
                      <input type="hidden" name="id" value={u.id} />
                      <button className="text-xs font-medium text-zinc-800 underline">
                        Reset password
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-3 text-xs text-zinc-500">
          หมายเหตุ: ปุ่ม Reset password ตอนนี้ยังไม่ได้แสดงรหัสใหม่บนหน้า (server action จะคืนค่า แต่ยังไม่ผูก UI)
        </div>
      </section>
    </div>
  );
}
