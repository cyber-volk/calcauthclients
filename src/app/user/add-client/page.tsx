'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/app/components/DashboardLayout';
import UserSidebar from '@/app/components/dashboards/UserSidebar';
import { Save, X, Users } from 'lucide-react';

interface ClientFormData {
    name: string;
    email: string;
    phone: string;
    initialCredit: string;
    notes: string;
}

export default function UserAddClient() {
    const router = useRouter();
    const [formData, setFormData] = useState<ClientFormData>({
        name: '',
        email: '',
        phone: '',
        initialCredit: '',
        notes: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Add client creation logic here
        console.log('Creating client:', formData);
        // Redirect to clients list after creation
        router.push('/user/clients');
    };

    const handleCancel = () => {
        router.push('/user/clients');
    };

    return (
        <DashboardLayout sidebar={<UserSidebar />}>
            <div className="p-6">
                <div className="max-w-2xl mx-auto">
                    <div className="flex items-center mb-6">
                        <Users className="w-6 h-6 mr-2 text-indigo-500" />
                        <h1 className="text-2xl font-semibold">Add New Client</h1>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Client Name *
                            </label>
                            <input
                                type="text"
                                required
                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email
                            </label>
                            <input
                                type="email"
                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Initial Credit
                            </label>
                            <input
                                type="number"
                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                value={formData.initialCredit}
                                onChange={(e) => setFormData({ ...formData, initialCredit: e.target.value })}
                            />
                            <p className="mt-1 text-sm text-gray-500">
                                Note: Initial credit requires approval from your agent
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Notes
                            </label>
                            <textarea
                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                rows={4}
                                value={formData.notes}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            />
                        </div>

                        <div className="flex justify-end space-x-4 pt-4">
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="flex items-center px-4 py-2 border rounded-md hover:bg-gray-50"
                            >
                                <X className="w-4 h-4 mr-2" />
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="flex items-center px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600"
                            >
                                <Save className="w-4 h-4 mr-2" />
                                Save Client
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </DashboardLayout>
    );
}
