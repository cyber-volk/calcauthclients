import { NextResponse } from 'next/server';
import { ClientService } from '@/app/services/clientService';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

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

        return NextResponse.json(client);
    } catch (error) {
        console.error('Error fetching client:', error);
        return NextResponse.json(
            { error: 'Failed to fetch client' },
            { status: 500 }
        );
    }
}

export async function PUT(
    req: Request,
    { params }: { params: { clientId: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const data = await req.json();
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

        const updatedClient = await ClientService.updateClient(params.clientId, data);
        return NextResponse.json(updatedClient);
    } catch (error) {
        console.error('Error updating client:', error);
        return NextResponse.json(
            { error: 'Failed to update client' },
            { status: 500 }
        );
    }
}
