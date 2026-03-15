'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Check, CreditCard } from 'lucide-react'

interface Subscription {
  plan: string
  status: string
  currentPeriodEnd: string | null
}

export default function SubscriptionPage() {
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSubscription()
  }, [])

  const fetchSubscription = async () => {
    try {
      const response = await fetch('/api/subscription')
      const data = await response.json()
      if (data.subscription) {
        setSubscription(data.subscription)
      }
    } catch (error) {
      console.error('Error fetching subscription:', error)
    } finally {
      setLoading(false)
    }
  }

  const plans = [
    {
      id: 'FREE',
      name: 'Бесплатный',
      price: 0,
      features: [
        'Просмотр до 10 профилей в месяц',
        'Базовый поиск',
      ],
    },
    {
      id: 'BASIC',
      name: 'Базовый',
      price: 990,
      features: [
        'Неограниченный просмотр профилей',
        'Расширенный поиск',
        'Приоритетная поддержка',
      ],
    },
    {
      id: 'PREMIUM',
      name: 'Премиум',
      price: 1990,
      features: [
        'Все возможности Базового',
        'Ранний доступ к новым профилям',
        'Аналитика и статистика',
        'Персональный менеджер',
      ],
    },
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-muted-foreground">Загрузка...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Подписка</h1>

        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Текущая подписка</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">
                    {subscription?.plan === 'FREE' ? 'Бесплатный' :
                     subscription?.plan === 'BASIC' ? 'Базовый' :
                     subscription?.plan === 'PREMIUM' ? 'Премиум' : 'Неизвестно'}
                  </p>
                  {subscription?.currentPeriodEnd && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Действует до: {new Date(subscription.currentPeriodEnd).toLocaleDateString('ru-RU')}
                    </p>
                  )}
                </div>
                <Button variant="outline">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Управление
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4">Доступные тарифы</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <Card
                key={plan.id}
                className={subscription?.plan === plan.id ? 'border-primary border-2' : ''}
              >
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-3xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground"> ₽/мес.</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-6">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  {subscription?.plan === plan.id ? (
                    <Button className="w-full" disabled>
                      Текущий тариф
                    </Button>
                  ) : (
                    <Button className="w-full" variant="outline">
                      Выбрать тариф
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
