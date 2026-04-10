"use client"

import { useState, type FormEvent } from "react"
import { useSearchParams } from "next/navigation"

export default function PartnerNextStepsPage() {
  const searchParams = useSearchParams()
  const email = searchParams.get("email") || ""
  const [preferredDate, setPreferredDate] = useState("")
  const [phone, setPhone] = useState("")
  const [notes, setNotes] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-slate-50 py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-4xl border border-slate-200 bg-white p-10 shadow-xl shadow-slate-200/50">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">Partnership Onboarding</h1>
          <p className="text-slate-600 mb-6">
            Complete this onboarding form to receive the training schedule and material purchase procedures.
          </p>

          {submitted ? (
            <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6">
              <h2 className="text-xl font-semibold text-emerald-800">Request received</h2>
              <p className="mt-2 text-slate-700">
                Thanks{email ? `, ${email}` : ""}! Your onboarding request has been received. We will follow up with training details and next steps soon.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700">Email address</label>
                <input
                  value={email}
                  readOnly
                  className="mt-2 block w-full rounded-3xl border border-slate-300 bg-slate-100 px-4 py-3 text-slate-700"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Preferred onboarding date</label>
                <input
                  type="date"
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  className="mt-2 block w-full rounded-3xl border border-slate-300 px-4 py-3 text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Phone number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="mt-2 block w-full rounded-3xl border border-slate-300 px-4 py-3 text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                  placeholder="Optional phone number for scheduling"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Notes or questions</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={5}
                  className="mt-2 block w-full rounded-3xl border border-slate-300 px-4 py-3 text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                  placeholder="Tell us any preferences or questions about training and materials"
                />
              </div>
              <button
                type="submit"
                className="inline-flex w-full items-center justify-center rounded-full bg-emerald-600 px-6 py-4 text-base font-semibold text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-500"
              >
                Submit onboarding request
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
