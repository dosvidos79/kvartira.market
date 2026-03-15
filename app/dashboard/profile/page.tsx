'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Save } from 'lucide-react'

export default function ProfilePage() {
  const { data: session } = useSession()
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [formData, setFormData] = useState({
    phone: '',
    about: '',
    occupation: '',
    company: '',
    monthlyIncome: '',
    preferredLocation: '',
    minPrice: '',
    maxPrice: '',
    minRooms: '',
    maxRooms: '',
    hasPets: false,
    petsDescription: '',
    smoking: false,
    children: false,
    additionalPreferences: '',
  })

  useEffect(() => {
    // Загрузить существующий профиль
    fetch('/api/tenant/profile')
      .then(res => res.json())
      .then(data => {
        if (data.profile) {
          setFormData({
            phone: data.profile.phone || '',
            about: data.profile.about || '',
            occupation: data.profile.occupation || '',
            company: data.profile.company || '',
            monthlyIncome: data.profile.monthlyIncome?.toString() || '',
            preferredLocation: data.profile.preferredLocation || '',
            minPrice: data.profile.minPrice?.toString() || '',
            maxPrice: data.profile.maxPrice?.toString() || '',
            minRooms: data.profile.minRooms?.toString() || '',
            maxRooms: data.profile.maxRooms?.toString() || '',
            hasPets: data.profile.hasPets || false,
            petsDescription: data.profile.petsDescription || '',
            smoking: data.profile.smoking || false,
            children: data.profile.children || false,
            additionalPreferences: data.profile.additionalPreferences || '',
          })
        }
      })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setSaved(false)

    try {
      const response = await fetch('/api/tenant/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          monthlyIncome: formData.monthlyIncome ? parseInt(formData.monthlyIncome) : null,
          minPrice: formData.minPrice ? parseInt(formData.minPrice) : null,
          maxPrice: formData.maxPrice ? parseInt(formData.maxPrice) : null,
          minRooms: formData.minRooms ? parseInt(formData.minRooms) : null,
          maxRooms: formData.maxRooms ? parseInt(formData.maxRooms) : null,
        }),
      })

      if (response.ok) {
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      }
    } catch (error) {
      console.error('Error saving profile:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Редактирование профиля</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Основная информация */}
          <Card>
            <CardHeader>
              <CardTitle>Основная информация</CardTitle>
              <CardDescription>Расскажите о себе</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Телефон</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="about">О себе</Label>
                <Textarea
                  id="about"
                  value={formData.about}
                  onChange={(e) => setFormData({ ...formData, about: e.target.value })}
                  rows={4}
                  placeholder="Расскажите о себе, своих привычках и образе жизни"
                />
              </div>
            </CardContent>
          </Card>

          {/* Работа и доход */}
          <Card>
            <CardHeader>
              <CardTitle>Работа и доход</CardTitle>
              <CardDescription>Информация о вашей работе и доходе</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="occupation">Должность</Label>
                  <Input
                    id="occupation"
                    value={formData.occupation}
                    onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Компания</Label>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="monthlyIncome">Месячный доход (руб.)</Label>
                <Input
                  id="monthlyIncome"
                  type="number"
                  value={formData.monthlyIncome}
                  onChange={(e) => setFormData({ ...formData, monthlyIncome: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Предпочтения по квартире */}
          <Card>
            <CardHeader>
              <CardTitle>Предпочтения по квартире</CardTitle>
              <CardDescription>Какое жильё вы ищете?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="preferredLocation">Предпочтительный район/метро</Label>
                <Input
                  id="preferredLocation"
                  value={formData.preferredLocation}
                  onChange={(e) => setFormData({ ...formData, preferredLocation: e.target.value })}
                  placeholder="Например: Центральный район, метро Парк Культуры"
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="minPrice">Минимальная цена (руб./мес.)</Label>
                  <Input
                    id="minPrice"
                    type="number"
                    value={formData.minPrice}
                    onChange={(e) => setFormData({ ...formData, minPrice: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxPrice">Максимальная цена (руб./мес.)</Label>
                  <Input
                    id="maxPrice"
                    type="number"
                    value={formData.maxPrice}
                    onChange={(e) => setFormData({ ...formData, maxPrice: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="minRooms">Минимум комнат</Label>
                  <Input
                    id="minRooms"
                    type="number"
                    min="1"
                    value={formData.minRooms}
                    onChange={(e) => setFormData({ ...formData, minRooms: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxRooms">Максимум комнат</Label>
                  <Input
                    id="maxRooms"
                    type="number"
                    min="1"
                    value={formData.maxRooms}
                    onChange={(e) => setFormData({ ...formData, maxRooms: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="hasPets"
                    checked={formData.hasPets}
                    onChange={(e) => setFormData({ ...formData, hasPets: e.target.checked })}
                    className="h-4 w-4"
                  />
                  <Label htmlFor="hasPets">Есть домашние животные</Label>
                </div>
                {formData.hasPets && (
                  <div className="space-y-2 ml-6">
                    <Label htmlFor="petsDescription">Опишите животных</Label>
                    <Textarea
                      id="petsDescription"
                      value={formData.petsDescription}
                      onChange={(e) => setFormData({ ...formData, petsDescription: e.target.value })}
                      rows={2}
                    />
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="smoking"
                    checked={formData.smoking}
                    onChange={(e) => setFormData({ ...formData, smoking: e.target.checked })}
                    className="h-4 w-4"
                  />
                  <Label htmlFor="smoking">Курю</Label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="children"
                    checked={formData.children}
                    onChange={(e) => setFormData({ ...formData, children: e.target.checked })}
                    className="h-4 w-4"
                  />
                  <Label htmlFor="children">Есть дети</Label>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="additionalPreferences">Дополнительные предпочтения</Label>
                <Textarea
                  id="additionalPreferences"
                  value={formData.additionalPreferences}
                  onChange={(e) => setFormData({ ...formData, additionalPreferences: e.target.value })}
                  rows={3}
                  placeholder="Любые дополнительные пожелания"
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            {saved && (
              <span className="text-sm text-green-600 self-center">
                Профиль сохранён!
              </span>
            )}
            <Button type="submit" disabled={loading}>
              <Save className="h-4 w-4 mr-2" />
              {loading ? 'Сохранение...' : 'Сохранить профиль'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
