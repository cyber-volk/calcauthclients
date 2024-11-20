'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";

interface AdminStats {
  totalUsers: number;
  totalAgents: number;
  totalClients: number;
  totalForms: number;
  totalRevenue: number;
  activeUsers: number;
}

interface SystemActivity {
  id: string;
  user: string;
  role: string;
  action: string;
  date: string;
}

export function AdminDashboardStats() {
  const { user } = useAuth();
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalAgents: 0,
    totalClients: 0,
    totalForms: 0,
    totalRevenue: 0,
    activeUsers: 0,
  });
  const [systemActivity, setSystemActivity] = useState<SystemActivity[]>([]);

  useEffect(() => {
    // TODO: Replace with actual API calls
    setStats({
      totalUsers: 150,
      totalAgents: 15,
      totalClients: 130,
      totalForms: 1200,
      totalRevenue: 25000,
      activeUsers: 85,
    });

    setSystemActivity([
      { id: '1', user: 'Agent Smith', role: 'Agent', action: 'Added new client', date: '2024-02-20' },
      { id: '2', user: 'John Doe', role: 'Client', action: 'Form submission', date: '2024-02-19' },
      { id: '3', user: 'Admin User', role: 'Admin', action: 'System update', date: '2024-02-18' },
    ]);
  }, []);

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              All registered users
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Agents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAgents}</div>
            <p className="text-xs text-muted-foreground">
              Registered agents
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalClients}</div>
            <p className="text-xs text-muted-foreground">
              Registered clients
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Forms</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalForms}</div>
            <p className="text-xs text-muted-foreground">
              All form submissions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalRevenue}</div>
            <p className="text-xs text-muted-foreground">
              Total earnings
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeUsers}</div>
            <p className="text-xs text-muted-foreground">
              Users active today
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>System Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {systemActivity.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between border-b pb-2">
                  <div>
                    <p className="font-medium">{activity.user}</p>
                    <p className="text-sm text-muted-foreground">{activity.action}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{activity.role}</p>
                    <p className="text-sm text-muted-foreground">{activity.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>System Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium">User Distribution</p>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-500" 
                        style={{ width: `${(stats.totalClients / stats.totalUsers) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm">Clients</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-green-500" 
                        style={{ width: `${(stats.totalAgents / stats.totalUsers) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm">Agents</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Activity Status</p>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-purple-500" 
                        style={{ width: `${(stats.activeUsers / stats.totalUsers) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm">Active</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
