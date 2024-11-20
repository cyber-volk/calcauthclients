'use client';

import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AdminDashboardStats } from '../components/dashboards/AdminDashboardStats';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Calc301 from '../components/calc301';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AdminDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  const handleUserAction = (action: string) => {
    // TODO: Implement user management actions
    console.log(`Admin action: ${action}`);
  };

  const handleSystemAction = (action: string) => {
    // TODO: Implement system management actions
    console.log(`System action: ${action}`);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-semibold text-gray-900">Admin Dashboard</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">Last updated: {new Date().toLocaleString()}</span>
            </div>
          </div>

          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="system">System</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
              <TabsTrigger value="calculator">Calculator</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              {/* Statistics Overview */}
              <div className="mb-8">
                <AdminDashboardStats />
              </div>

              {/* Quick Actions Grid */}
              <div className="grid md:grid-cols-3 gap-6">
                {/* User Management Card */}
                <Card>
                  <CardHeader>
                    <CardTitle>User Management</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <Button 
                        onClick={() => handleUserAction('add_user')}
                        className="w-full bg-blue-600 hover:bg-blue-700"
                      >
                        Add New User
                      </Button>
                      <Button 
                        onClick={() => handleUserAction('manage_roles')}
                        className="w-full bg-green-600 hover:bg-green-700"
                      >
                        Manage Roles
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* System Settings Card */}
                <Card>
                  <CardHeader>
                    <CardTitle>System Settings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <Button 
                        onClick={() => handleSystemAction('configuration')}
                        className="w-full bg-purple-600 hover:bg-purple-700"
                      >
                        System Configuration
                      </Button>
                      <Button 
                        onClick={() => handleSystemAction('backup')}
                        className="w-full bg-indigo-600 hover:bg-indigo-700"
                      >
                        Backup Database
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Reports Card */}
                <Card>
                  <CardHeader>
                    <CardTitle>Reports & Analytics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <Button 
                        onClick={() => handleSystemAction('generate_report')}
                        className="w-full bg-yellow-600 hover:bg-yellow-700"
                      >
                        Generate Reports
                      </Button>
                      <Button 
                        onClick={() => handleSystemAction('analytics')}
                        className="w-full bg-orange-600 hover:bg-orange-700"
                      >
                        View Analytics
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="users" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>User Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Input 
                        placeholder="Search users..." 
                        className="max-w-sm"
                      />
                      <Button>Add New User</Button>
                    </div>
                    <Table>
                      <TableCaption>List of all users in the system</TableCaption>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Username</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Created At</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {/* Sample data - replace with actual user data */}
                        <TableRow>
                          <TableCell>john.doe</TableCell>
                          <TableCell>Agent</TableCell>
                          <TableCell>Active</TableCell>
                          <TableCell>{new Date().toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm">Edit</Button>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="system" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>System Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6">
                    <div className="space-y-2">
                      <Label>System Mode</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select system mode" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="production">Production</SelectItem>
                          <SelectItem value="maintenance">Maintenance</SelectItem>
                          <SelectItem value="debug">Debug</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Backup Schedule</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select backup frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button>Save Settings</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reports" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Reports & Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <Select>
                        <SelectTrigger className="w-[200px]">
                          <SelectValue placeholder="Select report type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="user">User Activity</SelectItem>
                          <SelectItem value="financial">Financial Summary</SelectItem>
                          <SelectItem value="system">System Performance</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button>Generate Report</Button>
                    </div>
                    <Table>
                      <TableCaption>Recent Reports</TableCaption>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Report Name</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Generated</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>Monthly Activity Report</TableCell>
                          <TableCell>User Activity</TableCell>
                          <TableCell>{new Date().toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm">Download</Button>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="calculator" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>System Calculator</CardTitle>
                </CardHeader>
                <CardContent>
                  <Calc301 />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
