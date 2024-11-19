'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Users, Calculator, LayoutDashboard, UserCog, Settings, PieChart } from 'lucide-react';

export default function AdminSidebar() {
    const pathname = usePathname();
    const isActive = (path: string) => pathname === path;

    return (
        <div className="p-4">
            <h2 className="text-lg font-semibold mb-4">Admin Dashboard</h2>
            <nav className="space-y-2">
                <Link
                    href="/admin/dashboard"
                    className={`flex items-center px-4 py-2 rounded-md ${
                        isActive('/admin/dashboard')
                            ? 'bg-indigo-500 text-white'
                            : 'hover:bg-gray-100'
                    }`}
                >
                    <LayoutDashboard className="w-5 h-5 mr-2" />
                    Dashboard
                </Link>
                <Link
                    href="/admin/calculator"
                    className={`flex items-center px-4 py-2 rounded-md ${
                        isActive('/admin/calculator')
                            ? 'bg-indigo-500 text-white'
                            : 'hover:bg-gray-100'
                    }`}
                >
                    <Calculator className="w-5 h-5 mr-2" />
                    Calculator
                </Link>
                <Link
                    href="/admin/agents"
                    className={`flex items-center px-4 py-2 rounded-md ${
                        isActive('/admin/agents')
                            ? 'bg-indigo-500 text-white'
                            : 'hover:bg-gray-100'
                    }`}
                >
                    <UserCog className="w-5 h-5 mr-2" />
                    Manage Agents
                </Link>
                <Link
                    href="/admin/clients"
                    className={`flex items-center px-4 py-2 rounded-md ${
                        isActive('/admin/clients')
                            ? 'bg-indigo-500 text-white'
                            : 'hover:bg-gray-100'
                    }`}
                >
                    <Users className="w-5 h-5 mr-2" />
                    All Clients
                </Link>
                <Link
                    href="/admin/statistics"
                    className={`flex items-center px-4 py-2 rounded-md ${
                        isActive('/admin/statistics')
                            ? 'bg-indigo-500 text-white'
                            : 'hover:bg-gray-100'
                    }`}
                >
                    <PieChart className="w-5 h-5 mr-2" />
                    Statistics
                </Link>
                <Link
                    href="/admin/settings"
                    className={`flex items-center px-4 py-2 rounded-md ${
                        isActive('/admin/settings')
                            ? 'bg-indigo-500 text-white'
                            : 'hover:bg-gray-100'
                    }`}
                >
                    <Settings className="w-5 h-5 mr-2" />
                    Settings
                </Link>
            </nav>
        </div>
    );
}
