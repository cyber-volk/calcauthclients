'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";

interface AgentStats {
  totalClients: number;
  activeClients: number;
  totalForms: number;
  monthlyForms: number;
  revenue: number;
}

interface RecentActivity {
  id: string;
  clientName: string;
  action: string;
  date: string;
  status: string;
}

export function AgentDashboardStats() {
  const { user } = useAuth();
  const [stats, setStats] = useState<AgentStats>({
    totalClients: 0,
    activeClients: 0,
    totalForms: 0,
    monthlyForms: 0,
    revenue: 0,
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);

  useEffect(() => {
    // TODO: Replace with actual API calls
    setStats({
      totalClients: 25,
      activeClients: 18,
      totalForms: 450,
      monthlyForms: 120,
      revenue: 5000,
    });

    setRecentActivity([
      { id: '1', clientName: 'John Doe', action: 'Form Submission', date: '2024-02-20', status: 'Completed' },
      { id: '2', clientName: 'Jane Smith', action: 'New Registration', date: '2024-02-19', status: 'Pending' },
      { id: '3', clientName: 'Mike Johnson', action: 'Form Update', date: '2024-02-18', status: 'Completed' },
    ]);
  }, []);

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalClients}</div>
            <p className="text-xs text-muted-foreground">
              Total registered clients
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Clients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeClients}</div>
            <p className="text-xs text-muted-foreground">
              Clients active this month
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
              All-time form submissions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Forms</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.monthlyForms}</div>
            <p className="text-xs text-muted-foreground">
              Forms this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.revenue}</div>
            <p className="text-xs text-muted-foreground">
              Monthly earnings
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between border-b pb-2">
                  <div>
                    <p className="font-medium">{activity.clientName}</p>
                    <p className="text-sm text-muted-foreground">{activity.action}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm">{activity.date}</p>
                    <p className={`text-sm ${
                      activity.status === 'Completed' ? 'text-green-500' : 'text-yellow-500'
                    }`}>
                      {activity.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
