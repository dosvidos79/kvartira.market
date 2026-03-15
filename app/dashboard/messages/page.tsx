'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Send, MessageSquare } from 'lucide-react'

interface Message {
  id: string
  content: string
  senderId: string
  receiverId: string
  createdAt: string
  sender: {
    name: string | null
    email: string
  }
  receiver: {
    name: string | null
    email: string
  }
}

interface Conversation {
  userId: string
  userName: string | null
  userEmail: string
  lastMessage: string
  lastMessageTime: string
  unreadCount: number
}

export default function MessagesPage() {
  const { data: session } = useSession()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchConversations()
  }, [])

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation)
      const interval = setInterval(() => {
        fetchMessages(selectedConversation)
      }, 3000) // Обновление каждые 3 секунды
      return () => clearInterval(interval)
    }
  }, [selectedConversation])

  const fetchConversations = async () => {
    try {
      const response = await fetch('/api/messages/conversations')
      const data = await response.json()
      if (data.conversations) {
        setConversations(data.conversations)
        if (data.conversations.length > 0 && !selectedConversation) {
          setSelectedConversation(data.conversations[0].userId)
        }
      }
    } catch (error) {
      console.error('Error fetching conversations:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchMessages = async (userId: string) => {
    try {
      const response = await fetch(`/api/messages?userId=${userId}`)
      const data = await response.json()
      if (data.messages) {
        setMessages(data.messages)
      }
    } catch (error) {
      console.error('Error fetching messages:', error)
    }
  }

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !selectedConversation) return

    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          receiverId: selectedConversation,
          content: newMessage,
        }),
      })

      if (response.ok) {
        setNewMessage('')
        fetchMessages(selectedConversation)
        fetchConversations()
      }
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-muted-foreground">Загрузка...</p>
      </div>
    )
  }

  const currentConversation = conversations.find(c => c.userId === selectedConversation)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Сообщения</h1>

        <div className="grid md:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
          {/* Список бесед */}
          <div className="border rounded-lg bg-white overflow-hidden">
            <div className="p-4 border-b">
              <h2 className="font-semibold">Беседы</h2>
            </div>
            <div className="overflow-y-auto h-full">
              {conversations.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">
                  <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Нет активных бесед</p>
                </div>
              ) : (
                conversations.map((conv) => (
                  <button
                    key={conv.userId}
                    onClick={() => setSelectedConversation(conv.userId)}
                    className={`w-full text-left p-4 border-b hover:bg-gray-50 ${
                      selectedConversation === conv.userId ? 'bg-primary/5' : ''
                    }`}
                  >
                    <div className="font-medium">
                      {conv.userName || conv.userEmail}
                    </div>
                    <div className="text-sm text-muted-foreground truncate">
                      {conv.lastMessage}
                    </div>
                    {conv.unreadCount > 0 && (
                      <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded-full">
                        {conv.unreadCount}
                      </span>
                    )}
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Чат */}
          <div className="md:col-span-2 border rounded-lg bg-white flex flex-col">
            {selectedConversation && currentConversation ? (
              <>
                <div className="p-4 border-b">
                  <h2 className="font-semibold">
                    {currentConversation.userName || currentConversation.userEmail}
                  </h2>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.length === 0 ? (
                    <div className="text-center text-muted-foreground py-8">
                      <p>Начните беседу</p>
                    </div>
                  ) : (
                    messages.map((message) => {
                      const isOwn = message.senderId === session?.user?.id
                      return (
                        <div
                          key={message.id}
                          className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                        >
                          <Card className={`max-w-[70%] ${isOwn ? 'bg-primary text-primary-foreground' : ''}`}>
                            <CardContent className="p-3">
                              <p className="text-sm">{message.content}</p>
                              <p className={`text-xs mt-1 ${isOwn ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                                {new Date(message.createdAt).toLocaleTimeString('ru-RU', {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </p>
                            </CardContent>
                          </Card>
                        </div>
                      )
                    })
                  )}
                </div>
                <form onSubmit={sendMessage} className="p-4 border-t flex gap-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Напишите сообщение..."
                    className="flex-1"
                  />
                  <Button type="submit">
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Выберите беседу</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
