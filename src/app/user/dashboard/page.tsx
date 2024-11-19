'use client';

import DashboardLayout from '@/app/components/DashboardLayout';
import UserSidebar from '@/app/components/dashboards/UserSidebar';

export default function UserDashboard() {
    return (
        <DashboardLayout sidebar={<UserSidebar />}>
            <div className="p-6">
                <h1 className="text-2xl font-semibold mb-6">User Dashboard</h1>
                {/* Add user-specific dashboard content */}
            </div>
        </DashboardLayout>
    );
}
