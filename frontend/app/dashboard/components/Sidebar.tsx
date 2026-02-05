'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'Analytics', href: '/dashboard/analytics' },
  { name: 'Profile', href: '/dashboard/profile' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white shadow-md h-full">
      <div className="p-6">
        <h2 className="text-xl font-bold text-purple-700">Todo App</h2>
      </div>
      <nav className="mt-6">
        <ul>
          {navItems.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                className={`flex items-center px-6 py-3 text-sm font-medium ${
                  pathname === item.href
                    ? 'text-purple-600 bg-purple-50 border-r-2 border-purple-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="absolute bottom-0 w-64 p-6">
        <button
          onClick={() => {
            localStorage.removeItem('token');
            window.location.href = '/auth/login';
          }}
          className="w-full text-left px-6 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}