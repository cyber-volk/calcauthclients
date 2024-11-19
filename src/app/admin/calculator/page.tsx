'use client';

import DashboardLayout from '@/app/components/DashboardLayout';
import AdminSidebar from '@/app/components/dashboards/AdminSidebar';
import ProtectedCalculator from '@/app/components/ProtectedCalculator';

export default function AdminCalculator() {
    return (
        <DashboardLayout sidebar={<AdminSidebar />}>
            <ProtectedCalculator requiredRole="admin" />
        </DashboardLayout>
    );
}
