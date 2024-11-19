'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useClients } from '@/app/hooks/useClients';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';

interface Client {
    id: string;
    name: string;
    email?: string;
    phone?: string;
    status: string;
    initialCredit: number;
    notes?: string;
}

interface Transaction {
    id: string;
    type: 'credit' | 'payment' | 'expense' | 'withdrawal';
    amount: number;
    description?: string;
    createdAt: string;
}

export default function ClientDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { getClient, createTransaction, getClientTransactions, loading } = useClients();
    const [client, setClient] = useState<Client | null>(null);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [balance, setBalance] = useState<number>(0);
    const [transactionType, setTransactionType] = useState<'credit' | 'payment' | 'expense' | 'withdrawal'>('credit');
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    useEffect(() => {
        const clientId = params.clientId as string;
        if (clientId) {
            fetchClientData(clientId);
        }
    }, [params.clientId]);

    const fetchClientData = async (clientId: string) => {
        try {
            const clientData = await getClient(clientId);
            setClient(clientData);
            const { transactions: clientTransactions, balance: clientBalance } = await getClientTransactions(clientId);
            setTransactions(clientTransactions);
            setBalance(clientBalance);
        } catch (error) {
            console.error('Error fetching client data:', error);
        }
    };

    const handleCreateTransaction = async () => {
        if (!client || !amount) return;

        try {
            await createTransaction(client.id, {
                type: transactionType,
                amount: parseFloat(amount),
                description,
            });
            await fetchClientData(client.id);
            setIsDialogOpen(false);
            setAmount('');
            setDescription('');
        } catch (error) {
            console.error('Error creating transaction:', error);
        }
    };

    if (loading || !client) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8">
            <div className="grid gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Client Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4">
                            <div>
                                <Label>Name</Label>
                                <div className="text-lg font-medium">{client.name}</div>
                            </div>
                            {client.email && (
                                <div>
                                    <Label>Email</Label>
                                    <div>{client.email}</div>
                                </div>
                            )}
                            {client.phone && (
                                <div>
                                    <Label>Phone</Label>
                                    <div>{client.phone}</div>
                                </div>
                            )}
                            <div>
                                <Label>Status</Label>
                                <div className="capitalize">{client.status}</div>
                            </div>
                            <div>
                                <Label>Balance</Label>
                                <div className="text-xl font-bold">${balance.toFixed(2)}</div>
                            </div>
                            {client.notes && (
                                <div>
                                    <Label>Notes</Label>
                                    <div>{client.notes}</div>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Transactions</CardTitle>
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                                <Button>New Transaction</Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Create Transaction</DialogTitle>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div>
                                        <Label htmlFor="type">Type</Label>
                                        <Select
                                            value={transactionType}
                                            onValueChange={(value: any) => setTransactionType(value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="credit">Credit</SelectItem>
                                                <SelectItem value="payment">Payment</SelectItem>
                                                <SelectItem value="expense">Expense</SelectItem>
                                                <SelectItem value="withdrawal">Withdrawal</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Label htmlFor="amount">Amount</Label>
                                        <Input
                                            id="amount"
                                            type="number"
                                            value={amount}
                                            onChange={(e) => setAmount(e.target.value)}
                                            placeholder="Enter amount"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="description">Description</Label>
                                        <Input
                                            id="description"
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            placeholder="Enter description"
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-end">
                                    <Button onClick={handleCreateTransaction}>
                                        Create Transaction
                                    </Button>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {transactions.map((transaction) => (
                                <div
                                    key={transaction.id}
                                    className="flex items-center justify-between p-4 border rounded-lg"
                                >
                                    <div>
                                        <div className="font-medium capitalize">
                                            {transaction.type}
                                        </div>
                                        {transaction.description && (
                                            <div className="text-sm text-gray-500">
                                                {transaction.description}
                                            </div>
                                        )}
                                        <div className="text-sm text-gray-500">
                                            {new Date(transaction.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                    <div className={`text-lg font-bold ${
                                        ['credit', 'payment'].includes(transaction.type)
                                            ? 'text-green-600'
                                            : 'text-red-600'
                                    }`}>
                                        ${transaction.amount.toFixed(2)}
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
