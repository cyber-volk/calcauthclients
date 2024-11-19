import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { hash } from 'bcrypt';

// GET /api/users - Get users based on role
export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const currentUser = await prisma.user.findUnique({
            where: { id: session.user.id },
        });

        if (!currentUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        let users;
        if (currentUser.role === 'admin') {
            // Admin can see all users
            users = await prisma.user.findMany({
                include: {
                    agent: true,
                    sites: true,
                    forms: true,
                },
            });
        } else if (currentUser.role === 'agent') {
            // Agent can only see their users
            users = await prisma.user.findMany({
                where: {
                    agentId: currentUser.id,
                },
                include: {
                    sites: true,
                    forms: true,
                },
            });
        } else {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        return NextResponse.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// POST /api/users - Create a new user
export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const currentUser = await prisma.user.findUnique({
            where: { id: session.user.id },
            include: {
                _count: {
                    select: { users: true },
                },
            },
        });

        if (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'agent')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { username, password } = body;

        // If agent, check user limit
        if (currentUser.role === 'agent') {
            const agent = await prisma.agent.findUnique({
                where: { id: currentUser.id },
            });

            if (!agent) {
                return NextResponse.json(
                    { error: 'Agent not found' },
                    { status: 404 }
                );
            }

            if (currentUser._count.users >= agent.maxUsers) {
                return NextResponse.json(
                    { error: 'Maximum user limit reached' },
                    { status: 400 }
                );
            }
        }

        // Hash password
        const hashedPassword = await hash(password, 10);

        const user = await prisma.user.create({
            data: {
                username,
                password: hashedPassword,
                role: 'user',
                agentId: currentUser.role === 'agent' ? currentUser.id : null,
            },
        });

        // Remove password from response
        const { password: _, ...userWithoutPassword } = user;
        return NextResponse.json(userWithoutPassword);
    } catch (error) {
        console.error('Error creating user:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// PUT /api/users - Update a user
export async function PUT(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const currentUser = await prisma.user.findUnique({
            where: { id: session.user.id },
        });

        if (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'agent')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { id, username, password } = body;

        // Check if user exists and current user has access
        const targetUser = await prisma.user.findUnique({
            where: { id },
        });

        if (!targetUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        if (currentUser.role === 'agent' && targetUser.agentId !== currentUser.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Update user
        const updateData: any = { username };
        if (password) {
            updateData.password = await hash(password, 10);
        }

        const updatedUser = await prisma.user.update({
            where: { id },
            data: updateData,
        });

        // Remove password from response
        const { password: _, ...userWithoutPassword } = updatedUser;
        return NextResponse.json(userWithoutPassword);
    } catch (error) {
        console.error('Error updating user:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// DELETE /api/users - Delete a user
export async function DELETE(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const currentUser = await prisma.user.findUnique({
            where: { id: session.user.id },
        });

        if (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'agent')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { error: 'User ID is required' },
                { status: 400 }
            );
        }

        // Check if user exists and current user has access
        const targetUser = await prisma.user.findUnique({
            where: { id },
        });

        if (!targetUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        if (currentUser.role === 'agent' && targetUser.agentId !== currentUser.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await prisma.user.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting user:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
