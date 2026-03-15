import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, password, role } = body

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Все поля обязательны' },
        { status: 400 }
      )
    }

    // Проверяем, существует ли пользователь
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Пользователь с таким email уже существует' },
        { status: 400 }
      )
    }

    // Хешируем пароль
    const hashedPassword = await bcrypt.hash(password, 10)

    // Создаем пользователя
    const user = await prisma.user.create({
      data: {
        name,
        email,
        role: role || 'TENANT',
        // В реальном приложении нужно добавить модель для хранения паролей
        // или использовать другую систему аутентификации
      },
    })

    // Создаем профиль в зависимости от роли
    if (role === 'LANDLORD') {
      await prisma.landlordProfile.create({
        data: {
          userId: user.id,
        },
      })
    } else {
      await prisma.tenantProfile.create({
        data: {
          userId: user.id,
        },
      })
    }

    return NextResponse.json(
      { message: 'Пользователь успешно зарегистрирован', userId: user.id },
      { status: 201 }
    )
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: 'Ошибка при регистрации' },
      { status: 500 }
    )
  }
}
