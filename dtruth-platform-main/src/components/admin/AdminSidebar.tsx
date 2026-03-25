"use client"

import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { useState } from "react"

export default function AdminSidebar() {
  const router = useRouter()
  const pathname = usePathname()
  const [actionError, setActionError] = useState("")

  // Hide sidebar on login page to avoid showing it while unauthenticated
  if (pathname && pathname.startsWith("/admin/login")) return null

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      router.push("/")
    } catch (error) {
      console.error("Error signing out:", error)
      setActionError("Logout failed")
    }
  }

  return (
    <aside className="w-full md:w-72 bg-white border-r border-gray-200 shadow-sm md:h-screen md:sticky md:top-0">
      <div className="px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-indigo-800">D&apos;Truth</h1>
          <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider">LEAP archives</p>
        </div>

        <nav className="space-y-2">
          <Link href="/admin/dashboard" className="block rounded-lg px-4 py-2 hover:bg-indigo-50">
            Dashboard Overview
          </Link>

          <Link href="/admin/upload" className="block rounded-lg px-4 py-2 hover:bg-indigo-50">
            Upload Document
          </Link>

          <Link href="/admin/media" className="block rounded-lg px-4 py-2 hover:bg-indigo-50">
            Media Library
          </Link>

          <Link href="/admin/archive" className="block rounded-lg px-4 py-2 hover:bg-indigo-50">
            Archive Management
          </Link>

          <Link href="/admin/reports" className="block rounded-lg px-4 py-2 hover:bg-indigo-50">
            Reports
          </Link>

          <Link href="/admin/settings" className="block rounded-lg px-4 py-2 hover:bg-indigo-50">
            Settings
          </Link>
        </nav>
      </div>

      <div className="px-6 pb-8">
        <button
          onClick={handleLogout}
          className="w-full rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-100"
        >
          Sign out
        </button>
        {actionError && <p className="mt-2 text-xs text-red-600">{actionError}</p>}
      </div>
    </aside>
  )
}
