'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Search, Star, Shield, MapPin, DollarSign, Home } from 'lucide-react'

interface TenantProfile {
  id: string
  user: {
    name: string | null
    email: string
  }
  occupation: string | null
  company: string | null
  monthlyIncome: number | null
  preferredLocation: string | null
  minPrice: number | null
  maxPrice: number | null
  minRooms: number | null
  maxRooms: number | null
  reliabilityRating: number
  totalReviews: number
  identityVerified: boolean
  incomeVerified: boolean
  isPromoted: boolean
}

export default function TenantsPage() {
  const [tenants, setTenants] = useState<TenantProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchTenants()
  }, [])

  const fetchTenants = async () => {
    try {
      const response = await fetch('/api/landlord/tenants')
      const data = await response.json()
      if (data.tenants) {
        setTenants(data.tenants)
      }
    } catch (error) {
      console.error('Error fetching tenants:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredTenants = tenants.filter(tenant => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      tenant.user.name?.toLowerCase().includes(query) ||
      tenant.occupation?.toLowerCase().includes(query) ||
      tenant.company?.toLowerCase().includes(query) ||
      tenant.preferredLocation?.toLowerCase().includes(query)
    )
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">База арендаторов</h1>
          <p className="text-muted-foreground">
            Найдите подходящих арендаторов для ваших квартир
          </p>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Поиск по имени, профессии, компании, району..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Загрузка...</p>
          </div>
        ) : filteredTenants.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Арендаторы не найдены</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTenants.map((tenant) => (
              <Card key={tenant.id} className={tenant.isPromoted ? 'border-primary border-2' : ''}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl">
                        {tenant.user.name || 'Без имени'}
                      </CardTitle>
                      <CardDescription>{tenant.user.email}</CardDescription>
                    </div>
                    {tenant.isPromoted && (
                      <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">
                        Продвижение
                      </span>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="font-medium">
                      {tenant.reliabilityRating.toFixed(1)}
                    </span>
                    <span className="text-muted-foreground">
                      ({tenant.totalReviews} отзывов)
                    </span>
                  </div>

                  {tenant.occupation && (
                    <div className="text-sm">
                      <span className="text-muted-foreground">Работа: </span>
                      <span className="font-medium">{tenant.occupation}</span>
                      {tenant.company && (
                        <span className="text-muted-foreground"> в {tenant.company}</span>
                      )}
                    </div>
                  )}

                  {tenant.monthlyIncome && (
                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span>
                        Доход: {tenant.monthlyIncome.toLocaleString('ru-RU')} ₽/мес.
                      </span>
                      {tenant.incomeVerified && (
                        <Shield className="h-4 w-4 text-green-500" title="Доход подтверждён" />
                      )}
                    </div>
                  )}

                  {tenant.preferredLocation && (
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        {tenant.preferredLocation}
                      </span>
                    </div>
                  )}

                  {(tenant.minPrice || tenant.maxPrice) && (
                    <div className="flex items-center gap-2 text-sm">
                      <Home className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        Бюджет: {tenant.minPrice?.toLocaleString('ru-RU') || '?'} - {tenant.maxPrice?.toLocaleString('ru-RU') || '?'} ₽
                      </span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 pt-2">
                    {tenant.identityVerified && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                        Личность подтверждена
                      </span>
                    )}
                    {tenant.incomeVerified && (
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        Доход подтверждён
                      </span>
                    )}
                  </div>

                  <Link href={`/dashboard/tenants/${tenant.id}`}>
                    <Button className="w-full" variant="outline">
                      Посмотреть профиль
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
