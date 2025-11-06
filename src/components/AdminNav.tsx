'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function AdminNav() {
  const { data: session } = useSession();
  const pathname = usePathname();

  // Only show navigation for admin users
  if (!session || session.user?.role !== 'admin') {
    return null;
  }

  const isActive = (path: string) => {
    return pathname.startsWith(path) ? 'bg-gray-100 dark:bg-gray-800' : '';
  };

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex
          ">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-gray-900 dark:text-white">Admin</span>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href="/admin/dashboard"
                className={`${isActive('/admin')} border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                Dashboard
              </Link>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <div className="ml-3 relative">
              <div className="flex items-center">
                <span className="text-sm text-gray-700 dark:text-gray-300 mr-4">
                  {session.user?.name || session.user?.email}
                </span>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
                >
                  Sign out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
