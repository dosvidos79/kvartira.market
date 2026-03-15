'use client'

import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Search, Users, MessageSquare, CreditCard, Plus } from 'lucide-react'

export default function LandlordDashboard() {
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
          <h1 className="text-3xl font-bold mb-2">Панель собственника</h1>
          <p className="text-muted-foreground">
            Найдите идеальных арендаторов для ваших квартир
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Search className="h-5 w-5 text-primary" />
                <CardTitle>Поиск</CardTitle>
              </div>
              <CardDescription>Найти арендаторов</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/dashboard/tenants">
                <Button className="w-full">
                  Открыть базу
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <CardTitle>Арендаторы</CardTitle>
              </div>
              <CardDescription>Просмотрено: 0</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Начните поиск
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                <CardTitle>Сообщения</CardTitle>
              </div>
              <CardDescription>Новых: 0</CardDescription>
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
                <CreditCard className="h-5 w-5 text-primary" />
                <CardTitle>Подписка</CardTitle>
              </div>
              <CardDescription>Тариф: Бесплатный</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/dashboard/subscription">
                <Button className="w-full" variant="outline">
                  Управление
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Мои квартиры</CardTitle>
                <CardDescription>Управляйте объектами недвижимости</CardDescription>
              </div>
              <Link href="/dashboard/properties/new">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Добавить квартиру
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              У вас пока нет добавленных квартир
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
