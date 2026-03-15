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

    // Проверяем, что пользователь - собственник
    if (session.user.role !== 'LANDLORD') {
      return NextResponse.json(
        { error: 'Доступ запрещён' },
        { status: 403 }
      )
    }

    // Проверяем подписку
    const subscription = await prisma.subscription.findFirst({
      where: {
        userId: session.user.id,
        status: 'active',
        currentPeriodEnd: {
          gte: new Date(),
        },
      },
    })

    // Для демо версии разрешаем доступ всем, но в продакшене нужна проверка подписки
    // if (!subscription && subscription?.plan === 'FREE') {
    //   return NextResponse.json(
    //     { error: 'Требуется подписка для доступа к базе арендаторов' },
    //     { status: 403 }
    //   )
    // }

    const tenants = await prisma.tenantProfile.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: [
        { isPromoted: 'desc' },
        { reliabilityRating: 'desc' },
        { createdAt: 'desc' },
      ],
    })

    return NextResponse.json({ tenants })
  } catch (error) {
    console.error('Error fetching tenants:', error)
    return NextResponse.json(
      { error: 'Ошибка при загрузке арендаторов' },
      { status: 500 }
    )
  }
}
