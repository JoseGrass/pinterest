'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useAuth } from '@/contexts/AuthContext'

export default function MyPinsPage() {
  const { user } = useAuth()
  const [pins, setPins] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchLikes = async () => {
      setLoading(true)
      setError(null)
      if (!user) {
        setPins([])
        setLoading(false)
        return
      }
      const { data, error } = await supabase
        .from('likes')
        .select(`
          id,
          pin:pin_id (
            id, title, description, image_url
          )
        `)
        .eq('user_id', user.id)
      if (error) {
        setError('No se pudieron cargar tus favoritos')
        setPins([])
      } else {
        setPins((data || []).map(like => like.pin).filter(Boolean))
      }
      setLoading(false)
    }
    fetchLikes()
  }, [user])

  return (
    <div className="max-w-5xl mx-auto px-3 md:px-8 pt-24 pb-12">
      <h1 className="text-2xl font-bold mb-8 text-center text-red-600 tracking-wide">Mis Favoritos ❤️</h1>
      {loading && <p className="text-md text-gray-500 text-center">Cargando...</p>}
      {error && <p className="text-md text-red-600 text-center mb-4">{error}</p>}
      {pins.length === 0 && !loading && (
        <div className="flex flex-col items-center py-20 text-gray-400">
          <svg className="w-14 h-14 mb-4 text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.637l1.318-1.318a4.5 4.5 0 116.364 6.364L12 21.243l-7.682-7.682a4.5 4.5 0 010-6.364z" />
          </svg>
          <p className="text-xl">Aún no tienes favoritos.</p>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-7">
        {pins.map(pin => (
          <div
            key={pin.id}
            className="group bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col hover:scale-105 hover:shadow-xl transition-all cursor-pointer border border-gray-100"
          >
            <div className="relative w-full h-56 bg-gray-100 flex items-center justify-center">
              <img
                src={pin.image_url}
                alt={pin.title}
                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-2 right-2 bg-white bg-opacity-90 p-1 rounded-full shadow">
                <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656l-7.071 7.071a1 1 0 01-1.414 0l-7.071-7.07a4 4 0 010-5.657z" />
                </svg>
              </div>
            </div>
            <div className="p-4 flex-1 flex flex-col justify-between">
              <h2 className="font-bold text-lg text-gray-900 mb-1 truncate">{pin.title}</h2>
              <p className="text-gray-600 text-sm line-clamp-2">{pin.description || 'Sin descripción.'}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
