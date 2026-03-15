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
      return NextResponse.json({ properties: [] })
    }

    const properties = await prisma.property.findMany({
      where: {
        landlordId: landlord.id,
        isActive: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({ properties })
  } catch (error) {
    console.error('Error fetching properties:', error)
    return NextResponse.json(
      { error: 'Ошибка при загрузке квартир' },
      { status: 500 }
    )
  }
}

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
    const { title, description, address, city, district, metro, price, rooms, area, floor, totalFloors } = body

    if (!title || !address || !city || !price || !rooms) {
      return NextResponse.json(
        { error: 'Заполните все обязательные поля' },
        { status: 400 }
      )
    }

    let landlord = await prisma.landlordProfile.findUnique({
      where: { userId: session.user.id },
    })

    if (!landlord) {
      // Создаём профиль собственника, если его нет
      landlord = await prisma.landlordProfile.create({
        data: {
          userId: session.user.id,
        },
      })
    }

    const property = await prisma.property.create({
      data: {
        landlordId: landlord.id,
        title,
        description: description || null,
        address,
        city,
        district: district || null,
        metro: metro || null,
        price: parseInt(price),
        rooms: parseInt(rooms),
        area: area ? parseFloat(area) : null,
        floor: floor ? parseInt(floor) : null,
        totalFloors: totalFloors ? parseInt(totalFloors) : null,
        photos: [],
      },
    })

    return NextResponse.json({ property })
  } catch (error) {
    console.error('Error creating property:', error)
    return NextResponse.json(
      { error: 'Ошибка при создании квартиры' },
      { status: 500 }
    )
  }
}
