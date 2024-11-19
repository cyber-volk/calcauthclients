import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

// GET /api/forms - Get all forms for the current user
export async function GET(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const siteId = searchParams.get('siteId');

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            include: { forms: true },
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // If admin or agent, get all forms they have access to
        let forms;
        if (user.role === 'admin') {
            forms = await prisma.form.findMany({
                where: siteId ? { siteId } : undefined,
                include: { user: true, site: true },
            });
        } else if (user.role === 'agent') {
            forms = await prisma.form.findMany({
                where: {
                    ...(siteId ? { siteId } : {}),
                    user: {
                        agentId: user.id,
                    },
                },
                include: { user: true, site: true },
            });
        } else {
            forms = await prisma.form.findMany({
                where: {
                    userId: user.id,
                    ...(siteId ? { siteId } : {}),
                },
                include: { site: true },
            });
        }

        return NextResponse.json(forms);
    } catch (error) {
        console.error('Error fetching forms:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// POST /api/forms - Create a new form
export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { name, data, siteId } = body;

        // Verify site access
        const site = await prisma.site.findUnique({
            where: { id: siteId },
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

        const form = await prisma.form.create({
            data: {
                name,
                data,
                userId: session.user.id,
                siteId,
            },
        });

        return NextResponse.json(form);
    } catch (error) {
        console.error('Error creating form:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// PUT /api/forms - Update a form
export async function PUT(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { id, name, data } = body;

        // Check if user has access to this form
        const form = await prisma.form.findUnique({
            where: { id },
            include: { user: true },
        });

        if (!form) {
            return NextResponse.json({ error: 'Form not found' }, { status: 404 });
        }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
        });

        if (
            !user ||
            (user.role !== 'admin' &&
                user.role !== 'agent' &&
                form.userId !== user.id)
        ) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const updatedForm = await prisma.form.update({
            where: { id },
            data: { name, data },
        });

        return NextResponse.json(updatedForm);
    } catch (error) {
        console.error('Error updating form:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// DELETE /api/forms - Delete a form
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
                { error: 'Form ID is required' },
                { status: 400 }
            );
        }

        // Check if user has access to this form
        const form = await prisma.form.findUnique({
            where: { id },
            include: { user: true },
        });

        if (!form) {
            return NextResponse.json({ error: 'Form not found' }, { status: 404 });
        }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
        });

        if (
            !user ||
            (user.role !== 'admin' &&
                user.role !== 'agent' &&
                form.userId !== user.id)
        ) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await prisma.form.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting form:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
