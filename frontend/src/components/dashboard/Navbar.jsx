"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <header className="dashboard-navbar">
      <h1>logo</h1>
      <input type="text" placeholder="search" />
      <div className="navbar-actions">
        <button>Profile</button>
        <button>Logout</button>
      </div>
    </header>
  );
}
