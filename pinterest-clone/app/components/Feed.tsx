'use client'

import { useState, useEffect } from 'react'
import PinCard from './PinCard'
import { pinService } from '@/lib/pinService'
import { Pin } from '@/types/database'
import { useAuth } from '@/contexts/AuthContext'

export default function Feed() {
  const [pins, setPins] = useState<Pin[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  useEffect(() => {
    loadPins()
  }, [user])

  const loadPins = async () => {
    try {
      setLoading(true)
      setError(null)
      console.log('Cargando pins...', { userId: user?.id })
      
      const pinsData = await pinService.getAllPins(user?.id)
      console.log('Pins cargados:', pinsData)
      
      setPins(pinsData)
    } catch (err: any) {
      console.error('Error detallado loading pins:', err)
      setError(err.message || 'Error al cargar los pins')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center py-12">
        <div className="text-red-600 text-lg mb-4">{error}</div>
        <div className="text-gray-500 text-sm mb-4">
          Revisa la consola del navegador para más detalles
        </div>
        <button 
          onClick={loadPins}
          className="px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
        >
          Reintentar
        </button>
      </div>
    )
  }

  return (
    <div className="px-4 max-w-7xl mx-auto">
      <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 2xl:columns-6 gap-4">
        {pins.map((pin) => (
          <PinCard key={pin.id} pin={pin} />
        ))}
      </div>
      {pins.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No hay pins disponibles</p>
          <button 
            onClick={loadPins}
            className="mt-4 px-6 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
          >
            Recargar
          </button>
        </div>
      )}
    </div>
  )
}