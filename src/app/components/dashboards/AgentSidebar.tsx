'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Users, Calculator, LayoutDashboard, UserPlus, History, PieChart } from 'lucide-react';

export default function AgentSidebar() {
    const pathname = usePathname();
    const isActive = (path: string) => pathname === path;

    return (
        <div className="p-4">
            <h2 className="text-lg font-semibold mb-4">Agent Dashboard</h2>
            <nav className="space-y-2">
                <Link
                    href="/agent/dashboard"
                    className={`flex items-center px-4 py-2 rounded-md ${
                        isActive('/agent/dashboard')
                            ? 'bg-indigo-500 text-white'
                            : 'hover:bg-gray-100'
                    }`}
                >
                    <LayoutDashboard className="w-5 h-5 mr-2" />
                    Dashboard
                </Link>
                <Link
                    href="/agent/calculator"
                    className={`flex items-center px-4 py-2 rounded-md ${
                        isActive('/agent/calculator')
                            ? 'bg-indigo-500 text-white'
                            : 'hover:bg-gray-100'
                    }`}
                >
                    <Calculator className="w-5 h-5 mr-2" />
                    Calculator
                </Link>
                <Link
                    href="/agent/clients"
                    className={`flex items-center px-4 py-2 rounded-md ${
                        isActive('/agent/clients')
                            ? 'bg-indigo-500 text-white'
                            : 'hover:bg-gray-100'
                    }`}
                >
                    <Users className="w-5 h-5 mr-2" />
                    My Clients
                </Link>
                <Link
                    href="/agent/add-client"
                    className={`flex items-center px-4 py-2 rounded-md ${
                        isActive('/agent/add-client')
                            ? 'bg-indigo-500 text-white'
                            : 'hover:bg-gray-100'
                    }`}
                >
                    <UserPlus className="w-5 h-5 mr-2" />
                    Add Client
                </Link>
                <Link
                    href="/agent/history"
                    className={`flex items-center px-4 py-2 rounded-md ${
                        isActive('/agent/history')
                            ? 'bg-indigo-500 text-white'
                            : 'hover:bg-gray-100'
                    }`}
                >
                    <History className="w-5 h-5 mr-2" />
                    Transaction History
                </Link>
                <Link
                    href="/agent/statistics"
                    className={`flex items-center px-4 py-2 rounded-md ${
                        isActive('/agent/statistics')
                            ? 'bg-indigo-500 text-white'
                            : 'hover:bg-gray-100'
                    }`}
                >
                    <PieChart className="w-5 h-5 mr-2" />
                    Statistics
                </Link>
            </nav>
        </div>
    );
}
