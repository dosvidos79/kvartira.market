import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })
    }

    if (session.user.role !== 'TENANT') {
      return NextResponse.json(
        { error: 'Доступ запрещён' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { status } = body

    if (!['accepted', 'rejected'].includes(status)) {
      return NextResponse.json(
        { error: 'Неверный статус' },
        { status: 400 }
      )
    }

    // Проверяем, что предложение принадлежит пользователю
    const offer = await prisma.offer.findUnique({
      where: { id: params.id },
    })

    if (!offer) {
      return NextResponse.json(
        { error: 'Предложение не найдено' },
        { status: 404 }
      )
    }

    if (offer.receiverId !== session.user.id) {
      return NextResponse.json(
        { error: 'Доступ запрещён' },
        { status: 403 }
      )
    }

    const updatedOffer = await prisma.offer.update({
      where: { id: params.id },
      data: { status },
    })

    return NextResponse.json({ offer: updatedOffer })
  } catch (error) {
    console.error('Error updating offer:', error)
    return NextResponse.json(
      { error: 'Ошибка при обновлении предложения' },
      { status: 500 }
    )
  }
}
