import AdminSidebar from "@/components/admin/AdminSidebar"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="md:flex">
      <AdminSidebar />
      <main className="flex-1 p-10">{children}</main>
    </div>
  )
}
