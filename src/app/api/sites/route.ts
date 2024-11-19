import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

// GET /api/sites - Get all sites for the current user
export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            include: { sites: true },
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // If admin or agent, get all sites they have access to
        let sites;
        if (user.role === 'admin') {
            sites = await prisma.site.findMany();
        } else if (user.role === 'agent') {
            sites = await prisma.site.findMany({
                where: {
                    user: {
                        agentId: user.id,
                    },
                },
            });
        } else {
            sites = user.sites;
        }

        return NextResponse.json(sites);
    } catch (error) {
        console.error('Error fetching sites:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// POST /api/sites - Create a new site
export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { name, description } = body;

        const site = await prisma.site.create({
            data: {
                name,
                description,
                userId: session.user.id,
            },
        });

        return NextResponse.json(site);
    } catch (error) {
        console.error('Error creating site:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// PUT /api/sites - Update a site
export async function PUT(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { id, name, description } = body;

        // Check if user has access to this site
        const site = await prisma.site.findUnique({
            where: { id },
            include: { user: true },
        });

        if (!site) {
            return NextResponse.json({ error: 'Site not found' }, { status: 404 });
        }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
        });

        if (
            !user ||
            (user.role !== 'admin' &&
                user.role !== 'agent' &&
                site.userId !== user.id)
        ) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const updatedSite = await prisma.site.update({
            where: { id },
            data: { name, description },
        });

        return NextResponse.json(updatedSite);
    } catch (error) {
        console.error('Error updating site:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// DELETE /api/sites - Delete a site
export async function DELETE(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { error: 'Site ID is required' },
                { status: 400 }
            );
        }

        // Check if user has access to this site
        const site = await prisma.site.findUnique({
            where: { id },
            include: { user: true },
        });

        if (!site) {
            return NextResponse.json({ error: 'Site not found' }, { status: 404 });
        }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
        });

        if (
            !user ||
            (user.role !== 'admin' &&
                user.role !== 'agent' &&
                site.userId !== user.id)
        ) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await prisma.site.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting site:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
