'use client';

import DashboardLayout from '@/app/components/DashboardLayout';
import AgentSidebar from '@/app/components/dashboards/AgentSidebar';
import ProtectedCalculator from '@/app/components/ProtectedCalculator';

export default function AgentCalculator() {
    return (
        <DashboardLayout sidebar={<AgentSidebar />}>
            <ProtectedCalculator requiredRole="agent" />
        </DashboardLayout>
    );
}
