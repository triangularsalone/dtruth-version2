"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

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
            <a
              href="#vision"
              className="nav-link"
            >
              Vision
            </a>
            <a
              href="#innovation"
              className="nav-link"
            >
              Innovation
            </a>
            <a
              href="#traction"
              className="nav-link"
            >
              Traction
            </a>
            <Link
              href="/innovation-for-salvation"
              className={`nav-link ${isActive('/innovation-for-salvation') ? 'text-indigo-600' : ''}`}
            >
              Innovation for Salvation
            </Link>
            <Link
              href="/traction"
              className={`nav-link ${isActive('/traction') ? 'text-indigo-600' : ''}`}
            >
              Traction
            </Link>
            <Link
              href="/archives"
              className={`nav-link ${isActive('/archives') ? 'text-indigo-600' : ''}`}
            >
              Archives
            </Link>
          </div>

          <div className="flex items-center space-x-4">
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
          <a
            href="#vision"
            className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-indigo-600"
          >
            Vision
          </a>
          <a
            href="#innovation"
            className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-indigo-600"
          >
            Innovation
          </a>
          <a
            href="#traction"
            className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-indigo-600"
          >
            Traction
          </a>
          <Link
            href="/innovation-for-salvation"
            className={`block px-3 py-2 text-base font-medium ${isActive('/innovation-for-salvation') ? 'text-indigo-600' : 'text-gray-600 hover:text-indigo-600'}`}
          >
            Innovation for Salvation
          </Link>
          <Link
            href="/traction"
            className={`block px-3 py-2 text-base font-medium ${isActive('/traction') ? 'text-indigo-600' : 'text-gray-600 hover:text-indigo-600'}`}
          >
            Traction
          </Link>
          <Link
            href="/archives"
            className={`block px-3 py-2 text-base font-medium ${isActive('/archives') ? 'text-indigo-600' : 'text-gray-600 hover:text-indigo-600'}`}
          >
            Archives
          </Link>
          <Link
            href="/admin/login"
            className={`block px-3 py-2 text-base font-medium ${isActive('/admin/login') || isActive('/admin/dashboard') ? 'text-indigo-600' : 'text-gray-600 hover:text-indigo-600'}`}
          >
            Admin
          </Link>
        </div>
      </div>
    </nav>
  );
}
