"use client"

import { useEffect, useState } from 'react'

export default function VerifyEmailPage({ searchParams }: { searchParams?: { token?: string } }) {
  const token = (typeof window !== 'undefined') ? new URLSearchParams(window.location.search).get('token') : searchParams?.token
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    if (!token) return
    setStatus('loading')
    fetch('/api/verify-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data?.message) {
          setStatus('success')
          setMessage(data.message)
        } else {
          setStatus('error')
          setMessage(data?.error || 'Verification failed')
        }
      })
      .catch((err) => {
        setStatus('error')
        setMessage(err?.message || 'Verification failed')
      })
  }, [token])

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="max-w-xl w-full bg-white rounded-lg shadow p-8">
        <h1 className="text-2xl font-bold mb-4">Email Verification</h1>
        {status === 'loading' && <p className="text-slate-600">Verifying your email...</p>}
        {status === 'success' && (
          <div>
            <p className="text-green-700 mb-4">{message}</p>
            <a href="/auth/login" className="inline-block bg-indigo-600 text-white px-4 py-2 rounded">Go to login</a>
          </div>
        )}
        {status === 'error' && (
          <div>
            <p className="text-red-700 mb-4">{message}</p>
            <form
              onSubmit={async (e) => {
                e.preventDefault()
                const email = (e.currentTarget.elements.namedItem('email') as HTMLInputElement).value
                if (!email) return
                setStatus('loading')
                const res = await fetch('/api/resend-verification', { method: 'POST', body: JSON.stringify({ email }), headers: { 'Content-Type': 'application/json' } })
                const data = await res.json()
                if (data?.message) {
                  setStatus('success')
                  setMessage(data.message)
                } else {
                  setStatus('error')
                  setMessage(data?.error || 'Unable to resend')
                }
              }}
            >
              <label className="block text-sm font-medium text-slate-700">Email to resend verification</label>
              <input name="email" type="email" className="mt-1 w-full rounded border px-3 py-2" />
              <div className="mt-4">
                <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded">Resend Verification</button>
              </div>
            </form>
          </div>
        )}
        {status === 'idle' && <p className="text-slate-600">No token provided.</p>}
      </div>
    </div>
  )
}
