import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Start a transaction to ensure data consistency
    const result = await prisma.$transaction(async (tx) => {
      // Get the client's ledger
      const ledger = await tx.clientLedger.findFirst({
        where: {
          clientId: params.id
        },
        include: {
          client: true
        }
      })

      if (!ledger) {
        throw new Error('Ledger not found')
      }

      // Create verification record
      const verification = await tx.clientLedgerVerification.create({
        data: {
          ledgerId: ledger.id,
          verifiedBy: 'system', // TODO: Replace with actual user ID
          previousBalance: ledger.balance,
          verifiedBalance: ledger.balance,
          status: 'verified'
        }
      })

      // Update the ledger
      const updatedLedger = await tx.clientLedger.update({
        where: {
          id: ledger.id
        },
        data: {
          lastVerificationDate: new Date(),
          verificationStatus: 'verified'
        }
      })

      // Update client verification status
      await tx.client.update({
        where: {
          id: params.id
        },
        data: {
          verificationRequired: false,
          lastVerificationDate: new Date()
        }
      })

      return { verification, ledger: updatedLedger }
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error verifying client:', error)
    return NextResponse.json(
      { error: 'Failed to verify client' },
      { status: 500 }
    )
  }
}
