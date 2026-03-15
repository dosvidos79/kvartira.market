'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft } from 'lucide-react'

interface Property {
  id: string
  title: string
  address: string
  price: number
  rooms: number
}

export default function CreateOfferPage() {
  const params = useParams()
  const router = useRouter()
  const [properties, setProperties] = useState<Property[]>([])
  const [selectedPropertyId, setSelectedPropertyId] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchProperties()
  }, [])

  const fetchProperties = async () => {
    try {
      const response = await fetch('/api/landlord/properties')
      const data = await response.json()
      if (data.properties) {
        setProperties(data.properties)
        if (data.properties.length > 0) {
          setSelectedPropertyId(data.properties[0].id)
        }
      }
    } catch (error) {
      console.error('Error fetching properties:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedPropertyId) return

    setLoading(true)
    try {
      const response = await fetch('/api/landlord/offers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertyId: selectedPropertyId,
          receiverId: params.id,
          message: message || undefined,
        }),
      })

      if (response.ok) {
        router.push('/dashboard/tenants')
      }
    } catch (error) {
      console.error('Error creating offer:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <Link href={`/dashboard/tenants/${params.id}`}>
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Назад
          </Button>
        </Link>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Предложить квартиру</CardTitle>
            <CardDescription>
              Выберите квартиру и отправьте предложение арендатору
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="property">Выберите квартиру</Label>
                {properties.length === 0 ? (
                  <div className="p-4 border rounded-md bg-muted">
                    <p className="text-sm text-muted-foreground mb-2">
                      У вас нет добавленных квартир
                    </p>
                    <Link href="/dashboard/properties/new">
                      <Button variant="outline" size="sm">
                        Добавить квартиру
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <select
                    id="property"
                    value={selectedPropertyId}
                    onChange={(e) => setSelectedPropertyId(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    required
                  >
                    {properties.map((property) => (
                      <option key={property.id} value={property.id}>
                        {property.title} - {property.address} ({property.price.toLocaleString('ru-RU')} ₽/мес.)
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Сообщение (необязательно)</Label>
                <Textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={5}
                  placeholder="Напишите персональное сообщение арендатору..."
                />
              </div>

              <div className="flex justify-end gap-4">
                <Link href={`/dashboard/tenants/${params.id}`}>
                  <Button type="button" variant="outline">
                    Отмена
                  </Button>
                </Link>
                <Button type="submit" disabled={loading || !selectedPropertyId}>
                  {loading ? 'Отправка...' : 'Отправить предложение'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
