import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const clientId = searchParams.get('clientId')

    const notifications = await prisma.clientNotification.findMany({
      where: {
        clientId: clientId || undefined,
        status: {
          not: 'dismissed'
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({ notifications })
  } catch (error) {
    console.error('Error fetching notifications:', error)
    return NextResponse.json(
      { error: 'Failed to fetch notifications' },
      { status: 500 }
    )
  }
}

// Create notification
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { clientId, type, message } = body

    const notification = await prisma.clientNotification.create({
      data: {
        clientId,
        type,
        message,
        status: 'unread'
      }
    })

    return NextResponse.json({ notification })
  } catch (error) {
    console.error('Error creating notification:', error)
    return NextResponse.json(
      { error: 'Failed to create notification' },
      { status: 500 }
    )
  }
}
