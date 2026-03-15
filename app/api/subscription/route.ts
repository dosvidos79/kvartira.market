import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })
    }

    if (session.user.role !== 'LANDLORD') {
      return NextResponse.json(
        { error: 'Доступ запрещён' },
        { status: 403 }
      )
    }

    const landlord = await prisma.landlordProfile.findUnique({
      where: { userId: session.user.id },
    })

    if (!landlord) {
      return NextResponse.json({ subscription: null })
    }

    const subscription = await prisma.subscription.findFirst({
      where: {
        userId: session.user.id,
        landlordId: landlord.id,
        status: 'active',
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    // Если подписки нет, возвращаем бесплатный тариф
    if (!subscription) {
      return NextResponse.json({
        subscription: {
          plan: 'FREE',
          status: 'active',
          currentPeriodEnd: null,
        },
      })
    }

    return NextResponse.json({
      subscription: {
        plan: subscription.plan,
        status: subscription.status,
        currentPeriodEnd: subscription.currentPeriodEnd.toISOString(),
      },
    })
  } catch (error) {
    console.error('Error fetching subscription:', error)
    return NextResponse.json(
      { error: 'Ошибка при загрузке подписки' },
      { status: 500 }
    )
  }
}
