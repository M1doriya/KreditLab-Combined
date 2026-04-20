"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { supabase } from "../../../../lib/supabase";

export default function NewCasePage() {
  const router = useRouter();

  const [clientName, setClientName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [industry, setIndustry] = useState("");
  const [employeeCount, setEmployeeCount] = useState("");
  const [annualRevenue, setAnnualRevenue] = useState("");
  const [requestedAmount, setRequestedAmount] = useState("");
  const [loanPurpose, setLoanPurpose] = useState("");
  const [initialNotes, setInitialNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleCreateCase = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    const { data: authData } = await supabase.auth.getUser();
    const user = authData.user;

    if (!user) {
      setErrorMsg("You must be logged in.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("cases").insert([
      {
        client_name: clientName,
        company_name: companyName,
        email,
        phone,
        industry,
        employee_count: employeeCount ? Number(employeeCount) : null,
        annual_revenue: annualRevenue ? Number(annualRevenue) : null,
        requested_amount: Number(requestedAmount),
        loan_purpose: loanPurpose,
        initial_notes: initialNotes,
        created_by: user.id,
      },
    ]);

    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard/cases");
  };

  return (
    <main className="min-h-screen bg-slate-100 px-6 py-8">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/dashboard/cases"
          className="mb-6 inline-flex text-sm text-slate-600 hover:text-slate-900"
        >
          ← Back to Cases
        </Link>

        <form onSubmit={handleCreateCase} className="space-y-6">
          {/* Client Info */}
          <section className="rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold">Client Information</h2>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <input
                placeholder="Client Name"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="border p-3 rounded-xl"
                required
              />

              <input
                placeholder="Company Name"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="border p-3 rounded-xl"
                required
              />

              <input
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border p-3 rounded-xl"
                required
              />

              <input
                placeholder="Phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="border p-3 rounded-xl"
              />
            </div>
          </section>

          {/* Business */}
          <section className="rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold">Business Details</h2>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <input
                placeholder="Industry"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="border p-3 rounded-xl"
                required
              />

              <input
                type="number"
                placeholder="Employee Count"
                value={employeeCount}
                onChange={(e) => setEmployeeCount(e.target.value)}
                className="border p-3 rounded-xl"
              />

              <input
                type="number"
                placeholder="Annual Revenue"
                value={annualRevenue}
                onChange={(e) => setAnnualRevenue(e.target.value)}
                className="border p-3 rounded-xl md:col-span-2"
              />
            </div>
          </section>

          {/* Loan */}
          <section className="rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold">Loan Request</h2>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <input
                type="number"
                placeholder="Requested Amount"
                value={requestedAmount}
                onChange={(e) => setRequestedAmount(e.target.value)}
                className="border p-3 rounded-xl"
                required
              />

              <input
                placeholder="Loan Purpose"
                value={loanPurpose}
                onChange={(e) => setLoanPurpose(e.target.value)}
                className="border p-3 rounded-xl"
                required
              />

              <textarea
                placeholder="Notes..."
                value={initialNotes}
                onChange={(e) => setInitialNotes(e.target.value)}
                className="border p-3 rounded-xl md:col-span-2"
              />
            </div>
          </section>

          {errorMsg && (
            <p className="text-red-500 text-sm">{errorMsg}</p>
          )}

          <div className="flex justify-end gap-3">
            <Link
              href="/dashboard/cases"
              className="border px-4 py-2 rounded-xl"
            >
              Cancel
            </Link>

            <button
              type="submit"
              className="bg-cyan-400 px-4 py-2 rounded-xl"
            >
              {loading ? "Creating..." : "Create Case"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}