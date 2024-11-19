import { prisma } from '@/lib/prisma';

interface CreateClientData {
    name: string;
    email?: string;
    phone?: string;
    initialCredit: number;
    notes?: string;
    ownerId: string;
    ownerRole: string;
    agentId: string;
}

interface UpdateClientData {
    name?: string;
    email?: string;
    phone?: string;
    notes?: string;
    status?: 'active' | 'inactive';
}

interface CreateTransactionData {
    clientId: string;
    type: 'credit' | 'payment' | 'expense' | 'withdrawal';
    amount: number;
    description?: string;
}

export class ClientService {
    static async createClient(data: CreateClientData) {
        return prisma.client.create({
            data: {
                ...data,
                status: 'active'
            },
            include: {
                transactions: true
            }
        });
    }

    static async updateClient(id: string, data: UpdateClientData) {
        return prisma.client.update({
            where: { id },
            data,
            include: {
                transactions: true
            }
        });
    }

    static async getClient(id: string) {
        return prisma.client.findUnique({
            where: { id },
            include: {
                transactions: {
                    orderBy: {
                        createdAt: 'desc'
                    }
                }
            }
        });
    }

    static async getClientsByOwner(ownerId: string) {
        return prisma.client.findMany({
            where: { ownerId },
            include: {
                transactions: {
                    orderBy: {
                        createdAt: 'desc'
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
    }

    static async getClientsByAgent(agentId: string) {
        return prisma.client.findMany({
            where: { agentId },
            include: {
                transactions: {
                    orderBy: {
                        createdAt: 'desc'
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
    }

    static async createTransaction(data: CreateTransactionData) {
        const transaction = await prisma.clientTransaction.create({
            data: {
                type: data.type,
                amount: data.amount,
                description: data.description,
                clientId: data.clientId
            }
        });

        return transaction;
    }

    static async getClientTransactions(clientId: string) {
        const transactions = await prisma.clientTransaction.findMany({
            where: { clientId },
            orderBy: {
                createdAt: 'desc'
            }
        });

        const balance = await this.calculateClientBalance(clientId);

        return { transactions, balance };
    }

    static async calculateClientBalance(clientId: string) {
        const client = await prisma.client.findUnique({
            where: { id: clientId },
            include: {
                transactions: true
            }
        });

        if (!client) {
            throw new Error('Client not found');
        }

        let balance = client.initialCredit;

        for (const transaction of client.transactions) {
            switch (transaction.type) {
                case 'credit':
                case 'payment':
                    balance += transaction.amount;
                    break;
                case 'expense':
                case 'withdrawal':
                    balance -= transaction.amount;
                    break;
            }
        }

        return balance;
    }
}
