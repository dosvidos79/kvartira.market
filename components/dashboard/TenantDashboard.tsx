'use client'

import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { User, Edit, Star, MessageSquare, Shield, TrendingUp } from 'lucide-react'

export default function TenantDashboard() {
  const { data: session } = useSession()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-primary">
            Квартира.Market
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              {session?.user?.email}
            </span>
            <Button variant="ghost" size="sm" onClick={() => signOut()}>
              Выйти
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Мой профиль арендатора</h1>
          <p className="text-muted-foreground">
            Управляйте своим профилем и получайте предложения от собственников
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                <CardTitle>Профиль</CardTitle>
              </div>
              <CardDescription>Заполненность профиля: 60%</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/dashboard/profile">
                <Button className="w-full" variant="outline">
                  Редактировать профиль
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                <CardTitle>Верификация</CardTitle>
              </div>
              <CardDescription>Статус: Не верифицирован</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="outline">
                Пройти верификацию
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-primary" />
                <CardTitle>Рейтинг</CardTitle>
              </div>
              <CardDescription>Рейтинг надёжности: 0.0</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Пока нет отзывов
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                <CardTitle>Сообщения</CardTitle>
              </div>
              <CardDescription>Новых сообщений: 0</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/dashboard/messages">
                <Button className="w-full" variant="outline">
                  Открыть чат
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <CardTitle>Предложения</CardTitle>
              </div>
              <CardDescription>Активных предложений: 0</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/dashboard/offers">
                <Button className="w-full" variant="outline">
                  Посмотреть предложения
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
