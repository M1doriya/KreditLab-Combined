import Link from "next/link";

export default function CasesPage() {
  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Cases</h1>
          <p className="mt-1 text-slate-600">
            Manage registered client cases.
          </p>
        </div>

        <Link
          href="/dashboard/cases/new"
          className="rounded-xl bg-cyan-400 px-4 py-3 font-medium text-slate-900 hover:bg-cyan-300"
        >
          Create Case
        </Link>
      </div>

      <div className="mt-6 rounded-xl bg-white p-6 shadow-sm">
        <p className="text-slate-500">
          No cases yet. Click "Create Case" to add one.
        </p>
      </div>
    </main>
  );
}