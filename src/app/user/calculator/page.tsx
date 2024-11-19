'use client';

import DashboardLayout from '@/app/components/DashboardLayout';
import UserSidebar from '@/app/components/dashboards/UserSidebar';
import ProtectedCalculator from '@/app/components/ProtectedCalculator';

export default function UserCalculator() {
    return (
        <DashboardLayout sidebar={<UserSidebar />}>
            <ProtectedCalculator requiredRole="user" />
        </DashboardLayout>
    );
}
