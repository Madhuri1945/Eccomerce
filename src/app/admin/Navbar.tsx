"use client";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { useState } from "react";

import { useEffect } from "react";

export default function Navbar() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null; // or a loading spinner, if desired
  }

  return (
    <header className="flex h-16 shadow bg-background z-10">
      <nav className="flex justify-between items-center container px-4">
        {/* Logo */}
        <Link className="text-2xl font-bold hover:underline" href="/admin">
          AdminPanel
        </Link>

        {/* Search Bar */}
        <div className="flex-grow mx-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search..."
            className="w-2/3 px-4 py-2 border rounded focus:outline-none focus:ring focus:ring-primary ml-3"
          />
        </div>

        {/* Navigation Links */}
        <div className="flex gap-4 items-center">
          <NavLink href="/admin/dashboard">Dashboard</NavLink>
          <NavLink href="/admin/category">Products</NavLink>
          <NavLink href="/admin/orders">Orders</NavLink>
          <NavLink href="/admin/users">Users</NavLink>
          <NavLink href="/admin/reports">Reports</NavLink>
          <NavLink href="/admin/settings">Settings</NavLink>
        </div>

        {/* User Profile or Sign In */}
        <div className="relative group">
          <div className="flex items-center gap-2 cursor-pointer">
            <UserButton
              appearance={{
                elements: {
                  userButtonAvatarBox: { width: "32px", height: "32px" },
                },
              }}
            />
          </div>

          {/* Dropdown Content */}
          <div className="absolute right-0 mt-2 bg-white border shadow-lg rounded-md hidden group-hover:block">
            <DropdownLink href="/admin/profile">Profile</DropdownLink>
            <DropdownLink href="/admin/logout">Logout</DropdownLink>
          </div>
        </div>
      </nav>
    </header>
  );
}

function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link href={href} className="hover:text-primary transition">
      {children}
    </Link>
  );
}

function DropdownLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link href={href} className="block px-4 py-2 hover:bg-gray-100">
      {children}
    </Link>
  );
}
