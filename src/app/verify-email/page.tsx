"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getSupabaseClient } from '@/lib/supabase'

export default function VerifyEmailPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState<string>('')
  const router = useRouter()

  useEffect(() => {
    const handleEmailVerification = async () => {
      const supabase = getSupabaseClient()
      if (!supabase) {
        console.error('Supabase client is not configured')
        setStatus('error')
        setMessage('Unable to verify email at this time.')
        return
      }

      try {
        // Try to process the Supabase auth callback from the URL first.
        const { data, error } = await supabase.auth.getSessionFromUrl({ storeSession: true })

        if (error) {
          console.warn('Supabase callback parse error:', error)
        }

        const session = data?.session

        if (!session) {
          // Fallback to any existing session if callback did not provide one.
          const { data: currentSession, error: sessionError } = await supabase.auth.getSession()
          if (sessionError) {
            throw sessionError
          }
          if (currentSession.session?.user) {
            setStatus('success')
            setMessage('Email verified successfully! You can now log in.')
          } else {
            setStatus('error')
            setMessage('Unable to verify email. Please try logging in or request a new verification email.')
            return
          }
        } else {
          setStatus('success')
          setMessage('Email verified successfully! You can now log in.')
        }

        setTimeout(() => {
          router.push('/login?message=Email verified successfully!')
        }, 3000)
      } catch (err: any) {
        console.error('Email verification error:', err)
        setStatus('error')
        setMessage(err?.message || 'An error occurred during verification.')
      }
    }

    handleEmailVerification()
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="max-w-xl w-full bg-white rounded-lg shadow p-8">
        <h1 className="text-2xl font-bold mb-4">Email Verification</h1>

        {status === 'loading' && (
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-slate-600">Verifying your email...</p>
          </div>
        )}

        {status === 'success' && (
          <div className="text-center">
            <div className="text-green-600 text-5xl mb-4">✓</div>
            <p className="text-green-700 mb-4">{message}</p>
            <p className="text-sm text-slate-600">Redirecting to login...</p>
          </div>
        )}

        {status === 'error' && (
          <div className="text-center">
            <div className="text-red-600 text-5xl mb-4">✕</div>
            <p className="text-red-700 mb-4">{message}</p>
            <div className="space-y-2">
              <a
                href="/login"
                className="inline-block bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-colors"
              >
                Go to Login
              </a>
              <br />
              <a
                href="/register"
                className="text-sm text-indigo-600 hover:text-indigo-800"
              >
                Back to Registration
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
