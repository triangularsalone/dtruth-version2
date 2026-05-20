import { redirect } from 'next/navigation'
import { getServerUser } from '@/lib/serverAuth'

export default async function ProfilePage() {
  const user = await getServerUser()
  if (!user) redirect('/auth/login')

  // @ts-ignore
  const email = (user as any).email

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-4">Your Profile</h1>
        <p className="text-slate-700">Signed in as <strong>{email}</strong></p>
      </div>
    </div>
  )
}
