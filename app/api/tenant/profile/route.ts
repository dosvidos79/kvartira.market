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

    const profile = await prisma.tenantProfile.findUnique({
      where: { userId: session.user.id },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            image: true,
          },
        },
      },
    })

    if (!profile) {
      return NextResponse.json({ error: 'Профиль не найден' }, { status: 404 })
    }

    return NextResponse.json({ profile })
  } catch (error) {
    console.error('Error fetching profile:', error)
    return NextResponse.json(
      { error: 'Ошибка при загрузке профиля' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })
    }

    const body = await request.json()

    const profile = await prisma.tenantProfile.update({
      where: { userId: session.user.id },
      data: {
        phone: body.phone,
        about: body.about,
        occupation: body.occupation,
        company: body.company,
        monthlyIncome: body.monthlyIncome,
        preferredLocation: body.preferredLocation,
        minPrice: body.minPrice,
        maxPrice: body.maxPrice,
        minRooms: body.minRooms,
        maxRooms: body.maxRooms,
        hasPets: body.hasPets,
        petsDescription: body.petsDescription,
        smoking: body.smoking,
        children: body.children,
        additionalPreferences: body.additionalPreferences,
      },
    })

    return NextResponse.json({ profile })
  } catch (error) {
    console.error('Error updating profile:', error)
    return NextResponse.json(
      { error: 'Ошибка при обновлении профиля' },
      { status: 500 }
    )
  }
}
