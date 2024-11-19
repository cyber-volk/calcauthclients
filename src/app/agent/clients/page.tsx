'use client';

import { useState } from 'react';
import DashboardLayout from '@/app/components/DashboardLayout';
import AgentSidebar from '@/app/components/dashboards/AgentSidebar';
import { Search, Filter, Download, Plus, Users } from 'lucide-react';
import Link from 'next/link';

interface ClientData {
    id: string;
    name: string;
    owner: {
        id: string;
        name: string;
        role: 'agent' | 'user';
    };
    totalCredit: number;
    totalPayment: number;
    balance: number;
    lastTransaction: string;
    status: 'active' | 'inactive';
}

export default function AgentClients() {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
    const [filterOwner, setFilterOwner] = useState<'all' | 'direct' | 'users'>('all');

    // Mock data - replace with actual data fetching
    const clients: ClientData[] = [
        {
            id: '1',
            name: 'Direct Client 1',
            owner: {
                id: 'agent1',
                name: 'Current Agent',
                role: 'agent'
            },
            totalCredit: 5000,
            totalPayment: 3000,
            balance: 2000,
            lastTransaction: '2024-01-20',
            status: 'active'
        },
        {
            id: '2',
            name: 'User Client 1',
            owner: {
                id: 'user1',
                name: 'John User',
                role: 'user'
            },
            totalCredit: 3000,
            totalPayment: 1000,
            balance: 2000,
            lastTransaction: '2024-01-19',
            status: 'active'
        },
    ];

    const filteredClients = clients.filter(client => {
        const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            client.owner.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' || client.status === filterStatus;
        const matchesOwner = filterOwner === 'all' || 
                            (filterOwner === 'direct' && client.owner.role === 'agent') ||
                            (filterOwner === 'users' && client.owner.role === 'user');
        return matchesSearch && matchesStatus && matchesOwner;
    });

    return (
        <DashboardLayout sidebar={<AgentSidebar />}>
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center">
                        <Users className="w-6 h-6 mr-2 text-indigo-500" />
                        <h1 className="text-2xl font-semibold">All Clients</h1>
                    </div>
                    <Link 
                        href="/agent/add-client"
                        className="flex items-center px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Add New Client
                    </Link>
                </div>

                {/* Search and Filter Bar */}
                <div className="flex gap-4 mb-6">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search clients or owners..."
                            className="w-full pl-10 pr-4 py-2 border rounded-md"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <select
                        className="px-4 py-2 border rounded-md"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value as 'all' | 'active' | 'inactive')}
                    >
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                    <select
                        className="px-4 py-2 border rounded-md"
                        value={filterOwner}
                        onChange={(e) => setFilterOwner(e.target.value as 'all' | 'direct' | 'users')}
                    >
                        <option value="all">All Clients</option>
                        <option value="direct">My Direct Clients</option>
                        <option value="users">Users' Clients</option>
                    </select>
                    <button className="flex items-center px-4 py-2 border rounded-md hover:bg-gray-50">
                        <Download className="w-4 h-4 mr-2" />
                        Export
                    </button>
                </div>

                {/* Clients Table */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Client Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Owner
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Total Credit
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Total Payment
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Balance
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Last Transaction
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredClients.map((client) => (
                                <tr key={client.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{client.name}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">
                                            {client.owner.role === 'agent' ? 'Direct Client' : client.owner.name}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {client.owner.role === 'agent' ? 'You' : 'User'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">${client.totalCredit.toLocaleString()}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">${client.totalPayment.toLocaleString()}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">${client.balance.toLocaleString()}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{client.lastTransaction}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            client.status === 'active' 
                                                ? 'bg-green-100 text-green-800' 
                                                : 'bg-red-100 text-red-800'
                                        }`}>
                                            {client.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <Link 
                                            href={`/agent/clients/${client.id}`}
                                            className="text-indigo-600 hover:text-indigo-900 mr-4"
                                        >
                                            View
                                        </Link>
                                        <Link 
                                            href={`/agent/clients/${client.id}/edit`}
                                            className="text-indigo-600 hover:text-indigo-900"
                                        >
                                            Edit
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </DashboardLayout>
    );
}
