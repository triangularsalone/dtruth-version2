"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function VerifyEmailPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState<string>('')
  const router = useRouter()

  useEffect(() => {
    const handleEmailVerification = async () => {
      try {
        // Handle the auth callback from Supabase
        const { data, error } = await supabase.auth.getSession()

        if (error) {
          setStatus('error')
          setMessage('Verification failed. The link may be invalid or expired.')
          return
        }

        if (data.session?.user) {
          setStatus('success')
          setMessage('Email verified successfully! You can now log in.')
          // Redirect to login after a delay
          setTimeout(() => {
            router.push('/login?message=Email verified successfully!')
          }, 3000)
        } else {
          setStatus('error')
          setMessage('Unable to verify email. Please try logging in or request a new verification email.')
        }
      } catch (err) {
        setStatus('error')
        setMessage('An error occurred during verification.')
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
