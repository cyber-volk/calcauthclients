'use client';

import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AgentDashboardStats } from '../components/dashboards/AgentDashboardStats';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Calc301 from '../components/calc301';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function AgentDashboard() {
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

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-semibold text-gray-900">Agent Dashboard</h1>
            <div className="flex space-x-4">
              <Button variant="outline" onClick={() => router.push('/agent/clients')}>
                Manage Clients
              </Button>
              <Button variant="outline" onClick={() => router.push('/agent/users')}>
                Manage Users
              </Button>
              <Button variant="outline" onClick={() => router.push('/agent/profile')}>
                Agent Profile
              </Button>
            </div>
          </div>

          {/* Statistics Overview */}
          <div className="mb-8">
            <AgentDashboardStats />
          </div>

          <Tabs defaultValue="overview" className="mb-8">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="clients">Clients</TabsTrigger>
              <TabsTrigger value="calculations">Calculations</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Performance Metrics */}
                <Card>
                  <CardHeader>
                    <CardTitle>Performance Metrics</CardTitle>
                    <CardDescription>Key performance indicators</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500">Total Users</p>
                        <p className="text-2xl font-bold">45</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500">Active Clients</p>
                        <p className="text-2xl font-bold">128</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500">Monthly Revenue</p>
                        <p className="text-2xl font-bold text-green-600">$15,750</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500">Success Rate</p>
                        <p className="text-2xl font-bold text-blue-600">92%</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Latest updates and actions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[300px]">
                      <div className="space-y-4">
                        <div className="border-b pb-2">
                          <div className="flex justify-between">
                            <div>
                              <p className="font-medium">New User Added</p>
                              <p className="text-sm text-gray-500">User: John Smith</p>
                            </div>
                            <p className="text-xs text-gray-500">10m ago</p>
                          </div>
                        </div>
                        <div className="border-b pb-2">
                          <div className="flex justify-between">
                            <div>
                              <p className="font-medium">Client Transaction</p>
                              <p className="text-sm text-gray-500">Client: Alice Johnson</p>
                              <p className="text-sm text-green-500">Credit: +$500</p>
                            </div>
                            <p className="text-xs text-gray-500">1h ago</p>
                          </div>
                        </div>
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="users">
              <Card>
                <CardHeader>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>Manage your users and their permissions</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Clients</TableHead>
                        <TableHead>Total Forms</TableHead>
                        <TableHead>Last Active</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>
                          <div>
                            <p className="font-medium">John Smith</p>
                            <p className="text-sm text-gray-500">john@example.com</p>
                          </div>
                        </TableCell>
                        <TableCell>15</TableCell>
                        <TableCell>45</TableCell>
                        <TableCell>2h ago</TableCell>
                        <TableCell>
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                            Active
                          </span>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">Manage</Button>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="clients">
              <Card>
                <CardHeader>
                  <CardTitle>Client Overview</CardTitle>
                  <CardDescription>Comprehensive client management</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Input 
                        placeholder="Search clients..." 
                        className="max-w-sm"
                      />
                      <Button>Add New Client</Button>
                    </div>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Client</TableHead>
                          <TableHead>Assigned To</TableHead>
                          <TableHead>Credits</TableHead>
                          <TableHead>Payouts</TableHead>
                          <TableHead>Balance</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>
                            <div>
                              <p className="font-medium">Alice Johnson</p>
                              <p className="text-sm text-gray-500">ID: #12345</p>
                            </div>
                          </TableCell>
                          <TableCell>John Smith</TableCell>
                          <TableCell>$5,000</TableCell>
                          <TableCell>$3,200</TableCell>
                          <TableCell className="text-green-500">+$1,800</TableCell>
                          <TableCell>
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                              Active
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button variant="ghost" size="sm">View</Button>
                              <Button variant="ghost" size="sm">Edit</Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="calculations">
              <Card>
                <CardHeader>
                  <CardTitle>Calculation Analytics</CardTitle>
                  <CardDescription>Track and analyze calculations across users</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-4 gap-4">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">
                            Total Calculations
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">1,234</div>
                          <p className="text-xs text-muted-foreground">
                            +180 from last month
                          </p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">
                            Success Rate
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">89%</div>
                          <p className="text-xs text-muted-foreground">
                            +2% from last month
                          </p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">
                            Average Profit
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-green-600">$450</div>
                          <p className="text-xs text-muted-foreground">
                            Per calculation
                          </p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">
                            Active Sites
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">8</div>
                          <p className="text-xs text-muted-foreground">
                            Across all users
                          </p>
                        </CardContent>
                      </Card>
                    </div>

                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>User</TableHead>
                          <TableHead>Site</TableHead>
                          <TableHead>Initial Fund</TableHead>
                          <TableHead>Current Balance</TableHead>
                          <TableHead>Client Credits</TableHead>
                          <TableHead>Client Payouts</TableHead>
                          <TableHead>Result</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>John Smith</TableCell>
                          <TableCell>Bet365</TableCell>
                          <TableCell>$1,000</TableCell>
                          <TableCell>$1,450</TableCell>
                          <TableCell>$500</TableCell>
                          <TableCell>$300</TableCell>
                          <TableCell className="text-green-500">+$450</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reports">
              <div className="grid md:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Financial Summary</CardTitle>
                    <CardDescription>Monthly financial overview</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center border-b pb-2">
                        <span>Total Revenue</span>
                        <span className="font-bold text-green-500">$45,750</span>
                      </div>
                      <div className="flex justify-between items-center border-b pb-2">
                        <span>Total Payouts</span>
                        <span className="font-bold text-blue-500">$32,450</span>
                      </div>
                      <div className="flex justify-between items-center border-b pb-2">
                        <span>Net Profit</span>
                        <span className="font-bold text-purple-500">$13,300</span>
                      </div>
                      <Button className="w-full">Download Report</Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>User Performance</CardTitle>
                    <CardDescription>Top performing users</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>User</TableHead>
                          <TableHead>Clients</TableHead>
                          <TableHead>Success Rate</TableHead>
                          <TableHead>Revenue</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>John Smith</TableCell>
                          <TableCell>15</TableCell>
                          <TableCell>92%</TableCell>
                          <TableCell>$12,450</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>

          {/* Calculator Section */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Betting Calculator</CardTitle>
              <CardDescription>Calculate and analyze betting opportunities</CardDescription>
            </CardHeader>
            <CardContent>
              <Calc301 />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
