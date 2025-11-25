'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Pin } from '@/types/database'
import { pinService } from '@/lib/pinService'
import { useAuth } from '@/contexts/AuthContext'
import Header from '@/app/components/Header'

export default function PinDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [pin, setPin] = useState<Pin | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [shareMsg, setShareMsg] = useState<string | null>(null)

  const pinId = params.id as string

  useEffect(() => {
    loadPin()
  }, [pinId])

  const loadPin = async () => {
    try {
      setLoading(true)
      const pinData = await pinService.getPinById(pinId, user?.id)
      setPin(pinData)
    } catch (err) {
      console.error('Error loading pin:', err)
      setError('Error al cargar el pin')
    } finally {
      setLoading(false)
    }
  }

  const handleLike = async () => {
    if (!user || !pin) return
    try {
      const result = await pinService.toggleLike(pin.id)
      setPin({
        ...pin,
        is_liked: result.is_liked,
        likes_count: result.likes_count
      })
    } catch (error) {
      console.error('Error toggling like:', error)
    }
  }

  // Guardar: usa el mismo toggle de like
  const handleGuardar = async () => {
    await handleLike()
  }

  // Compartir: copia la URL al portapapeles
  const handleCompartir = () => {
    try {
      navigator.clipboard.writeText(window.location.href)
      setShareMsg('¡Enlace copiado!');
      setTimeout(() => setShareMsg(null), 2000)
    } catch (error) {
      setShareMsg('No se pudo copiar el enlace');
      setTimeout(() => setShareMsg(null), 2000)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="pt-20 flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
        </main>
      </div>
    )
  }

  if (error || !pin) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="pt-20 flex flex-col justify-center items-center h-96">
          <div className="text-red-600 text-lg mb-4">{error || 'Pin no encontrado'}</div>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
          >
            Volver al inicio
          </button>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-20">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="flex flex-col md:flex-row">
              {/* Imagen del pin */}
              <div className="md:w-1/2 flex items-center justify-center p-8">
                <div className="relative rounded-2xl overflow-hidden max-w-md w-full">
                  <Image
                    src={pin.image_url}
                    alt={pin.title}
                    width={600}
                    height={900}
                    className="w-full rounded-2xl"
                  />
                </div>
              </div>

              {/* Información del pin */}
              <div className="md:w-1/2 p-8">
                <div className="flex items-center justify-between mb-6">
                  <h1 className="text-2xl font-bold text-gray-900">{pin.title}</h1>
                  <button
                    onClick={handleLike}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-colors ${
                      pin.is_liked
                        ? 'bg-red-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <svg
                      className="w-5 h-5"
                      fill={pin.is_liked ? "currentColor" : "none"}
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                    <span>{pin.likes_count || 0}</span>
                  </button>
                </div>
                <p className="text-gray-600 mb-6">{pin.description}</p>
                {/* Información del usuario */}
                <div className="flex items-center space-x-4 mb-6 p-4 bg-gray-50 rounded-lg">
                  <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-lg font-semibold">
                    {pin.profiles?.avatar_url ? (
                      <img
                        src={pin.profiles.avatar_url}
                        alt={pin.profiles.username || 'Usuario'}
                        className="w-full h-full rounded-full"
                      />
                    ) : (
                      (pin.profiles?.username || 'U').charAt(0).toUpperCase()
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {pin.profiles?.username || 'Usuario'}
                    </p>
                    <p className="text-sm text-gray-500">
                      Publicado el {new Date(pin.created_at).toLocaleDateString('es-ES')}
                    </p>
                  </div>
                </div>
                {/* Acciones */}
                <div className="flex space-x-4 mb-2">
                  <button
                    className="flex-1 bg-red-600 text-white py-3 px-6 rounded-full font-semibold hover:bg-red-700 transition-colors text-center"
                    onClick={handleGuardar}
                  >
                    Guardar
                  </button>
                  <button
                    className="flex-1 border border-gray-300 text-gray-700 py-3 px-6 rounded-full font-semibold hover:bg-gray-50 transition-colors text-center"
                    onClick={handleCompartir}
                  >
                    Compartir
                  </button>
                </div>
                {shareMsg && (
                  <div className="text-center text-xs py-2 text-green-600">{shareMsg}</div>
                )}
                {/* Enlace de vuelta */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <Link
                    href="/"
                    className="text-red-600 hover:text-red-700 font-semibold inline-flex items-center"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Volver al feed
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
