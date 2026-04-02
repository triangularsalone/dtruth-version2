"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import type { UserResponse } from '@supabase/supabase-js'

type UserRole = "super_admin" | "admin" | "viewer"

type Entry = {
  id: string
  title: string
  description?: string
  content?: string
  category?: "innovation" | "traction" | "archives" | "Document" | "Video" | "Photo" | "Report"
  status?: "Published" | "Pending" | "Archived"
  media_url?: string
  external_link?: string
  uploaded_by?: string
  created_at?: string
  updated_at?: string
}

type UserRow = {
  id: string
  email: string
  role: UserRole
}

export default function Dashboard() {
  const router = useRouter()

  const [checkingUser, setCheckingUser] = useState(true)
  const [user, setUser] = useState<{ id?: string; email?: string } | null>(null)
  const [currentUserRole, setCurrentUserRole] = useState<UserRole>("viewer")

  const [entries, setEntries] = useState<Entry[]>([])
  const [pendingEntriesCount, setPendingEntriesCount] = useState(0)
  const [notificationMessage, setNotificationMessage] = useState("")

  const [users, setUsers] = useState<UserRow[]>([])
  const [loadingUsers, setLoadingUsers] = useState(false)

  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [content, setContent] = useState("")
  const [entryCategory, setEntryCategory] = useState<"innovation" | "traction" | "archives" | "Document" | "Video" | "Photo" | "Report">("archives")
  const [entryStatus, setEntryStatus] = useState<"Published" | "Pending" | "Archived">("Pending")
  const [mediaUrl, setMediaUrl] = useState("")
  const [mediaFile, setMediaFile] = useState<File | null>(null)
  const [externalLink, setExternalLink] = useState("")

  const [actionError, setActionError] = useState("")
  const [actionMessage, setActionMessage] = useState("")
  const [isActionLoading, setIsActionLoading] = useState(false)

  const fetchUserRole = async (userId: string) => {
    try {
      // Prefer profile table if available
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", userId)
        .single()

      if (!profileError && profileData && profileData.role) {
        return profileData.role as UserRole
      }

      // Fallback to admin table
      const { data: adminData, error: adminError } = await supabase
        .from("admins")
        .select("role")
        .eq("id", userId)
        .single()

      if (!adminError && adminData && adminData.role) {
        return adminData.role as UserRole
      }

      console.warn("User role not found, defaulting to viewer", profileError || adminError)
      return "viewer" as UserRole
    } catch (err) {
      console.error("Error fetching user role:", err)
      return "viewer" as UserRole
    }
  }

  const loadUsers = async () => {
    if (currentUserRole !== "super_admin") return

    setLoadingUsers(true)
    try {
      const { data, error } = await supabase
        .from("admins")
        .select("id, email, role")

      if (error) throw error

      setUsers((data as any[]).map((u) => ({
        id: u.id,
        email: u.email,
        role: u.role as UserRole,
      })))
    } catch (err: any) {
      console.error("Unable to load users:", err)
    } finally {
      setLoadingUsers(false)
    }
  }

  const checkUser = async () => {
    try {
      const tryGetUser = async (retries = 3): Promise<UserResponse> => {
        for (let i = 0; i < retries; i++) {
          try {
            return await supabase.auth.getUser()
          } catch (err: any) {
            // If lock contention occurs, wait and retry
            if (i === retries - 1) throw err
            await new Promise((r) => setTimeout(r, 200))
          }
        }
        throw new Error('Failed to get user after retries')
      }

      const { data } = await tryGetUser()
      if (!data.user) {
        router.push("/admin/login")
      } else {
        setUser({ id: data.user.id, email: data.user.email || undefined })
        const role = await fetchUserRole(data.user.id)
        setCurrentUserRole(role)
      }
    } catch (error) {
      console.error("Error checking user:", error)
      router.push("/admin/login")
    } finally {
      setCheckingUser(false)
    }
  }

  const loadEntries = async () => {
    setIsActionLoading(true)
    try {
      const { data, error } = await supabase
        .from("entries")
        .select("id, title, description, content, category, status, media_url, external_link, uploaded_by, created_at, updated_at")
        .order("created_at", { ascending: false })

      if (error) {
        throw error
      }

      const mappedEntries = (data || []).map((entry: any) => ({
        ...entry,
        category: entry.category || "archives",
        status: entry.status || "Pending",
        media_url: entry.media_url || "",
        external_link: entry.external_link || "",
        uploaded_by: entry.uploaded_by || null,
      }))
      setEntries(mappedEntries as Entry[])
    } catch (err: any) {
      console.error("Unable to load entries:", err)

      let errorMessage = "Unable to load entries"
      if (!err) {
        errorMessage = "Unable to load entries: unknown error"
      } else if (typeof err === "string") {
        errorMessage = err
      } else if (err.message) {
        errorMessage = err.message
      } else if (err.error) {
        errorMessage = typeof err.error === "string" ? err.error : JSON.stringify(err.error)
      } else {
        errorMessage = JSON.stringify(err)
      }

      setActionError(errorMessage)
    } finally {
      setIsActionLoading(false)
    }
  }

  const loadNotificationCounts = async () => {
    try {
      const { count, error } = await supabase
        .from("entries")
        .select("id", { count: "exact", head: true })
        .eq("status", "Pending")

      if (!error) {
        setPendingEntriesCount(count || 0)
      }
    } catch (err) {
      console.error("Unable to load pending entry count:", err)
    }
  }

  useEffect(() => {
    checkUser()
  }, [router])

  useEffect(() => {
    if (user) {
      loadEntries()
      loadNotificationCounts()
    }
  }, [user])

  useEffect(() => {
    if (!user) return

    const channel = supabase
      .channel("admin-notifications")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "entries" },
        (payload) => {
          setPendingEntriesCount((current) => current + 1)
          setNotificationMessage(
            `New entry received${payload.new?.title ? `: ${payload.new.title}` : ""}`
          )
          window.setTimeout(() => setNotificationMessage(""), 8000)
        }
      )
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  }, [user])

  useEffect(() => {
    if (currentUserRole === "super_admin") {
      loadUsers()
    }
  }, [currentUserRole])



  const resetForm = () => {
    setSelectedEntryId(null)
    setTitle("")
    setDescription("")
    setContent("")
    setEntryCategory("archives")
    setEntryStatus("Pending")
    setMediaUrl("")
    setMediaFile(null)
    setExternalLink("")
    setActionError("")
    setActionMessage("")
  }

  const selectEntry = (entry: Entry) => {
    if (currentUserRole === "admin" && entry.category !== "Photo") {
      setActionError("Admin can only edit Photo entries.")
      return
    }

    setSelectedEntryId(entry.id)
    setTitle(entry.title)
    setDescription(entry.description || "")
    setContent(entry.content || "")
    setEntryCategory(entry.category || "archives")
    setEntryStatus(entry.status || "Pending")
    setMediaUrl(entry.media_url || "")
    setMediaFile(null) // Reset file on select
    setExternalLink(entry.external_link || "")
    setActionError("")
    setActionMessage("")
  }

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setActionError("")
    setActionMessage("")

    if (currentUserRole === "viewer") {
      setActionError("You do not have permission to save entries. Please request admin access.")
      return
    }

    if (!title.trim()) {
      setActionError("Title is required")
      return
    }

    if (currentUserRole === "admin" && entryCategory !== "Photo") {
      setActionError("Admin role is allowed to add or edit only Photo category entries.")
      return
    }

    setIsActionLoading(true)
    try {
      let finalMediaUrl = mediaUrl

      if (mediaFile) {
        const fileExt = mediaFile.name.split('.').pop()
        const fileName = `${Date.now()}.${fileExt}`
        const filePath = `uploads/${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('media')
          .upload(filePath, mediaFile)

        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage
          .from('media')
          .getPublicUrl(filePath)

        finalMediaUrl = publicUrl
      }

      if (selectedEntryId) {
        const { error } = await supabase
          .from("entries")
          .update({ title, description, content, category: entryCategory, status: entryStatus, media_url: finalMediaUrl, external_link: externalLink })
          .eq("id", selectedEntryId)

        if (error) throw error
        setActionMessage("Entry updated successfully.")
      } else {
        const { error } = await supabase
          .from("entries")
          .insert({ title, description, content, category: entryCategory, status: entryStatus, media_url: finalMediaUrl, external_link: externalLink })

        if (error) throw error
        setActionMessage("Entry created successfully.")
      }
      await loadEntries()
      await loadNotificationCounts()
      resetForm()
    } catch (err: any) {
      setActionError(err.message || "Unable to save entry")
    } finally {
      setIsActionLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (currentUserRole !== "super_admin") {
      setActionError("Only super_admin can delete entries.")
      return
    }

    setActionError("")
    setActionMessage("")
    setIsActionLoading(true)
    try {
      const { error } = await supabase.from("entries").delete().eq("id", id)
      if (error) throw error
      setActionMessage("Entry deleted successfully.")
      if (selectedEntryId === id) resetForm()
      await loadEntries()
      await loadNotificationCounts()
    } catch (err: any) {
      setActionError(err.message || "Unable to delete entry")
    } finally {
      setIsActionLoading(false)
    }
  }

  const updateUserRole = async (userId: string, newRole: UserRole) => {
    if (currentUserRole !== "super_admin") {
      setActionError("Only super admin can change user roles.")
      return
    }

    try {
      const { error } = await supabase
        .from("admins")
        .upsert({ id: userId, role: newRole }, { onConflict: 'id' })

      if (error) throw error
      setActionMessage("User role updated.")
      await loadUsers()
    } catch (err: any) {
      setActionError(err.message || "Unable to update user role")
    }
  }

  if (checkingUser) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  const totalDocuments = entries.filter(e => e.category === 'Document').length
  const totalVideos = entries.filter(e => e.category === 'Video').length
  const totalPhotos = entries.filter(e => e.category === 'Photo').length
  const latestUploads = entries.slice(0, 5)

  return (
      <div className="min-h-screen bg-slate-100 text-slate-800">
        <div className="md:flex">

          <div className="flex-1">
            {/* Top header */}
            <header className="bg-white border-b border-gray-200 p-4 shadow-sm">
              <div className="flex flex-wrap justify-between items-center gap-4 max-w-7xl mx-auto">
                <div>
                  <p className="text-sm font-semibold text-indigo-600">Dashboard Overview</p>
                  <h2 className="text-2xl font-bold text-slate-900">Government Documentation Platform</h2>
                  <p className="text-xs text-slate-500">Welcome, {user?.email}</p>
                </div>
                <button
                  onClick={() => document.getElementById("actionForm")?.scrollIntoView({ behavior: "smooth" })}
                  className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
                >
                  Upload New Document
                </button>
              </div>
            </header>

            {/* Content */}
            <main className="p-4 max-w-7xl mx-auto space-y-6">
              {notificationMessage ? (
                <div className="rounded-3xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-800 mb-4">
                  {notificationMessage}
                </div>
              ) : null}

              {pendingEntriesCount > 0 ? (
                <div className="rounded-3xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-800 mb-4">
                  There are {pendingEntriesCount} pending entries awaiting review.
                </div>
              ) : null}

              {/* Metrics cards */}
              <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {[{
                  label: "Total Documents",
                  value: totalDocuments,
                  info: "All document entries"
                }, {
                  label: "Total Videos",
                  value: totalVideos,
                  info: "Media items uploaded"
                }, {
                  label: "Total Photos",
                  value: totalPhotos,
                  info: "Image records"
                }, {
                  label: "Latest Uploads",
                  value: latestUploads.length,
                  info: "Recent items"
                }].map((metric) => (
                  <div key={metric.label} className="rounded-lg bg-white p-5 shadow-sm border border-gray-200">
                    <p className="text-xs font-medium text-indigo-600 uppercase tracking-wide">{metric.label}</p>
                    <p className="mt-2 text-3xl font-bold text-slate-900">{metric.value}</p>
                    <p className="mt-1 text-sm text-slate-500">{metric.info}</p>
                  </div>
                ))}
              </section>

              {/* User Management */}
              {currentUserRole === "super_admin" && (
                <section className="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-slate-900">User Management</h3>
                    {loadingUsers && <span className="text-xs text-slate-500">Loading users...</span>}
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Email</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Role</th>
                          <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-100">
                        {users.length === 0 ? (
                          <tr>
                            <td colSpan={3} className="px-4 py-5 text-center text-sm text-slate-500">
                              No users found in profile table.
                            </td>
                          </tr>
                        ) : users.map((u) => (
                          <tr key={u.id} className="hover:bg-indigo-50/40">
                            <td className="px-4 py-3 text-sm text-slate-700">{u.email}</td>
                            <td className="px-4 py-3 text-sm text-slate-700">{u.role}</td>
                            <td className="px-4 py-3 text-right text-sm flex justify-end gap-2">
                              <select
                                title="Change user role"
                                value={u.role}
                                onChange={async (e) => updateUserRole(u.id, e.target.value as UserRole)}
                                className="rounded-md border border-gray-300 px-2 py-1 text-sm"
                              >
                                <option value="viewer">viewer</option>
                                <option value="admin">admin</option>
                                <option value="super_admin">super_admin</option>
                              </select>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              )}
              {/* Latest Uploads and table */}
              <section className="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
                <div className="flex flex-wrap justify-between items-center gap-3 mb-4">
                  <h3 className="text-lg font-semibold text-slate-900">Latest Uploaded Documents</h3>
                  <span className="text-sm text-slate-500">{new Date().toLocaleDateString()}</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Title</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Category</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Upload Date</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                      {latestUploads.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-4 py-5 text-center text-sm text-slate-500">
                            No uploads yet. Start by uploading a document.
                          </td>
                        </tr>
                      ) : latestUploads.map((entry, idx) => {
                        const categories = ["Document", "Report", "Photo", "Video"]
                        const statuses = ["Published", "Pending", "Archived"]
                        const category = entry.category || categories[idx % categories.length]
                        const status = entry.status || statuses[idx % statuses.length]

                        return (
                          <tr key={entry.id} className="hover:bg-indigo-50/40">
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-700">{entry.title || "Untitled"}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-700">{category}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-700">{entry.created_at ? new Date(entry.created_at).toLocaleDateString() : "N/A"}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm">
                              <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${status === "Published" ? "bg-emerald-100 text-emerald-700" : status === "Pending" ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-700"}`}>
                                {status}
                              </span>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium flex justify-end gap-2">
                              <button
                                onClick={() => selectEntry(entry)}
                                className="rounded-md border border-indigo-200 px-2 py-1 text-indigo-700 hover:bg-indigo-50"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(entry.id)}
                                className="rounded-md border border-red-200 px-2 py-1 text-red-700 hover:bg-red-50"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Upload/Entry form */}
              <section id="actionForm" className="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-slate-900 mb-3">Upload / Edit Document</h3>
                {actionError && <p className="mb-4 rounded bg-red-50 px-4 py-2 text-red-700">{actionError}</p>}
                {actionMessage && <p className="mb-4 rounded bg-green-50 px-4 py-2 text-green-700">{actionMessage}</p>}

                <form onSubmit={handleSave} className="space-y-4">
                  {currentUserRole === "viewer" && (
                    <p className="rounded bg-yellow-50 border border-yellow-200 px-4 py-2 text-sm text-yellow-800">
                      You currently have viewer access. Only admin/super_admin can add or edit entries.
                    </p>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700">Title</label>
                      <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                        placeholder="Document title"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700">Category</label>
                      <select
                        title="Select content category"
                        value={entryCategory}
                        onChange={(e) => setEntryCategory(e.target.value as "Document" | "Report" | "Photo" | "Video")}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                        disabled={currentUserRole !== "super_admin" && currentUserRole !== "admin"}
                      >
                        {currentUserRole === "super_admin" ? (
                          <>
                            <option value="innovation">Innovation for Salvation</option>
                            <option value="traction">Traction</option>
                            <option value="archives">Archives</option>
                          </>
                        ) : (
                          <option value="archives">Archives</option>
                        )}
                      </select>
                      {currentUserRole === "admin" && (
                        <p className="text-xs italic text-amber-600">admins can only upload or edit Photo entries.</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700">Status</label>
                      <select
                        title="Select status"
                        value={entryStatus}
                        onChange={(e) => setEntryStatus(e.target.value as "Published" | "Pending" | "Archived")}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                      >
                        <option value="Published">Published</option>
                        <option value="Pending">Pending</option>
                        <option value="Archived">Archived</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700">Upload Media File</label>
                      <input
                        type="file"
                        accept="image/*,video/*,.pdf,.doc,.docx,.txt"
                        onChange={(e) => setMediaFile(e.target.files?.[0] || null)}
                        className="mt-1 block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                      />
                      {mediaUrl && (
                        <p className="mt-1 text-sm text-slate-500">Current file: {mediaUrl.split('/').pop()}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700">Description</label>
                    <input
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                      placeholder="Short description"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700">External Link (Optional)</label>
                    <input
                      value={externalLink}
                      onChange={(e) => setExternalLink(e.target.value)}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                      placeholder="https://example.com"
                      type="url"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700">Content</label>
                    <textarea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-indigo-500 min-h-30"
                      placeholder="Document details and notes"
                    />
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      type="submit"
                      disabled={isActionLoading || currentUserRole === "viewer"}
                      className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {selectedEntryId ? "Update Document" : "Upload Document"}
                    </button>
                    <button onClick={resetForm} type="button" className="rounded-md border border-slate-300 px-4 py-2 text-sm hover:bg-slate-50">
                      Reset
                    </button>
                  </div>
                </form>
              </section>
            </main>
          </div>
        </div>
      
      </div>
  )
}
