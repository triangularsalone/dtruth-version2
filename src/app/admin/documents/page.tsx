"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { getSupabaseClient } from "@/lib/supabase"

type Entry = {
  id: string
  title: string
  description?: string
  category?: "innovation" | "traction" | "archives"
  status?: "Published" | "Pending" | "Archived"
  media_url?: string
  external_link?: string
  created_at?: string
}

export default function DocumentsPage() {
  const router = useRouter()
  const supabase = getSupabaseClient()!

  const [checkingUser, setCheckingUser] = useState(true)
  const [user, setUser] = useState<{ id?: string; email?: string } | null>(null)

  const [entries, setEntries] = useState<Entry[]>([])
  const [loading, setLoading] = useState(true)

  const [actionError, setActionError] = useState("")
  const [actionMessage, setActionMessage] = useState("")

  const checkUser = async () => {
    try {
      const { data } = await supabase.auth.getUser()
      if (!data.user) {
        router.push("/admin/login")
      } else {
        setUser({ id: data.user.id, email: data.user.email || undefined })
      }
    } catch (error) {
      console.error("Error checking user:", error)
      router.push("/admin/login")
    } finally {
      setCheckingUser(false)
    }
  }

  const loadEntries = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from("entries")
        .select("id, title, description, category, status, media_url, external_link, created_at")
        .order("created_at", { ascending: false })

      if (error) throw error
      const mappedEntries = (data || []).map((entry: any) => ({
        ...entry,
        category: entry.category || "archives",
        status: entry.status || "Pending",
        media_url: entry.media_url || "",
        external_link: entry.external_link || "",
      }))
      setEntries(mappedEntries as Entry[])
    } catch (err: any) {
      console.error("Unable to load entries:", err)
      setActionError(err.message || "Unable to load entries")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    setActionError("")
    setActionMessage("")
    try {
      const { error } = await supabase.from("entries").delete().eq("id", id)
      if (error) throw error
      setActionMessage("Entry deleted successfully.")
      await loadEntries()
    } catch (err: any) {
      setActionError(err.message || "Unable to delete entry")
    }
  }

  useEffect(() => {
    checkUser()
  }, [router])

  useEffect(() => {
    if (user) loadEntries()
  }, [user])

  if (checkingUser) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading documents...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      <div className="md:flex">
        {/* Sidebar would be included via layout, but for this page, we'll assume it's there */}

        <div className="flex-1">
          <header className="bg-white border-b border-gray-200 p-4 shadow-sm">
            <div className="flex flex-wrap justify-between items-center gap-4 max-w-7xl mx-auto">
              <div>
                <p className="text-sm font-semibold text-indigo-600">Documents Management</p>
                <h2 className="text-2xl font-bold text-slate-900">All Documents</h2>
              </div>
              <Link
                href="/admin/dashboard"
                className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
              >
                Upload New Document
              </Link>
            </div>
          </header>

          <main className="p-4 max-w-7xl mx-auto space-y-6">
            {actionError && <p className="rounded bg-red-50 px-4 py-2 text-red-700">{actionError}</p>}
            {actionMessage && <p className="rounded bg-green-50 px-4 py-2 text-green-700">{actionMessage}</p>}

            <section className="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
              <div className="flex flex-wrap justify-between items-center gap-3 mb-4">
                <h3 className="text-lg font-semibold text-slate-900">Document List</h3>
                <span className="text-sm text-slate-500">{entries.length} documents</span>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Title</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Category</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Upload Date</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {loading ? (
                      <tr>
                        <td colSpan={5} className="px-4 py-5 text-center text-sm text-slate-500">
                          Loading documents...
                        </td>
                      </tr>
                    ) : entries.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-4 py-5 text-center text-sm text-slate-500">
                          No documents found. Start by uploading a document.
                        </td>
                      </tr>
                    ) : (
                      entries.map((entry) => (
                        <tr key={entry.id} className="hover:bg-indigo-50/40">
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-700">{entry.title}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">
                            <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                              entry.category === "innovation" ? "bg-blue-100 text-blue-700" :
                              entry.category === "traction" ? "bg-green-100 text-green-700" :
                              "bg-gray-100 text-gray-700"
                            }`}>
                              {entry.category === "innovation" ? "Innovation for Salvation" :
                               entry.category === "traction" ? "Traction" : "Archives"}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">
                            <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                              entry.status === "Published" ? "bg-emerald-100 text-emerald-700" :
                              entry.status === "Pending" ? "bg-amber-100 text-amber-700" :
                              "bg-slate-100 text-slate-700"
                            }`}>
                              {entry.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-700">
                            {entry.created_at ? new Date(entry.created_at).toLocaleDateString() : "N/A"}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium flex justify-end gap-2">
                            <Link
                              href={`/admin/dashboard?edit=${entry.id}`}
                              className="rounded-md border border-indigo-200 px-2 py-1 text-indigo-700 hover:bg-indigo-50"
                            >
                              Edit
                            </Link>
                            <button
                              onClick={() => handleDelete(entry.id)}
                              className="rounded-md border border-red-200 px-2 py-1 text-red-700 hover:bg-red-50"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  )
}