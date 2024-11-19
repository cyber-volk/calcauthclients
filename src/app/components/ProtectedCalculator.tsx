'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import Calc301 from './calc301';

interface ProtectedCalculatorProps {
    requiredRole: string;
}

export default function ProtectedCalculator({ requiredRole }: ProtectedCalculatorProps) {
    const router = useRouter();
    const { user, isLoading } = useAuth();

    useEffect(() => {
        if (!isLoading && (!user || user.role !== requiredRole)) {
            router.push('/login');
        }
    }, [user, isLoading, router, requiredRole]);

    if (isLoading || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-2xl font-bold mb-4">Advanced Calculator</h2>
                    <Calc301 />
                </div>
            </div>
        </div>
    );
}
