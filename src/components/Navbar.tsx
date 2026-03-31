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
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeMobileMenu = () => setMobileOpen(false);

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
          <div className="flex items-center space-x-4">
            <Link href="/" onClick={closeMobileMenu} className="text-2xl font-bold text-indigo-700 hover:text-indigo-800 transition-colors">
              D&apos;Truth
            </Link>
            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-controls="mobile-menu"
              aria-expanded={mobileOpen}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-indigo-600 hover:bg-gray-100 md:hidden focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <span className="sr-only">Open main menu</span>
              {mobileOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
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
            <Link
              href="/#innovation"
              className="nav-link"
            >
              Innovation for Salvation
            </Link>
            <Link
              href="/#traction"
              className="nav-link"
            >
              Traction
            </Link>
            <Link
              href="/archive"
              className={`nav-link ${isActive('/archive') ? 'text-indigo-600' : ''}`}
            >
              Archives
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
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

      {mobileOpen && (
        <div className="md:hidden border-t border-gray-200" id="mobile-menu">
          <div className="px-4 pt-4 pb-5 space-y-2">
            <Link
              href="/"
              onClick={closeMobileMenu}
              className={`block px-3 py-2 text-base font-medium ${isActive('/') ? 'text-indigo-600' : 'text-gray-600 hover:text-indigo-600'}`}
            >
              Home
            </Link>
            <Link
              href="/vision"
              onClick={closeMobileMenu}
              className={`block px-3 py-2 text-base font-medium ${isActive('/vision') ? 'text-indigo-600' : 'text-gray-600 hover:text-indigo-600'}`}
            >
              Vision
            </Link>
            <Link
              href="/#innovation"
              onClick={closeMobileMenu}
              className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-indigo-600"
            >
              Innovation for Salvation
            </Link>
            <Link
              href="/#traction"
              onClick={closeMobileMenu}
              className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-indigo-600"
            >
              Traction
            </Link>
            <Link
              href="/archive"
              onClick={closeMobileMenu}
              className={`block px-3 py-2 text-base font-medium ${isActive('/archive') ? 'text-indigo-600' : 'text-gray-600 hover:text-indigo-600'}`}
            >
              Archives
            </Link>
            <div className="pt-2 border-t border-gray-200">
              {!loading && (
                user ? (
                  <>
                    <p className="px-3 py-2 text-sm text-slate-600 font-medium">Logged in as: {user.email}</p>
                    <button
                      onClick={() => {
                        closeMobileMenu()
                        handleLogout()
                      }}
                      className="w-full text-left block px-3 py-2 text-base font-medium text-gray-600 hover:text-indigo-600"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      onClick={closeMobileMenu}
                      className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-indigo-600"
                    >
                      Login
                    </Link>
                    <Link
                      href="/register"
                      onClick={closeMobileMenu}
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
      )}
    </nav>
  );
}
