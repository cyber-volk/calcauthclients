import { NextResponse } from 'next/server';
import { ClientService } from '@/app/services/clientService';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(
    req: Request,
    { params }: { params: { clientId: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const client = await ClientService.getClient(params.clientId);
        if (!client) {
            return NextResponse.json({ error: 'Client not found' }, { status: 404 });
        }

        // Check if user has access to this client
        const userId = session.user.id;
        const userRole = session.user.role;
        if (userRole === 'user' && client.ownerId !== userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        if (userRole === 'agent' && client.agentId !== userId && client.ownerId !== userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const data = await req.json();
        const transaction = await ClientService.createTransaction({
            ...data,
            clientId: params.clientId
        });

        return NextResponse.json(transaction);
    } catch (error) {
        console.error('Error creating transaction:', error);
        return NextResponse.json(
            { error: 'Failed to create transaction' },
            { status: 500 }
        );
    }
}

export async function GET(
    req: Request,
    { params }: { params: { clientId: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const client = await ClientService.getClient(params.clientId);
        if (!client) {
            return NextResponse.json({ error: 'Client not found' }, { status: 404 });
        }

        // Check if user has access to this client
        const userId = session.user.id;
        const userRole = session.user.role;
        if (userRole === 'user' && client.ownerId !== userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        if (userRole === 'agent' && client.agentId !== userId && client.ownerId !== userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const transactions = await ClientService.getClientTransactions(params.clientId);
        const balance = await ClientService.getClientBalance(params.clientId);

        return NextResponse.json({ transactions, balance });
    } catch (error) {
        console.error('Error fetching transactions:', error);
        return NextResponse.json(
            { error: 'Failed to fetch transactions' },
            { status: 500 }
        );
    }
}
