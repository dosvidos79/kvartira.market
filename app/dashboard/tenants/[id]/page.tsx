'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Star, Shield, MapPin, DollarSign, Home, MessageSquare, ArrowLeft } from 'lucide-react'

interface TenantProfile {
  id: string
  user: {
    name: string | null
    email: string
  }
  phone: string | null
  about: string | null
  occupation: string | null
  company: string | null
  monthlyIncome: number | null
  preferredLocation: string | null
  minPrice: number | null
  maxPrice: number | null
  minRooms: number | null
  maxRooms: number | null
  hasPets: boolean
  petsDescription: string | null
  smoking: boolean
  children: boolean
  additionalPreferences: string | null
  reliabilityRating: number
  totalReviews: number
  identityVerified: boolean
  incomeVerified: boolean
}

export default function TenantProfilePage() {
  const params = useParams()
  const router = useRouter()
  const [profile, setProfile] = useState<TenantProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      fetchProfile(params.id as string)
    }
  }, [params.id])

  const fetchProfile = async (id: string) => {
    try {
      const response = await fetch(`/api/landlord/tenants/${id}`)
      const data = await response.json()
      if (data.profile) {
        setProfile(data.profile)
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSendOffer = () => {
    router.push(`/dashboard/tenants/${params.id}/offer`)
  }

  const handleStartChat = () => {
    router.push(`/dashboard/messages?userId=${params.id}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-muted-foreground">Загрузка...</p>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Профиль не найден</p>
          <Link href="/dashboard/tenants">
            <Button variant="outline">Вернуться к списку</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <Link href="/dashboard/tenants">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Назад к списку
          </Button>
        </Link>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            {/* Основная информация */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">
                  {profile.user.name || 'Без имени'}
                </CardTitle>
                <CardDescription>{profile.user.email}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {profile.about && (
                  <div>
                    <h3 className="font-semibold mb-2">О себе</h3>
                    <p className="text-muted-foreground">{profile.about}</p>
                  </div>
                )}

                {profile.phone && (
                  <div>
                    <h3 className="font-semibold mb-2">Телефон</h3>
                    <p className="text-muted-foreground">{profile.phone}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Работа и доход */}
            <Card>
              <CardHeader>
                <CardTitle>Работа и доход</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {profile.occupation && (
                  <div>
                    <span className="text-muted-foreground">Должность: </span>
                    <span className="font-medium">{profile.occupation}</span>
                  </div>
                )}
                {profile.company && (
                  <div>
                    <span className="text-muted-foreground">Компания: </span>
                    <span className="font-medium">{profile.company}</span>
                  </div>
                )}
                {profile.monthlyIncome && (
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Доход: </span>
                    <span className="font-medium">
                      {profile.monthlyIncome.toLocaleString('ru-RU')} ₽/мес.
                    </span>
                    {profile.incomeVerified && (
                      <Shield className="h-4 w-4 text-green-500" title="Доход подтверждён" />
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Предпочтения */}
            <Card>
              <CardHeader>
                <CardTitle>Предпочтения по квартире</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {profile.preferredLocation && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Район: </span>
                    <span className="font-medium">{profile.preferredLocation}</span>
                  </div>
                )}

                {(profile.minPrice || profile.maxPrice) && (
                  <div className="flex items-center gap-2">
                    <Home className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Бюджет: </span>
                    <span className="font-medium">
                      {profile.minPrice?.toLocaleString('ru-RU') || '?'} - {profile.maxPrice?.toLocaleString('ru-RU') || '?'} ₽/мес.
                    </span>
                  </div>
                )}

                {(profile.minRooms || profile.maxRooms) && (
                  <div>
                    <span className="text-muted-foreground">Комнат: </span>
                    <span className="font-medium">
                      {profile.minRooms || '?'} - {profile.maxRooms || '?'}
                    </span>
                  </div>
                )}

                <div className="space-y-2">
                  {profile.hasPets && (
                    <div>
                      <span className="text-muted-foreground">Домашние животные: </span>
                      <span className="font-medium">Да</span>
                      {profile.petsDescription && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {profile.petsDescription}
                        </p>
                      )}
                    </div>
                  )}
                  {profile.smoking && (
                    <div>
                      <span className="text-muted-foreground">Курение: </span>
                      <span className="font-medium">Да</span>
                    </div>
                  )}
                  {profile.children && (
                    <div>
                      <span className="text-muted-foreground">Дети: </span>
                      <span className="font-medium">Да</span>
                    </div>
                  )}
                </div>

                {profile.additionalPreferences && (
                  <div>
                    <h3 className="font-semibold mb-2">Дополнительные предпочтения</h3>
                    <p className="text-muted-foreground">{profile.additionalPreferences}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Боковая панель */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Рейтинг и верификация</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  <div>
                    <div className="font-semibold text-xl">
                      {profile.reliabilityRating.toFixed(1)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {profile.totalReviews} отзывов
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  {profile.identityVerified && (
                    <div className="flex items-center gap-2 text-sm">
                      <Shield className="h-4 w-4 text-green-500" />
                      <span>Личность подтверждена</span>
                    </div>
                  )}
                  {profile.incomeVerified && (
                    <div className="flex items-center gap-2 text-sm">
                      <Shield className="h-4 w-4 text-green-500" />
                      <span>Доход подтверждён</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Действия</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full" onClick={handleSendOffer}>
                  Предложить квартиру
                </Button>
                <Button className="w-full" variant="outline" onClick={handleStartChat}>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Написать сообщение
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
