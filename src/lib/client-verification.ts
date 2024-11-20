import { prisma } from './prisma'

interface TransactionData {
  clientId: string
  type: 'credit' | 'payee'
  amount: number
  sessionId?: string
}

interface VerificationResult {
  requiresVerification: boolean
  reason?: string
}

export async function checkClientVerification(
  transaction: TransactionData
): Promise<VerificationResult> {
  const client = await prisma.client.findUnique({
    where: { id: transaction.clientId },
    include: {
      ledger: true,
      notifications: {
        where: {
          type: 'verification_needed',
          status: { not: 'dismissed' }
        }
      }
    }
  })

  if (!client) {
    throw new Error('Client not found')
  }

  // If client is not VIP, no verification needed
  if (!client.isVIP) {
    return { requiresVerification: false }
  }

  // Check if there's already a pending verification
  if (client.verificationRequired) {
    return {
      requiresVerification: true,
      reason: 'Previous verification still pending'
    }
  }

  // Check time-based verification requirement
  if (client.verificationFrequency) {
    const lastVerification = client.lastVerificationDate
    if (lastVerification) {
      const daysSinceVerification = Math.floor(
        (Date.now() - new Date(lastVerification).getTime()) / (1000 * 60 * 60 * 24)
      )
      if (daysSinceVerification >= client.verificationFrequency) {
        return {
          requiresVerification: true,
          reason: `Time-based verification required (${daysSinceVerification} days since last verification)`
        }
      }
    }
  }

  // Check for large withdrawals
  if (transaction.type === 'payee' && client.ledger) {
    const withdrawalRatio = transaction.amount / client.ledger.totalCredit
    if (withdrawalRatio > 0.7) {
      return {
        requiresVerification: true,
        reason: `Large withdrawal detected (${Math.round(withdrawalRatio * 100)}% of total credit)`
      }
    }
  }

  return { requiresVerification: false }
}

export async function createVerificationNotification(
  clientId: string,
  reason: string
) {
  return prisma.clientNotification.create({
    data: {
      clientId,
      type: 'verification_needed',
      message: `Verification required: ${reason}`,
      status: 'unread'
    }
  })
}

export async function verifyClientBalance(
  clientId: string,
  verifiedBy: string,
  notes?: string
) {
  return prisma.$transaction(async (tx) => {
    const client = await tx.client.findUnique({
      where: { id: clientId },
      include: { ledger: true }
    })

    if (!client || !client.ledger) {
      throw new Error('Client or ledger not found')
    }

    // Create verification record
    const verification = await tx.clientLedgerVerification.create({
      data: {
        ledgerId: client.ledger.id,
        verifiedBy,
        previousBalance: client.ledger.balance,
        verifiedBalance: client.ledger.balance,
        status: 'verified',
        notes
      }
    })

    // Update client and ledger status
    const [updatedClient, updatedLedger] = await Promise.all([
      tx.client.update({
        where: { id: clientId },
        data: {
          verificationRequired: false,
          lastVerificationDate: new Date()
        }
      }),
      tx.clientLedger.update({
        where: { id: client.ledger.id },
        data: {
          lastVerificationDate: new Date(),
          verificationStatus: 'verified'
        }
      })
    ])

    // Mark existing verification notifications as read
    await tx.clientNotification.updateMany({
      where: {
        clientId,
        type: 'verification_needed',
        status: 'unread'
      },
      data: {
        status: 'read',
        readAt: new Date()
      }
    })

    return {
      verification,
      client: updatedClient,
      ledger: updatedLedger
    }
  })
}

export async function flagClientForVerification(
  clientId: string,
  reason: string
) {
  return prisma.$transaction(async (tx) => {
    const [updatedClient, notification] = await Promise.all([
      tx.client.update({
        where: { id: clientId },
        data: { verificationRequired: true }
      }),
      tx.clientNotification.create({
        data: {
          clientId,
          type: 'verification_needed',
          message: reason,
          status: 'unread'
        }
      })
    ])

    if (updatedClient.ledger) {
      await tx.clientLedger.update({
        where: { id: updatedClient.ledger.id },
        data: { verificationStatus: 'needs_verification' }
      })
    }

    return { client: updatedClient, notification }
  })
}
