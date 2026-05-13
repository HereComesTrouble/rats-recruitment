"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminSectionNav() {
  const pathname = usePathname();
  const isExemplar = pathname === "/account/admin";
  const isUsers = pathname.startsWith("/account/admin/users");

  return (
    <nav className="admin-subnav" aria-label="Admin sections">
      <Link
        className={`admin-subnav__link${isExemplar ? " admin-subnav__link--active" : ""}`}
        href="/account/admin"
      >
        Exemplar queue
      </Link>
      <Link
        className={`admin-subnav__link${isUsers ? " admin-subnav__link--active" : ""}`}
        href="/account/admin/users"
      >
        User management
      </Link>
    </nav>
  );
}
