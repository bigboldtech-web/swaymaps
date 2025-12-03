import React from "react";
import { User } from "../types/map";

interface AdminPanelProps {
  users: User[];
  onAddUser: (name: string, color?: string) => void;
  onClose: () => void;
}

const swatches = ["#0ea5e9", "#22c55e", "#f59e0b", "#ef4444", "#6b7280"];

export function AdminPanel({ users, onAddUser, onClose }: AdminPanelProps) {
  const [name, setName] = React.useState("");
  const [color, setColor] = React.useState<string | undefined>(swatches[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAddUser(name.trim(), color);
    setName("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
      <div className="w-full max-w-lg rounded-xl border border-slate-200 bg-white p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-wide text-slate-500">Admin</div>
            <div className="text-lg font-semibold text-slate-900">Manage users</div>
          </div>
          <button
            className="rounded-full border border-slate-200 px-3 py-1 text-sm font-semibold text-slate-600 hover:border-slate-300"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs uppercase tracking-wide text-slate-500">Name</label>
            <input
              className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-300"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Jane Doe"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-wide text-slate-500">Color</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {swatches.map((swatch) => (
                <button
                  key={swatch}
                  type="button"
                  className={`h-8 w-8 rounded-full border ${color === swatch ? "border-blue-500 ring-2 ring-blue-300" : "border-slate-200"}`}
                  style={{ backgroundColor: swatch }}
                  onClick={() => setColor(swatch)}
                  aria-label={`Pick ${swatch}`}
                />
              ))}
            </div>
          </div>
          <button
            type="submit"
            className="w-full rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
          >
            Add user
          </button>
        </form>

        <div className="mt-6">
          <div className="text-sm font-semibold text-slate-700">Existing users</div>
          <ul className="mt-2 space-y-2">
            {users.map((user) => (
              <li
                key={user.id}
                className="flex items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-800"
              >
                <span
                  className="inline-block h-3 w-3 rounded-full border border-slate-200"
                  style={{ backgroundColor: user.color || "#e2e8f0" }}
                />
                <span className="font-semibold">{user.name}</span>
              </li>
            ))}
            {users.length === 0 && (
              <li className="rounded-md border border-dashed border-slate-200 px-3 py-2 text-sm text-slate-500">
                No users yet.
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
