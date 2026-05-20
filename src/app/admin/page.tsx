import { redirect } from "next/navigation";

export default function AdminIndexPage() {
  // Redirect plain /admin to login. If session logic is needed, this can be extended.
  redirect("/admin/login");
}
