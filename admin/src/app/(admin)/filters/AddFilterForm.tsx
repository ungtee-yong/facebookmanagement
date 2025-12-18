"use client";

import { useActionState } from "react";
import { addFilterAction } from "./actions";

export function AddFilterForm({ pageId }: { pageId: string }) {
  const [state, action, pending] = useActionState(addFilterAction, {});

  return (
    <form action={action} className="grid gap-3 md:grid-cols-12">
      <input type="hidden" name="pageId" value={pageId} />

      <div className="md:col-span-3">
        <label className="text-xs font-medium text-zinc-600">Kind</label>
        <select
          name="kind"
          className="mt-1 h-10 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm"
          defaultValue="INCLUDE"
        >
          <option value="INCLUDE">Include</option>
          <option value="EXCLUDE">Exclude</option>
        </select>
      </div>

      <div className="md:col-span-7">
        <label className="text-xs font-medium text-zinc-600">Keyword</label>
        <input
          name="keyword"
          required
          placeholder="เช่น ราคา, โปร, สนใจ"
          className="mt-1 h-10 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm"
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
  );
}
