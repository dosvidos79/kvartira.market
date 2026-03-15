import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { Prisma } from '@prisma/client'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

type MessageWithRelations = Prisma.MessageGetPayload<{
  include: {
    sender: { select: { id: true; name: true; email: true } }
    receiver: { select: { id: true; name: true; email: true } }
  }
}>

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })
    }

    // Получаем все сообщения пользователя
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: session.user.id },
          { receiverId: session.user.id },
        ],
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        receiver: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    // Группируем по собеседникам
    const conversationsMap = new Map<string, {
      userId: string
      userName: string | null
      userEmail: string
      lastMessage: string
      lastMessageTime: string
      unreadCount: number
    }>()

    messages.forEach((message: MessageWithRelations) => {
      const otherUser = message.senderId === session.user.id
        ? message.receiver
        : message.sender

      if (!conversationsMap.has(otherUser.id)) {
        conversationsMap.set(otherUser.id, {
          userId: otherUser.id,
          userName: otherUser.name,
          userEmail: otherUser.email,
          lastMessage: message.content,
          lastMessageTime: message.createdAt.toISOString(),
          unreadCount: message.receiverId === session.user.id && !message.isRead ? 1 : 0,
        })
      } else {
        const conv = conversationsMap.get(otherUser.id)!
        if (message.receiverId === session.user.id && !message.isRead) {
          conv.unreadCount++
        }
      }
    })

    const conversations = Array.from(conversationsMap.values())
      .sort((a, b) => new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime())

    return NextResponse.json({ conversations })
  } catch (error) {
    console.error('Error fetching conversations:', error)
    return NextResponse.json(
      { error: 'Ошибка при загрузке бесед' },
      { status: 500 }
    )
  }
}
