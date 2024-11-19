import { NextResponse } from 'next/server';
import { ClientService } from '@/app/services/clientService';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const data = await req.json();
        const userId = session.user.id;
        const userRole = session.user.role;

        const client = await ClientService.createClient({
            ...data,
            ownerId: userId,
            ownerRole: userRole,
            agentId: userRole === 'user' ? data.agentId : userId
        });

        return NextResponse.json(client);
    } catch (error) {
        console.error('Error creating client:', error);
        return NextResponse.json(
            { error: 'Failed to create client' },
            { status: 500 }
        );
    }
}

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const userId = session.user.id;
        const userRole = session.user.role;

        let clients;
        if (userRole === 'user') {
            clients = await ClientService.getClientsByOwner(userId);
        } else if (userRole === 'agent') {
            clients = await ClientService.getClientsByAgent(userId);
        } else {
            return NextResponse.json({ error: 'Invalid role' }, { status: 403 });
        }

        return NextResponse.json(clients);
    } catch (error) {
        console.error('Error fetching clients:', error);
        return NextResponse.json(
            { error: 'Failed to fetch clients' },
            { status: 500 }
        );
    }
}
