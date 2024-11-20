'use client';

import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { UserDashboardStats } from '../components/dashboards/UserDashboardStats';
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

export default function UserDashboard() {
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
            <h1 className="text-2xl font-semibold text-gray-900">User Dashboard</h1>
            <div className="flex space-x-4">
              <Button variant="outline" onClick={() => router.push('/profile')}>
                View Profile
              </Button>
              <Button variant="outline" onClick={() => router.push('/clients')}>
                My Clients
              </Button>
            </div>
          </div>

          {/* Statistics Overview */}
          <div className="mb-8">
            <UserDashboardStats />
          </div>

          <Tabs defaultValue="overview" className="mb-8">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="calculations">Calculations</TabsTrigger>
              <TabsTrigger value="clients">Clients</TabsTrigger>
              <TabsTrigger value="sites">Sites</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Recent Activity */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Your latest calculations and updates</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[400px]">
                      <div className="space-y-4">
                        {/* Sample activity items */}
                        <div className="border-b pb-2">
                          <div className="flex justify-between">
                            <div>
                              <p className="font-medium">New Calculation</p>
                              <p className="text-sm text-gray-500">Site: Bet365</p>
                              <p className="text-sm">
                                Initial: $1000 | Current: $1150
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-green-500">+$150.00</p>
                              <p className="text-xs text-gray-500">2h ago</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>

                {/* Client Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle>Client Summary</CardTitle>
                    <CardDescription>Overview of client activities</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-sm text-gray-500">Active Clients</p>
                          <p className="text-2xl font-bold">24</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-sm text-gray-500">Total Credits</p>
                          <p className="text-2xl font-bold text-green-600">$12,450</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-sm text-gray-500">Total Payouts</p>
                          <p className="text-2xl font-bold text-blue-600">$8,320</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-sm text-gray-500">Net Balance</p>
                          <p className="text-2xl font-bold text-purple-600">$4,130</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="calculations">
              <Card>
                <CardHeader>
                  <CardTitle>Calculation History</CardTitle>
                  <CardDescription>Detailed view of your calculations</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Site</TableHead>
                        <TableHead>Initial Fund</TableHead>
                        <TableHead>Current Balance</TableHead>
                        <TableHead>Credits</TableHead>
                        <TableHead>Expenses</TableHead>
                        <TableHead>Result</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {/* Sample calculation rows */}
                      <TableRow>
                        <TableCell>2024-03-15</TableCell>
                        <TableCell>Bet365</TableCell>
                        <TableCell>$1,000</TableCell>
                        <TableCell>$1,150</TableCell>
                        <TableCell>$200</TableCell>
                        <TableCell>$50</TableCell>
                        <TableCell className="text-green-500">+$150</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="clients">
              <Card>
                <CardHeader>
                  <CardTitle>Client Management</CardTitle>
                  <CardDescription>Overview of your clients and their activities</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Client</TableHead>
                        <TableHead>Total Credits</TableHead>
                        <TableHead>Total Payouts</TableHead>
                        <TableHead>Expenses</TableHead>
                        <TableHead>Balance</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {/* Sample client rows */}
                      <TableRow>
                        <TableCell>John Doe</TableCell>
                        <TableCell>$5,000</TableCell>
                        <TableCell>$3,200</TableCell>
                        <TableCell>$800</TableCell>
                        <TableCell className="text-green-500">+$1,000</TableCell>
                        <TableCell>
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                            Active
                          </span>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">View Details</Button>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="sites">
              <div className="grid md:grid-cols-3 gap-6">
                {/* Sample site cards */}
                <Card>
                  <CardHeader>
                    <CardTitle>Bet365</CardTitle>
                    <CardDescription>Primary betting site</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500">Total Calculations</p>
                        <p className="text-2xl font-bold">156</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500">Success Rate</p>
                        <p className="text-2xl font-bold text-green-600">87%</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500">Net Profit</p>
                        <p className="text-2xl font-bold text-blue-600">$3,450</p>
                      </div>
                      <Button className="w-full">View Details</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>

          {/* Calculator Section */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Betting Calculator</CardTitle>
              <CardDescription>Calculate your potential profits and analyze odds</CardDescription>
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
