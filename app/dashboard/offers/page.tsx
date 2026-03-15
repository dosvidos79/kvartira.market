'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Home, User, Calendar, CheckCircle2, XCircle, Clock } from 'lucide-react'

interface Offer {
  id: string
  property: {
    title: string
    address: string
    price: number
    rooms: number
  }
  sender: {
    name: string | null
    email: string
  }
  message: string | null
  status: string
  createdAt: string
}

export default function OffersPage() {
  const [offers, setOffers] = useState<Offer[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOffers()
  }, [])

  const fetchOffers = async () => {
    try {
      const response = await fetch('/api/tenant/offers')
      const data = await response.json()
      if (data.offers) {
        setOffers(data.offers)
      }
    } catch (error) {
      console.error('Error fetching offers:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAccept = async (offerId: string) => {
    try {
      const response = await fetch(`/api/tenant/offers/${offerId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'accepted' }),
      })

      if (response.ok) {
        fetchOffers()
      }
    } catch (error) {
      console.error('Error accepting offer:', error)
    }
  }

  const handleReject = async (offerId: string) => {
    try {
      const response = await fetch(`/api/tenant/offers/${offerId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'rejected' }),
      })

      if (response.ok) {
        fetchOffers()
      }
    } catch (error) {
      console.error('Error rejecting offer:', error)
    }
  }

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
        <h1 className="text-3xl font-bold mb-6">Предложения квартир</h1>

        {offers.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Home className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">
                У вас пока нет предложений от собственников
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {offers.map((offer) => (
              <Card key={offer.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl">{offer.property.title}</CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-2">
                        <Home className="h-4 w-4" />
                        {offer.property.address}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      {offer.status === 'pending' && (
                        <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Ожидает ответа
                        </span>
                      )}
                      {offer.status === 'accepted' && (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" />
                          Принято
                        </span>
                      )}
                      {offer.status === 'rejected' && (
                        <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded flex items-center gap-1">
                          <XCircle className="h-3 w-3" />
                          Отклонено
                        </span>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Цена</p>
                      <p className="font-semibold text-lg">
                        {offer.property.price.toLocaleString('ru-RU')} ₽/мес.
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Комнат</p>
                      <p className="font-semibold">{offer.property.rooms}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-1">От собственника</p>
                    <p className="font-medium">
                      {offer.sender.name || offer.sender.email}
                    </p>
                  </div>

                  {offer.message && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Сообщение</p>
                      <p className="text-sm">{offer.message}</p>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>
                      Получено: {new Date(offer.createdAt).toLocaleDateString('ru-RU')}
                    </span>
                  </div>

                  {offer.status === 'pending' && (
                    <div className="flex gap-2 pt-2">
                      <Button
                        onClick={() => handleAccept(offer.id)}
                        className="flex-1"
                      >
                        Принять предложение
                      </Button>
                      <Button
                        onClick={() => handleReject(offer.id)}
                        variant="outline"
                        className="flex-1"
                      >
                        Отклонить
                      </Button>
                    </div>
                  )}

                  {offer.status === 'accepted' && (
                    <div className="pt-2">
                      <Link href="/dashboard/messages">
                        <Button className="w-full" variant="outline">
                          Написать собственнику
                        </Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
