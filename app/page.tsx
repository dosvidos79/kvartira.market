import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle2, Shield, MessageSquare, Star, Users, TrendingUp } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-primary">
            Квартира.Market
          </Link>
          <nav className="flex gap-4">
            <Link href="/auth/signin">
              <Button variant="ghost">Войти</Button>
            </Link>
            <Link href="/auth/signup">
              <Button>Регистрация</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-bold mb-6">
          Маркетплейс проверенных арендаторов
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Собственники находят идеальных жильцов. Арендаторы создают профили-резюме 
          и получают предложения от владельцев квартир.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/auth/signup?role=tenant">
            <Button size="lg">Я ищу квартиру</Button>
          </Link>
          <Link href="/auth/signup?role=landlord">
            <Button size="lg" variant="outline">Я собственник</Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">Как это работает</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <Users className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Профили арендаторов</CardTitle>
              <CardDescription>
                Создайте резюме с фото, работой, доходом и предпочтениями
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Shield className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Верификация</CardTitle>
              <CardDescription>
                Проверка личности и дохода для повышения доверия
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Star className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Рейтинги и отзывы</CardTitle>
              <CardDescription>
                Отзывы от прошлых арендодателей и рейтинг надёжности
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <MessageSquare className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Встроенный чат</CardTitle>
              <CardDescription>
                Общение без раскрытия контактов до начала диалога
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CheckCircle2 className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Безопасность</CardTitle>
              <CardDescription>
                Контакты скрыты, общение только через платформу
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <TrendingUp className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Продвижение</CardTitle>
              <CardDescription>
                Платная верификация и продвижение профиля для арендаторов
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Готовы начать?</h2>
          <p className="text-xl mb-8 opacity-90">
            Присоединяйтесь к платформе уже сегодня
          </p>
          <Link href="/auth/signup">
            <Button size="lg" variant="secondary">
              Создать аккаунт
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2024 Квартира.Market. Все права защищены.</p>
        </div>
      </footer>
    </div>
  )
}
