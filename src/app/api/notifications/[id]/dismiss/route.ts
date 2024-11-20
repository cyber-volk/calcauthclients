import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const notification = await prisma.clientNotification.update({
      where: {
        id: params.id
      },
      data: {
        status: 'dismissed',
        readAt: new Date()
      }
    })

    return NextResponse.json({ notification })
  } catch (error) {
    console.error('Error dismissing notification:', error)
    return NextResponse.json(
      { error: 'Failed to dismiss notification' },
      { status: 500 }
    )
  }
}
