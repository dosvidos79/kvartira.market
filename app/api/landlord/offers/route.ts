import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
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

    const body = await request.json()
    const { propertyId, receiverId, message } = body

    if (!propertyId || !receiverId) {
      return NextResponse.json(
        { error: 'propertyId и receiverId обязательны' },
        { status: 400 }
      )
    }

    // Проверяем, что собственник владеет этой квартирой
    const landlord = await prisma.landlordProfile.findUnique({
      where: { userId: session.user.id },
    })

    if (!landlord) {
      return NextResponse.json(
        { error: 'Профиль собственника не найден' },
        { status: 404 }
      )
    }

    const property = await prisma.property.findFirst({
      where: {
        id: propertyId,
        landlordId: landlord.id,
      },
    })

    if (!property) {
      return NextResponse.json(
        { error: 'Квартира не найдена' },
        { status: 404 }
      )
    }

    // Получаем профиль арендатора
    const tenantProfile = await prisma.tenantProfile.findUnique({
      where: { userId: receiverId },
    })

    if (!tenantProfile) {
      return NextResponse.json(
        { error: 'Профиль арендатора не найден' },
        { status: 404 }
      )
    }

    // Создаём предложение
    const offer = await prisma.offer.create({
      data: {
        propertyId,
        senderId: session.user.id,
        receiverId,
        tenantProfileId: tenantProfile.id,
        message: message || null,
      },
    })

    return NextResponse.json({ offer })
  } catch (error) {
    console.error('Error creating offer:', error)
    return NextResponse.json(
      { error: 'Ошибка при создании предложения' },
      { status: 500 }
    )
  }
}
