'use client';

import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';

export default function Navbar() {
    const { user, logout } = useAuth();
    const router = useRouter();

    if (!user) return null;

    const handleLogout = async () => {
        await logout();
        router.push('/login');
    };

    return (
        <nav className="bg-gray-800 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <span className="text-xl font-bold">CalcBet</span>
                        </div>
                        <div className="ml-10 flex items-baseline space-x-4">
                            <Link
                                href={`/dashboard/${user.role}`}
                                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700"
                            >
                                Dashboard
                            </Link>
                            <Link
                                href={`/calculator/${user.role}`}
                                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700"
                            >
                                Calculator
                            </Link>
                        </div>
                    </div>
                    <div className="flex items-center">
                        <span className="mr-4 text-sm">
                            {user.username} ({user.role})
                        </span>
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 rounded-md text-sm font-medium bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                            Sign Out
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
