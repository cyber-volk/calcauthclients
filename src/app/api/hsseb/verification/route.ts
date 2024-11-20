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
    const { sessionId, status, agentNotes, userNotes, difference, formIds } = data;

    // Create verification
    const verification = await prisma.hssebVerification.create({
      data: {
        sessionId,
        status,
        agentNotes,
        userNotes,
        difference,
      }
    });

    // Update forms with verification ID
    if (formIds && formIds.length > 0) {
      await prisma.form.updateMany({
        where: {
          id: {
            in: formIds
          }
        },
        data: {
          verificationId: verification.id
        }
      });
    }

    return NextResponse.json(verification);
  } catch (error) {
    console.error('Error in verification POST:', error);
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
    const { id, status, agentNotes, userNotes, resolution } = data;

    const verification = await prisma.hssebVerification.update({
      where: { id },
      data: {
        status,
        agentNotes,
        userNotes,
        resolution
      },
      include: {
        forms: true
      }
    });

    return NextResponse.json(verification);
  } catch (error) {
    console.error('Error in verification PUT:', error);
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
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return new NextResponse('Session ID required', { status: 400 });
    }

    const verifications = await prisma.hssebVerification.findMany({
      where: {
        sessionId
      },
      include: {
        forms: {
          include: {
            creditRows: true,
            creditPayeeRows: true,
            depenseRows: true,
            retraitRows: true
          }
        }
      },
      orderBy: {
        date: 'desc'
      }
    });

    return NextResponse.json(verifications);
  } catch (error) {
    console.error('Error in verification GET:', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}
