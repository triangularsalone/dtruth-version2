"use client"

import { useState, type FormEvent } from "react"

export default function PartnershipStatusPage() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<string | null>(null)
  const [adminMessage, setAdminMessage] = useState<string | null>(null)
  const [nextStepUrl, setNextStepUrl] = useState<string | null>(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError("")
    setStatus(null)
    setAdminMessage(null)
    setNextStepUrl(null)

    if (!email.trim()) {
      setError("Please enter the same email address you used to submit your partnership request.")
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/partner/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      })
      const json = await response.json()
      if (!response.ok) {
        throw new Error(json.error || "Unable to check status.")
      }

      setStatus(json.request.status)
      setAdminMessage(json.request.admin_message)
      setNextStepUrl(json.request.next_step_url)
    } catch (err: any) {
      setError(err.message || "Something went wrong while checking status.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-4xl border border-slate-200 bg-white p-10 shadow-xl shadow-slate-200/50">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">Check partnership request status</h1>
          <p className="text-slate-600 mb-6">
            Enter the email address you used when submitting the partnership request. You can see whether your request is approved, pending, or declined.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Email address</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                placeholder="you@example.com"
              />
            </label>

            {error && (
              <div className="rounded-3xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-800">{error}</div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center rounded-full bg-emerald-600 px-6 py-4 text-base font-semibold text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-500 disabled:cursor-not-allowed disabled:bg-emerald-300"
            >
              {loading ? "Checking status..." : "Check Status"}
            </button>
          </form>

          {status && (
            <div className="mt-8 space-y-4">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                <p className="text-sm uppercase tracking-[0.35em] text-slate-500 mb-3">Request status</p>
                <p className="text-2xl font-semibold text-slate-900 capitalize">{status}</p>
                {adminMessage && <p className="mt-3 text-slate-700">{adminMessage}</p>}
              </div>

              {status === "approved" && nextStepUrl && (
                <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6">
                  <p className="text-sm font-semibold text-emerald-700">Approved</p>
                  <p className="mt-2 text-slate-700">
                    Your request has been approved. Continue to the onboarding form and scheduling page below.
                  </p>
                  <a
                    href={nextStepUrl}
                    className="mt-4 inline-flex rounded-full bg-emerald-600 px-5 py-3 text-white shadow hover:bg-emerald-500"
                  >
                    Continue to next steps
                  </a>
                </div>
              )}

              {status === "declined" && (
                <div className="rounded-3xl border border-rose-200 bg-rose-50 p-6">
                  <p className="text-sm font-semibold text-rose-700">Declined</p>
                  <p className="mt-2 text-slate-700">We are sorry this request was not approved at this time.</p>
                </div>
              )}

              {status === "pending" && (
                <div className="rounded-3xl border border-amber-200 bg-amber-50 p-6">
                  <p className="text-sm font-semibold text-amber-700">Pending review</p>
                  <p className="mt-2 text-slate-700">
                    Your request is still under review. We will notify you once the admin takes action.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
