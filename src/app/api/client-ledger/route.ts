import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { checkClientVerification, createVerificationNotification } from '@/lib/client-verification';

// Helper function to check if verification is needed
async function checkVerificationNeeded(
  client: any,
  ledger: any,
  entries: { type: string; amount: number }[]
) {
  if (!client.isVIP) return false;

  // Check if it's been too long since last verification
  if (client.verificationFrequency) {
    const lastVerification = client.lastVerificationDate;
    if (lastVerification) {
      const daysSinceVerification = Math.floor(
        (Date.now() - new Date(lastVerification).getTime()) / (1000 * 60 * 60 * 24)
      );
      if (daysSinceVerification >= client.verificationFrequency) {
        return true;
      }
    }
  }

  // Check for large withdrawals
  const totalWithdrawal = entries
    .filter(e => e.type === 'payee')
    .reduce((sum, e) => sum + e.amount, 0);

  if (totalWithdrawal > ledger.totalCredit * 0.7) {
    return true;
  }

  return false;
}

// Helper function to create notifications
async function createNotification(
  clientId: string,
  type: 'balance_alert' | 'verification_needed' | 'withdrawal_large',
  message: string
) {
  await prisma.clientNotification.create({
    data: {
      clientId,
      type,
      message,
      status: 'unread'
    }
  });
}

// Create or update ledger entry when a session is completed
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const data = await req.json();
    const { clientId, sessionId, entries } = data;

    // Check if verification is required
    const verificationCheck = await checkClientVerification({
      clientId,
      type: entries[0].type,
      amount: entries[0].amount,
      sessionId
    });

    if (verificationCheck.requiresVerification) {
      await createVerificationNotification(clientId, verificationCheck.reason || 'Verification required');
      return NextResponse.json({
        error: 'Verification required before proceeding',
        reason: verificationCheck.reason
      }, { status: 403 });
    }

    // Get client with ledger
    const client = await prisma.client.findUnique({
      where: { id: clientId },
      include: {
        ledger: true
      }
    });

    if (!client) {
      return new NextResponse('Client not found', { status: 404 });
    }

    let ledger = client.ledger;
    if (!ledger) {
      ledger = await prisma.clientLedger.create({
        data: {
          clientId,
          totalCredit: 0,
          totalPayee: 0,
          balance: 0
        }
      });
    }

    // Check if verification is needed
    const verificationNeeded = await checkVerificationNeeded(client, ledger, entries);

    // Process each entry
    const createdEntries = [];
    for (const entry of entries) {
      const { type, amount, notes } = entry;
      
      // Calculate new balances
      const previousBalance = ledger.balance;
      const newBalance = type === 'credit' 
        ? previousBalance + amount 
        : previousBalance - amount;

      // Create ledger entry
      const ledgerEntry = await prisma.clientLedgerEntry.create({
        data: {
          ledgerId: ledger.id,
          sessionId,
          type,
          amount,
          previousBalance,
          newBalance,
          notes
        }
      });

      createdEntries.push(ledgerEntry);

      // Update ledger totals
      if (type === 'credit') {
        ledger.totalCredit += amount;
      } else {
        ledger.totalPayee += amount;
      }
      ledger.balance = newBalance;
    }

    // Update the ledger and client status if needed
    const [updatedLedger, updatedClient] = await Promise.all([
      prisma.clientLedger.update({
        where: { id: ledger.id },
        data: {
          totalCredit: ledger.totalCredit,
          totalPayee: ledger.totalPayee,
          balance: ledger.balance,
          verificationStatus: verificationNeeded ? 'needs_verification' : undefined
        }
      }),
      verificationNeeded
        ? prisma.client.update({
            where: { id: clientId },
            data: { verificationRequired: true }
          })
        : null
    ]);

    // Create notifications if needed
    if (verificationNeeded) {
      await createNotification(
        clientId,
        'verification_needed',
        'Verification required due to large transaction or time since last verification'
      );
    }

    if (ledger.balance > 0) {
      await createNotification(
        clientId,
        'balance_alert',
        `Client has a positive balance of ${ledger.balance.toFixed(2)}`
      );
    }

    return NextResponse.json({
      ledger: updatedLedger,
      entries: createdEntries
    });
  } catch (error) {
    console.error('Error in client-ledger POST:', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}

// Get client ledger with entries
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const clientId = searchParams.get('clientId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    if (!clientId) {
      return new NextResponse('Client ID required', { status: 400 });
    }

    // Get client ledger with enhanced includes
    const ledger = await prisma.clientLedger.findFirst({
      where: { clientId },
      include: {
        entries: {
          where: {
            date: {
              gte: startDate ? new Date(startDate) : undefined,
              lte: endDate ? new Date(endDate) : undefined
            }
          },
          orderBy: {
            date: 'desc'
          },
          include: {
            session: {
              select: {
                name: true,
                status: true
              }
            }
          }
        },
        client: {
          select: {
            name: true,
            status: true,
            isVIP: true,
            verificationRequired: true,
            lastVerificationDate: true,
            verificationFrequency: true
          }
        },
        verificationHistory: {
          orderBy: {
            verifiedAt: 'desc'
          },
          take: 1
        }
      }
    });

    if (!ledger) {
      return new NextResponse('Ledger not found', { status: 404 });
    }

    // Get active notifications
    const notifications = await prisma.clientNotification.findMany({
      where: {
        clientId,
        status: {
          not: 'dismissed'
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({
      ...ledger,
      notifications
    });
  } catch (error) {
    console.error('Error in client-ledger GET:', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}

// Generate summary report for multiple clients
export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const data = await req.json();
    const { clientIds, startDate, endDate } = data;

    const ledgers = await prisma.clientLedger.findMany({
      where: {
        clientId: {
          in: clientIds
        }
      },
      include: {
        entries: {
          where: {
            date: {
              gte: startDate ? new Date(startDate) : undefined,
              lte: endDate ? new Date(endDate) : undefined
            }
          },
          orderBy: {
            date: 'desc'
          }
        },
        client: {
          select: {
            name: true,
            status: true,
            isVIP: true,
            verificationRequired: true,
            lastVerificationDate: true,
            verificationFrequency: true
          }
        }
      }
    });

    // Calculate summaries
    const summaries = ledgers.map(ledger => ({
      clientName: ledger.client.name,
      clientStatus: ledger.client.status,
      totalCredit: ledger.totalCredit,
      totalPayee: ledger.totalPayee,
      currentBalance: ledger.balance,
      periodCredit: ledger.entries
        .filter(e => e.type === 'credit')
        .reduce((sum, e) => sum + e.amount, 0),
      periodPayee: ledger.entries
        .filter(e => e.type === 'payee')
        .reduce((sum, e) => sum + e.amount, 0),
      lastTransaction: ledger.entries[0]?.date || null,
      verificationRequired: ledger.client.verificationRequired,
      verificationFrequency: ledger.client.verificationFrequency,
      lastVerificationDate: ledger.client.lastVerificationDate
    }));

    return NextResponse.json(summaries);
  } catch (error) {
    console.error('Error in client-ledger PUT:', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}
