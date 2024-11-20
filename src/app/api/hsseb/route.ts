import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const data = await req.json();
    const { userId, startDate, endDate, name } = data;

    // Only agents can create hsseb sessions
    const agent = await prisma.agent.findFirst({
      where: {
        username: session.user.name
      }
    });

    if (!agent) {
      return new NextResponse('Unauthorized - Agent only', { status: 401 });
    }

    const hssebSession = await prisma.hssebSession.create({
      data: {
        name,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        agentId: agent.id,
        userId,
        status: 'active'
      },
      include: {
        forms: true,
        verifications: true
      }
    });

    return NextResponse.json(hssebSession);
  } catch (error) {
    console.error('Error in hsseb POST:', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const userId = searchParams.get('userId');

    let where: any = {};
    
    // If status is provided, filter by it
    if (status) {
      where.status = status;
    }

    // If userId is provided, filter by it
    if (userId) {
      where.userId = userId;
    }

    // Find the user/agent
    const user = await prisma.user.findFirst({
      where: {
        username: session.user.name
      }
    });

    if (!user) {
      return new NextResponse('User not found', { status: 404 });
    }

    // If user is an agent, get all their sessions
    if (user.role === 'agent') {
      where.agentId = user.id;
    } else {
      // If user is a regular user, only get their sessions
      where.userId = user.id;
    }

    const hssebSessions = await prisma.hssebSession.findMany({
      where,
      include: {
        forms: {
          include: {
            creditRows: true,
            creditPayeeRows: true,
            depenseRows: true,
            retraitRows: true
          }
        },
        verifications: true,
        user: {
          select: {
            username: true,
            id: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(hssebSessions);
  } catch (error) {
    console.error('Error in hsseb GET:', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const data = await req.json();
    const { id, status, finalResult, notes } = data;

    const updatedSession = await prisma.hssebSession.update({
      where: { id },
      data: {
        status,
        finalResult,
        notes,
        endDate: status === 'completed' ? new Date() : undefined
      },
      include: {
        forms: true,
        verifications: true
      }
    });

    return NextResponse.json(updatedSession);
  } catch (error) {
    console.error('Error in hsseb PUT:', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}
