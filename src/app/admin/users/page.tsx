"use client"

import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"

type UserRow = {
  id: string
  email: string
  role: "super_admin" | "admin" | "viewer"
  created_at?: string
  disabled?: boolean
}

export default function UsersPage() {
  const router = useRouter()

  const [checkingUser, setCheckingUser] = useState(true)
  const [currentUser, setCurrentUser] = useState<{ id?: string; email?: string } | null>(null)
  const [currentUserRole, setCurrentUserRole] = useState<"super_admin" | "admin" | "viewer">("viewer")

  const [users, setUsers] = useState<UserRow[]>([])
  const [loadingUsers, setLoadingUsers] = useState(false)

  const [actionError, setActionError] = useState("")
  const [actionMessage, setActionMessage] = useState("")

  const fetchUserRole = async (userId: string) => {
    try {
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", userId)
        .single()

      if (!profileError && profileData && profileData.role) {
        return profileData.role as "super_admin" | "admin" | "viewer"
      }

      const { data: adminData, error: adminError } = await supabase
        .from("admins")
        .select("role")
        .eq("id", userId)
        .single()

      if (!adminError && adminData && adminData.role) {
        return adminData.role as "super_admin" | "admin" | "viewer"
      }

      return "viewer"
    } catch (err) {
      return "viewer"
    }
  }

  const checkUser = async () => {
    try {
      const { data } = await supabase.auth.getUser()
      if (!data.user) {
        router.push("/admin/login")
      } else {
        setCurrentUser({ id: data.user.id, email: data.user.email || undefined })
        const role = await fetchUserRole(data.user.id)
        setCurrentUserRole(role)
        if (role !== "super_admin") {
          router.push("/admin/dashboard") // Only super_admin can access user management
        }
      }
    } catch (error) {
      router.push("/admin/login")
    } finally {
      setCheckingUser(false)
    }
  }

  const loadUsers = async () => {
    setLoadingUsers(true)
    try {
      const { data, error } = await supabase
        .from("admins")
        .select("id, email, role, created_at")

      if (error) throw error

      setUsers((data as any[]).map((u) => ({
        id: u.id,
        email: u.email,
        role: u.role as "super_admin" | "admin" | "viewer",
        created_at: u.created_at,
        disabled: false, // Assuming no disabled field, can add if needed
      })))
    } catch (err: any) {
      console.error("Unable to load users:", err)
      setActionError(err.message || "Unable to load users")
    } finally {
      setLoadingUsers(false)
    }
  }

  const updateUserRole = async (userId: string, newRole: "super_admin" | "admin" | "viewer") => {
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

  const deleteUser = async (userId: string) => {
    if (currentUserRole !== "super_admin") {
      setActionError("Only super admin can delete users.")
      return
    }

    if (userId === currentUser?.id) {
      setActionError("Cannot delete your own account.")
      return
    }

    try {
      const { error } = await supabase
        .from("admins")
        .delete()
        .eq("id", userId)

      if (error) throw error
      setActionMessage("User deleted.")
      await loadUsers()
    } catch (err: any) {
      setActionError(err.message || "Unable to delete user")
    }
  }

  useEffect(() => {
    checkUser()
  }, [router])

  useEffect(() => {
    if (currentUserRole === "super_admin") {
      loadUsers()
    }
  }, [currentUserRole])

  if (checkingUser) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading user management...</p>
        </div>
      </div>
    )
  }

  if (currentUserRole !== "super_admin") {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Access denied. Only super admins can manage users.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      <div className="md:flex">
        {/* Sidebar included via layout */}

        <div className="flex-1">
          <header className="bg-white border-b border-gray-200 p-4 shadow-sm">
            <div className="flex flex-wrap justify-between items-center gap-4 max-w-7xl mx-auto">
              <div>
                <p className="text-sm font-semibold text-indigo-600">User Management</p>
                <h2 className="text-2xl font-bold text-slate-900">Manage Users</h2>
              </div>
            </div>
          </header>

          <main className="p-4 max-w-7xl mx-auto space-y-6">
            {actionError && <p className="rounded bg-red-50 px-4 py-2 text-red-700">{actionError}</p>}
            {actionMessage && <p className="rounded bg-green-50 px-4 py-2 text-green-700">{actionMessage}</p>}

            <section className="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-900">Registered Users</h3>
                {loadingUsers && <span className="text-xs text-slate-500">Loading users...</span>}
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Email</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Role</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Created Date</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {users.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-4 py-5 text-center text-sm text-slate-500">
                          No users found.
                        </td>
                      </tr>
                    ) : users.map((u) => (
                      <tr key={u.id} className="hover:bg-indigo-50/40">
                        <td className="px-4 py-3 text-sm text-slate-700">{u.email}</td>
                        <td className="px-4 py-3 text-sm text-slate-700">{u.role}</td>
                        <td className="px-4 py-3 text-sm text-slate-700">
                          {u.created_at ? new Date(u.created_at).toLocaleDateString() : "N/A"}
                        </td>
                        <td className="px-4 py-3 text-right text-sm flex justify-end gap-2">
                          <select
                            title="Change user role"
                            value={u.role}
                            onChange={async (e) => updateUserRole(u.id, e.target.value as "super_admin" | "admin" | "viewer")}
                            className="rounded-md border border-gray-300 px-2 py-1 text-sm"
                          >
                            <option value="viewer">viewer</option>
                            <option value="admin">admin</option>
                            <option value="super_admin">super_admin</option>
                          </select>
                          <button
                            onClick={() => deleteUser(u.id)}
                            className="rounded-md border border-red-200 px-2 py-1 text-red-700 hover:bg-red-50"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
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