"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data } = await supabase.auth.getUser();
        setUser(data?.user || null);
      } catch (error) {
        console.error("Error checking user:", error);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  const isActive = (path: string) => pathname === path;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push("/login");
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-indigo-700 hover:text-indigo-800 transition-colors">
              D&apos;Truth
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className={`nav-link ${isActive('/') ? 'text-indigo-600' : ''}`}
            >
              Home
            </Link>
            <Link
              href="/vision"
              className={`nav-link ${isActive('/vision') ? 'text-indigo-600' : ''}`}
            >
              Vision
            </Link>
            <a
              href="#innovation"
              className="nav-link"
            >
              Innovation for Salvation
            </a>
            <a
              href="#traction"
              className="nav-link"
            >
              Traction
            </a>
            <Link
              href="/archive"
              className={`nav-link ${isActive('/archive') ? 'text-indigo-600' : ''}`}
            >
              Archives
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {!loading && (
              user ? (
                <>
                  <span className="text-sm text-slate-600">{user.email}</span>
                  <button
                    onClick={handleLogout}
                    className="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
                  >
                    Sign Up
                  </Link>
                </>
              )
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="md:hidden border-t border-gray-200">
        <div className="px-2 pt-2 pb-3 space-y-1">
          <Link
            href="/"
            className={`block px-3 py-2 text-base font-medium ${isActive('/') ? 'text-indigo-600' : 'text-gray-600 hover:text-indigo-600'}`}
          >
            Home
          </Link>
          <Link
            href="/vision"
            className={`block px-3 py-2 text-base font-medium ${isActive('/vision') ? 'text-indigo-600' : 'text-gray-600 hover:text-indigo-600'}`}
          >
            Vision
          </Link>
          <a
            href="#innovation"
            className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-indigo-600"
          >
            Innovation for Salvation
          </a>
          <a
            href="#traction"
            className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-indigo-600"
          >
            Traction
          </a>
          <Link
            href="/archive"
            className={`block px-3 py-2 text-base font-medium ${isActive('/archive') ? 'text-indigo-600' : 'text-gray-600 hover:text-indigo-600'}`}
          >
            Archives
          </Link>
          <Link
            href="/admin/login"
            className={`block px-3 py-2 text-base font-medium ${isActive('/admin/login') || isActive('/admin/dashboard') ? 'text-indigo-600' : 'text-gray-600 hover:text-indigo-600'}`}
          >
            Admin
          </Link>
          <div className="pt-2 border-t border-gray-200">
            {!loading && (
              user ? (
                <>
                  <p className="px-3 py-2 text-sm text-slate-600 font-medium">Logged in as: {user.email}</p>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left block px-3 py-2 text-base font-medium text-gray-600 hover:text-indigo-600"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-indigo-600"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="block px-3 py-2 text-base font-medium bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                  >
                    Sign Up
                  </Link>
                </>
              )
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
