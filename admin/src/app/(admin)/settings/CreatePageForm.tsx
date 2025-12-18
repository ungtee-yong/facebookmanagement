"use client";

import { useActionState } from "react";
import { createPageAction, type CreatePageState } from "./actions";

const initialState: CreatePageState = {};

export function CreatePageForm() {
  const [state, action, pending] = useActionState(createPageAction, initialState);

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-4">
      <div className="mb-3">
        <div className="text-sm font-semibold">Add page (manual)</div>
        <div className="text-xs text-zinc-500">
          ใช้สำหรับสร้าง record เพจในระบบก่อน (ต่อไปจะถูกแทนด้วย flow connect จาก Facebook)
        </div>
      </div>

      <form action={action} className="grid gap-3 md:grid-cols-12">
        <div className="md:col-span-5">
          <label className="text-xs font-medium text-zinc-600">Facebook Page ID</label>
          <input
            name="fbPageId"
            required
            className="mt-1 h-10 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm"
            placeholder="เช่น 1234567890"
          />
        </div>

        <div className="md:col-span-5">
          <label className="text-xs font-medium text-zinc-600">Name (optional)</label>
          <input
            name="name"
            className="mt-1 h-10 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm"
            placeholder="ชื่อเพจ"
          />
        </div>

        <div className="md:col-span-2 md:flex md:items-end">
          <button
            disabled={pending}
            className="h-10 w-full rounded-xl bg-zinc-900 px-3 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-60"
          >
            {pending ? "Adding..." : "Add"}
          </button>
        </div>

        {state.error ? (
          <div className="md:col-span-12 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
            {state.error}
          </div>
        ) : null}
      </form>
    </div>
  );
}
