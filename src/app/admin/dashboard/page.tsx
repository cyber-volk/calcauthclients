'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/app/components/DashboardLayout';
import AdminSidebar from '@/app/components/dashboards/AdminSidebar';

interface AdminStats {
    totalAgents: number;
    totalUsers: number;
    totalSites: number;
    totalForms: number;
    recentActivity: Array<{
        id: string;
        type: 'agent' | 'user' | 'site' | 'form';
        action: string;
        date: string;
    }>;
    systemStats: {
        activeUsers: number;
        todayLogins: number;
        pendingApprovals: number;
    };
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<AdminStats>({
        totalAgents: 0,
        totalUsers: 0,
        totalSites: 0,
        totalForms: 0,
        recentActivity: [],
        systemStats: {
            activeUsers: 0,
            todayLogins: 0,
            pendingApprovals: 0
        }
    });

    useEffect(() => {
        // Mock data - replace with actual API calls
        setStats({
            totalAgents: 15,
            totalUsers: 150,
            totalSites: 25,
            totalForms: 75,
            recentActivity: [
                {
                    id: '1',
                    type: 'agent',
                    action: 'New agent registered',
                    date: '2024-01-20'
                },
                {
                    id: '2',
                    type: 'user',
                    action: 'User account updated',
                    date: '2024-01-19'
                }
            ],
            systemStats: {
                activeUsers: 45,
                todayLogins: 23,
                pendingApprovals: 5
            }
        });
    }, []);

    return (
        <DashboardLayout sidebar={<AdminSidebar />}>
            <div className="p-6">
                <h1 className="text-2xl font-semibold mb-6">Admin Dashboard</h1>
                
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white p-4 rounded-lg shadow">
                        <h3 className="text-gray-500 text-sm">Total Agents</h3>
                        <p className="text-2xl font-semibold">{stats.totalAgents}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow">
                        <h3 className="text-gray-500 text-sm">Total Users</h3>
                        <p className="text-2xl font-semibold">{stats.totalUsers}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow">
                        <h3 className="text-gray-500 text-sm">Total Sites</h3>
                        <p className="text-2xl font-semibold">{stats.totalSites}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow">
                        <h3 className="text-gray-500 text-sm">Total Forms</h3>
                        <p className="text-2xl font-semibold">{stats.totalForms}</p>
                    </div>
                </div>

                {/* System Stats */}
                <div className="bg-white rounded-lg shadow mb-6">
                    <div className="p-4 border-b">
                        <h2 className="text-lg font-semibold">System Statistics</h2>
                    </div>
                    <div className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <h3 className="text-gray-500 text-sm">Active Users</h3>
                                <p className="text-xl font-semibold">{stats.systemStats.activeUsers}</p>
                            </div>
                            <div>
                                <h3 className="text-gray-500 text-sm">Today's Logins</h3>
                                <p className="text-xl font-semibold">{stats.systemStats.todayLogins}</p>
                            </div>
                            <div>
                                <h3 className="text-gray-500 text-sm">Pending Approvals</h3>
                                <p className="text-xl font-semibold">{stats.systemStats.pendingApprovals}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-lg shadow">
                    <div className="p-4 border-b">
                        <h2 className="text-lg font-semibold">Recent Activity</h2>
                    </div>
                    <div className="p-4">
                        <div className="space-y-4">
                            {stats.recentActivity.map((activity) => (
                                <div key={activity.id} className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium">{activity.action}</p>
                                        <p className="text-sm text-gray-500">{activity.date}</p>
                                    </div>
                                    <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                                        {activity.type}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
