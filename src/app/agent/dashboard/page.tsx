'use client';

import DashboardLayout from '@/app/components/DashboardLayout';
import AgentSidebar from '@/app/components/dashboards/AgentSidebar';

export default function AgentDashboard() {
    return (
        <DashboardLayout sidebar={<AgentSidebar />}>
            <div className="p-6">
                <h1 className="text-2xl font-semibold mb-6">Agent Dashboard</h1>
                {/* Add agent-specific dashboard content */}
            </div>
        </DashboardLayout>
    );
}
