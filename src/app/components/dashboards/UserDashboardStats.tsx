'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";

interface SiteStats {
  totalForms: number;
  activeSites: number;
  pendingForms: number;
  completedForms: number;
}

interface RecentForm {
  id: string;
  siteName: string;
  status: string;
  date: string;
}

export function UserDashboardStats() {
  const { user } = useAuth();
  const [stats, setStats] = useState<SiteStats>({
    totalForms: 0,
    activeSites: 0,
    pendingForms: 0,
    completedForms: 0,
  });
  const [recentForms, setRecentForms] = useState<RecentForm[]>([]);

  useEffect(() => {
    // TODO: Replace with actual API calls
    // Simulated data for now
    setStats({
      totalForms: 150,
      activeSites: 5,
      pendingForms: 3,
      completedForms: 147,
    });

    setRecentForms([
      { id: '1', siteName: 'Site A', status: 'Completed', date: '2024-02-20' },
      { id: '2', siteName: 'Site B', status: 'Pending', date: '2024-02-19' },
      { id: '3', siteName: 'Site C', status: 'Completed', date: '2024-02-18' },
    ]);
  }, []);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Forms</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalForms}</div>
          <p className="text-xs text-muted-foreground">
            Lifetime form submissions
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Sites</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.activeSites}</div>
          <p className="text-xs text-muted-foreground">
            Sites currently in use
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending Forms</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.pendingForms}</div>
          <p className="text-xs text-muted-foreground">
            Forms awaiting completion
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Completed Forms</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.completedForms}</div>
          <p className="text-xs text-muted-foreground">
            Successfully completed forms
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
