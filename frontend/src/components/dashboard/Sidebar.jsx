"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  // Returns the current URL path.
  // Example:
  // http://localhost:4000/projects
  // usePathname() -> "/projects"
  // pathname Returns the current URL path and is used to highlight the active navigation link.
  const pathname = usePathname();
  return (
    <aside className="dashboard-sidebar">
      <h1>Sidebar</h1>
      <Link
        href="/overview"
        className={pathname === "/overview" ? "active" : ""}
      >
        Overview
      </Link>
      <Link
        href="/workspaces"
        className={pathname === "/workspaces" ? "active" : ""}
      >
        Workspaces
      </Link>
      <Link
        href="/projects"
        className={pathname === "/projects" ? "active" : ""}
      >
        Projects
      </Link>
      <Link href="/tasks" className={pathname === "/tasks" ? "active" : ""}>
        Tasks
      </Link>
      <Link
        href="/settings"
        className={pathname === "/settings" ? "active" : ""}
      >
        Settings
      </Link>
    </aside>
  );
}
