"use client"

import { useState } from "react"

type FormState = {
  name: string
  email: string
  organization: string
  message: string
}

export default function PartnerPage() {
  const [formData, setFormData] = useState<FormState>({
    name: "",
    email: "",
    organization: "",
    message: "",
  })
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle")
  const [error, setError] = useState<string>("")

  const handleChange = (field: keyof FormState) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((current) => ({ ...current, [field]: event.target.value }))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError("")
    setStatus("sending")

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setError("Please fill in your name, email, and message before submitting.")
      setStatus("error")
      return
    }

    try {
      const response = await fetch("/api/partner", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const json = await response.json().catch(() => null)
        const message = json?.error || "Unable to submit partnership request. Please try again later."
        throw new Error(message)
      }

      setStatus("success")
      setFormData({ name: "", email: "", organization: "", message: "" })
    } catch (err: any) {
      console.error("Partnership request failed:", err)
      setError(err.message || "Something went wrong. Please try again.")
      setStatus("error")
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="mb-10 text-center">
          <p className="text-sm uppercase tracking-[0.35em] text-emerald-600 mb-3">Partner with the movement</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900">Join LEAP MOVEMENT FOR ALL</h1>
          <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
            Share your partnership interest and we will reach out with next steps for how to join the movement.
          </p>
        </div>

        <div className="rounded-4xl border border-slate-200 bg-white p-10 shadow-xl shadow-slate-200/50">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm font-semibold text-slate-700">Full Name</span>
                <input
                  type="text"
                  value={formData.name}
                  onChange={handleChange("name")}
                  className="mt-2 w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                  placeholder="Your name"
                />
              </label>
              <label className="block">
                <span className="text-sm font-semibold text-slate-700">Email Address</span>
                <input
                  type="email"
                  value={formData.email}
                  onChange={handleChange("email")}
                  className="mt-2 w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                  placeholder="you@example.com"
                />
              </label>
            </div>

            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Organization</span>
              <input
                type="text"
                value={formData.organization}
                onChange={handleChange("organization")}
                className="mt-2 w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                placeholder="Company, nonprofit, or community group"
              />
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Message</span>
              <textarea
                value={formData.message}
                onChange={handleChange("message")}
                rows={6}
                className="mt-2 w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                placeholder="Tell us why you want to partner with LEAP MOVEMENT FOR ALL."
              />
            </label>

            {status === "success" && (
              <div className="rounded-3xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-800">
                Thank you! Your partnership request has been saved in Supabase and we will contact you shortly.
              </div>
            )}

            {error && (
              <div className="rounded-3xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-800">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={status === "sending"}
              className="inline-flex w-full items-center justify-center rounded-full bg-emerald-600 px-6 py-4 text-base font-semibold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:bg-emerald-300"
            >
              {status === "sending" ? "Sending request..." : "Send Partnership Request"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
