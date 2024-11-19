'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Calculator, LayoutDashboard, History, CreditCard, PieChart, Users } from 'lucide-react';

export default function UserSidebar() {
    const pathname = usePathname();
    const isActive = (path: string) => pathname === path;

    return (
        <div className="p-4">
            <h2 className="text-lg font-semibold mb-4">User Dashboard</h2>
            <nav className="space-y-2">
                <Link
                    href="/user/dashboard"
                    className={`flex items-center px-4 py-2 rounded-md ${
                        isActive('/user/dashboard')
                            ? 'bg-indigo-500 text-white'
                            : 'hover:bg-gray-100'
                    }`}
                >
                    <LayoutDashboard className="w-5 h-5 mr-2" />
                    Dashboard
                </Link>
                <Link
                    href="/user/calculator"
                    className={`flex items-center px-4 py-2 rounded-md ${
                        isActive('/user/calculator')
                            ? 'bg-indigo-500 text-white'
                            : 'hover:bg-gray-100'
                    }`}
                >
                    <Calculator className="w-5 h-5 mr-2" />
                    Calculator
                </Link>
                <Link
                    href="/user/clients"
                    className={`flex items-center px-4 py-2 rounded-md ${
                        pathname.startsWith('/user/clients')
                            ? 'bg-indigo-500 text-white'
                            : 'hover:bg-gray-100'
                    }`}
                >
                    <Users className="w-5 h-5 mr-2" />
                    My Clients
                </Link>
                <Link
                    href="/user/transactions"
                    className={`flex items-center px-4 py-2 rounded-md ${
                        isActive('/user/transactions')
                            ? 'bg-indigo-500 text-white'
                            : 'hover:bg-gray-100'
                    }`}
                >
                    <CreditCard className="w-5 h-5 mr-2" />
                    Transactions
                </Link>
                <Link
                    href="/user/history"
                    className={`flex items-center px-4 py-2 rounded-md ${
                        isActive('/user/history')
                            ? 'bg-indigo-500 text-white'
                            : 'hover:bg-gray-100'
                    }`}
                >
                    <History className="w-5 h-5 mr-2" />
                    History
                </Link>
                <Link
                    href="/user/statistics"
                    className={`flex items-center px-4 py-2 rounded-md ${
                        isActive('/user/statistics')
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
