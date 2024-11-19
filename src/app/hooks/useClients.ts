import { useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from '@/components/ui/use-toast';

interface Client {
    id: string;
    name: string;
    email?: string;
    phone?: string;
    initialCredit: number;
    notes?: string;
    status: string;
    ownerId: string;
    ownerRole: string;
    agentId: string;
    transactions: Transaction[];
}

interface Transaction {
    id: string;
    clientId: string;
    type: 'credit' | 'payment' | 'expense' | 'withdrawal';
    amount: number;
    description?: string;
    createdAt: string;
}

interface CreateClientData {
    name: string;
    email?: string;
    phone?: string;
    initialCredit: number;
    notes?: string;
}

interface UpdateClientData {
    name?: string;
    email?: string;
    phone?: string;
    notes?: string;
    status?: 'active' | 'inactive';
}

interface CreateTransactionData {
    type: 'credit' | 'payment' | 'expense' | 'withdrawal';
    amount: number;
    description?: string;
}

export function useClients() {
    const { data: session } = useSession();
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchClients = useCallback(async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/clients');
            if (!response.ok) {
                throw new Error('Failed to fetch clients');
            }
            const data = await response.json();
            setClients(data);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to fetch clients"
            });
        } finally {
            setLoading(false);
        }
    }, []);

    const createClient = useCallback(async (data: CreateClientData) => {
        try {
            setLoading(true);
            const response = await fetch('/api/clients', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error('Failed to create client');
            }

            const newClient = await response.json();
            setClients(prev => [...prev, newClient]);
            setError(null);
            toast({
                title: "Success",
                description: "Client created successfully"
            });
            return newClient;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to create client"
            });
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const updateClient = useCallback(async (clientId: string, data: UpdateClientData) => {
        try {
            setLoading(true);
            const response = await fetch(`/api/clients/${clientId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error('Failed to update client');
            }

            const updatedClient = await response.json();
            setClients(prev => prev.map(client => 
                client.id === clientId ? updatedClient : client
            ));
            setError(null);
            toast({
                title: "Success",
                description: "Client updated successfully"
            });
            return updatedClient;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to update client"
            });
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const getClient = useCallback(async (clientId: string) => {
        try {
            setLoading(true);
            const response = await fetch(`/api/clients/${clientId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch client');
            }
            const data = await response.json();
            setError(null);
            return data;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to fetch client"
            });
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const createTransaction = useCallback(async (clientId: string, data: CreateTransactionData) => {
        try {
            setLoading(true);
            const response = await fetch(`/api/clients/${clientId}/transactions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error('Failed to create transaction');
            }

            const transaction = await response.json();
            setError(null);
            toast({
                title: "Success",
                description: "Transaction created successfully"
            });
            return transaction;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to create transaction"
            });
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const getClientTransactions = useCallback(async (clientId: string) => {
        try {
            setLoading(true);
            const response = await fetch(`/api/clients/${clientId}/transactions`);
            if (!response.ok) {
                throw new Error('Failed to fetch transactions');
            }
            const data = await response.json();
            setError(null);
            return data;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to fetch transactions"
            });
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        clients,
        loading,
        error,
        fetchClients,
        createClient,
        updateClient,
        getClient,
        createTransaction,
        getClientTransactions,
        isAgent: session?.user?.role === 'agent'
    };
}
