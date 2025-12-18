"use client";

import { useActionState } from "react";
import { createUserAction, type CreateUserState } from "./actions";

const initialState: CreateUserState = {};

export function CreateUserForm() {
  const [state, action, pending] = useActionState(createUserAction, initialState);

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-4">
      <div className="mb-3">
        <div className="text-sm font-semibold">Create user</div>
        <div className="text-xs text-zinc-500">
          สร้างผู้ใช้ role = ADMIN/AGENT (หากไม่ใส่รหัสผ่าน ระบบจะสุ่มให้)
        </div>
      </div>

      <form action={action} className="grid gap-3 md:grid-cols-12">
        <div className="md:col-span-4">
          <label className="text-xs font-medium text-zinc-600">Email</label>
          <input
            name="email"
            type="email"
            required
            className="mt-1 h-10 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm"
          />
        </div>

        <div className="md:col-span-3">
          <label className="text-xs font-medium text-zinc-600">Name (optional)</label>
          <input
            name="name"
            className="mt-1 h-10 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm"
          />
        </div>

        <div className="md:col-span-2">
          <label className="text-xs font-medium text-zinc-600">Role</label>
          <select
            name="role"
            className="mt-1 h-10 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm"
            defaultValue="ADMIN"
          >
            <option value="ADMIN">ADMIN</option>
            <option value="AGENT">AGENT</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="text-xs font-medium text-zinc-600">Password</label>
          <input
            name="password"
            type="text"
            placeholder="(auto)"
            className="mt-1 h-10 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm"
          />
        </div>

        <div className="md:col-span-1 md:flex md:items-end">
          <button
            disabled={pending}
            className="h-10 w-full rounded-xl bg-zinc-900 px-3 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-60"
          >
            {pending ? "..." : "Create"}
          </button>
        </div>

        {state.error ? (
          <div className="md:col-span-12 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
            {state.error}
          </div>
        ) : null}

        {state.createdEmail && state.createdPassword ? (
          <div className="md:col-span-12 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-900">
            สร้างผู้ใช้สำเร็จ: <b>{state.createdEmail}</b> — Password: <b>{state.createdPassword}</b>
          </div>
        ) : null}
      </form>
    </div>
  );
}
