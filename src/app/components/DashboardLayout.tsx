'use client';

import { ReactNode } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from './Navbar';

interface DashboardLayoutProps {
    children: ReactNode;
    sidebar?: ReactNode;
}

export default function DashboardLayout({ children, sidebar }: DashboardLayoutProps) {
    const { user } = useAuth();

    if (!user) return null;

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />
            
            <div className="flex">
                {sidebar && (
                    <aside className="w-64 bg-white shadow-md">
                        {sidebar}
                    </aside>
                )}
                
                <main className="flex-1 p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
