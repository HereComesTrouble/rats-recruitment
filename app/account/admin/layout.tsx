import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { isAdmin } from "@/lib/admin";
import AdminSectionNav from "./AdminSectionNav";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await auth();
  if (!session?.user?.id || !isAdmin(session.user.email)) {
    redirect("/account");
  }

  return (
    <>
      <AdminSectionNav />
      {children}
    </>
  );
}
