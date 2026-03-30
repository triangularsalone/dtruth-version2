"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"

type User = {
  id: string
  email: string
  full_name?: string
  role: "super_admin" | "admin" | "viewer"
  is_active: boolean
  created_at: string
}

export default function UsersPage() {
  const router = useRouter()

  const [checkingUser, setCheckingUser] = useState(true)
  const [currentUser, setCurrentUser] = useState<{ id?: string; email?: string } | null>(null)
  const [currentUserRole, setCurrentUserRole] = useState<"super_admin" | "admin" | "viewer">("viewer")

  const [users, setUsers] = useState<User[]>([])
  const [loadingUsers, setLoadingUsers] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [updating, setUpdating] = useState<string | null>(null)
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
        .from("profiles")
        .select("id, email, full_name, role, is_active, created_at")
        .order("created_at", { ascending: false })

      if (error) throw error

      setUsers(data || [])
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
      setUpdating(userId)
      const { error } = await supabase
        .from("profiles")
        .update({ role: newRole })
        .eq("id", userId)

      if (error) throw error
      setActionMessage("User role updated successfully.")
      setTimeout(() => setActionMessage(""), 3000)
      await loadUsers()
    } catch (err: any) {
      setActionError(err.message || "Unable to update user role")
      setTimeout(() => setActionError(""), 3000)
    } finally {
      setUpdating(null)
    }
  }

  const toggleUserStatus = async (userId: string, currentStatus: boolean) => {
    if (currentUserRole !== "super_admin") {
      setActionError("Only super admin can disable users.")
      return
    }

    try {
      setUpdating(userId)
      const { error } = await supabase
        .from("profiles")
        .update({ is_active: !currentStatus })
        .eq("id", userId)

      if (error) throw error
      setActionMessage(`User ${!currentStatus ? "enabled" : "disabled"} successfully.`)
      setTimeout(() => setActionMessage(""), 3000)
      await loadUsers()
    } catch (err: any) {
      setActionError(err.message || "Unable to update user status")
      setTimeout(() => setActionError(""), 3000)
    } finally {
      setUpdating(null)
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

    if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      return
    }

    try {
      setUpdating(userId)
      const { error } = await supabase
        .from("profiles")
        .delete()
        .eq("id", userId)

      if (error) throw error
      setActionMessage("User deleted successfully.")
      setTimeout(() => setActionMessage(""), 3000)
      await loadUsers()
    } catch (err: any) {
      setActionError(err.message || "Unable to delete user")
      setTimeout(() => setActionError(""), 3000)
    } finally {
      setUpdating(null)
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
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-gray-200 p-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <p className="text-sm font-semibold text-indigo-600">Management</p>
            <h1 className="text-3xl font-bold text-slate-900">User Management</h1>
            <p className="text-xs text-slate-500 mt-1">Manage user accounts, roles, and permissions</p>
          </div>
          <Link href="/admin/dashboard" className="rounded-md bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-300">
            Back to Dashboard
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 py-8">
        {actionError && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded border border-red-300">
            {actionError}
          </div>
        )}
        {actionMessage && (
          <div className="mb-4 p-4 bg-green-100 text-green-700 rounded border border-green-300">
            {actionMessage}
          </div>
        )}

        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <input
              type="text"
              placeholder="Search by email or name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Email</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Role</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Joined</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.filter(u => u.email.toLowerCase().includes(searchTerm.toLowerCase()) || (u.full_name && u.full_name.toLowerCase().includes(searchTerm.toLowerCase()))).length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                      {loadingUsers ? "Loading users..." : "No users found"}
                    </td>
                  </tr>
                ) : (
                  users.filter(u => u.email.toLowerCase().includes(searchTerm.toLowerCase()) || (u.full_name && u.full_name.toLowerCase().includes(searchTerm.toLowerCase()))).map(user => (
                    <tr key={user.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 text-sm text-slate-900">{user.email}</td>
                      <td className="px-6 py-4 text-sm text-slate-700">{user.full_name || "—"}</td>
                      <td className="px-6 py-4">
                        <select
                          value={user.role}
                          onChange={(e) => updateUserRole(user.id, e.target.value as any)}
                          disabled={updating === user.id}
                          className="px-3 py-1 text-sm border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                        >
                          <option value="viewer">Viewer</option>
                          <option value="admin">Admin</option>
                          <option value="super_admin">Super Admin</option>
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => toggleUserStatus(user.id, user.is_active)}
                          disabled={updating === user.id}
                          className={`px-3 py-1 text-sm rounded-md font-medium ${
                            user.is_active
                              ? "bg-green-100 text-green-700 hover:bg-green-200"
                              : "bg-red-100 text-red-700 hover:bg-red-200"
                          } disabled:opacity-50`}
                        >
                          {user.is_active ? "Active" : "Disabled"}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <button
                          onClick={() => deleteUser(user.id)}
                          disabled={updating === user.id || user.id === currentUser?.id}
                          className="text-red-600 hover:text-red-700 font-medium disabled:text-gray-400 disabled:cursor-not-allowed"
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

          <div className="px-6 py-4 bg-slate-50 border-t border-gray-200 text-sm text-slate-600">
            Showing {users.filter(u => u.email.toLowerCase().includes(searchTerm.toLowerCase()) || (u.full_name && u.full_name.toLowerCase().includes(searchTerm.toLowerCase()))).length} of {users.length} users
          </div>
        </div>
      </main>
    </div>
  )
}