'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Pin } from '@/types/database'
import { supabase } from '@/lib/supabaseClient'

interface PinCardProps {
  pin: Pin
}

export default function PinCard({ pin }: PinCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [isLiked, setIsLiked] = useState(pin.is_liked || false)
  const [likesCount, setLikesCount] = useState(pin.likes_count || 0)

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    try {
      const { data: existingLike } = await supabase
        .from('likes')
        .select('id')
        .eq('pin_id', pin.id)
        .eq('user_id', user.id)
        .single()

      if (existingLike) {
        await supabase
          .from('likes')
          .delete()
          .eq('id', existingLike.id)
        
        const { count } = await supabase
          .from('likes')
          .select('*', { count: 'exact', head: true })
          .eq('pin_id', pin.id)

        setIsLiked(false)
        setLikesCount(count || 0)
      } else {
        await supabase
          .from('likes')
          .insert({
            pin_id: pin.id,
            user_id: user.id
          })

        const { count } = await supabase
          .from('likes')
          .select('*', { count: 'exact', head: true })
          .eq('pin_id', pin.id)

        setIsLiked(true)
        setLikesCount((count || 0) + 1)
      }
    } catch (error) {
      console.error('Error toggling like:', error)
    }
  }

  const getUsername = (): string => {
    if (pin.profiles?.username) return pin.profiles.username
    if (pin.profiles?.full_name) return pin.profiles.full_name
    return 'Usuario'
  }

  const getAvatar = (): JSX.Element | string => {
    if (pin.profiles?.avatar_url) {
      return (
        <img 
          src={pin.profiles.avatar_url} 
          alt={getUsername()}
          className="w-full h-full rounded-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement
            target.style.display = 'none'
          }}
        />
      )
    }
    return getUsername().charAt(0).toUpperCase()
  }

  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    try {
      // Lógica para guardar el pin en una colección
      console.log('Guardar pin:', pin.id)
      // Aquí puedes implementar la lógica para guardar el pin
    } catch (error) {
      console.error('Error saving pin:', error)
    }
  }

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (navigator.share) {
      navigator.share({
        title: pin.title || 'Pin de Mariposas',
        text: pin.description || '',
        url: `${window.location.origin}/pin/${pin.id}`
      })
    } else {
      // Fallback para copiar el enlace
      navigator.clipboard.writeText(`${window.location.origin}/pin/${pin.id}`)
      console.log('Enlace copiado al portapapeles')
    }
  }

  const handleImageError = () => {
    setImageError(true)
    setImageLoaded(true)
  }

  // Función para obtener una imagen de placeholder si la original falla
  const getImageUrl = () => {
    if (imageError) {
      return `https://picsum.photos/500/750?random=${pin.id}`
    }
    return pin.image_url
  }

  return (
    <div className="break-inside-avoid relative group cursor-zoom-in mb-4">
      <Link href={`/pin/${pin.id}`} className="block">
        <div className="relative rounded-2xl overflow-hidden bg-gray-200 shadow-lg">
          {/* Contenedor de imagen con relación de aspecto */}
          <div className="relative" style={{ paddingBottom: '150%' }}> {/* 2:3 ratio */}
            <Image
              src={getImageUrl()}
              alt={pin.title || 'Imagen de pin'}
              fill
              className={`object-cover transition-opacity duration-300 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
              onError={handleImageError}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority={false}
            />
            
            {!imageLoaded && !imageError && (
              <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-2xl flex items-center justify-center">
                <div className="text-gray-400">
                  <i className="fas fa-image text-2xl"></i>
                </div>
              </div>
            )}
            
            {imageError && (
              <div className="absolute inset-0 bg-gray-100 rounded-2xl flex items-center justify-center">
                <div className="text-gray-400 text-center p-4">
                  <i className="fas fa-image text-2xl mb-2"></i>
                  <p className="text-xs">Imagen no disponible</p>
                </div>
              </div>
            )}
          </div>
          
          {/* Overlay con acciones */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 opacity-0 group-hover:opacity-100 flex flex-col justify-between p-3">
            <div className="flex justify-end">
              <button 
                onClick={handleSave}
                className="bg-red-600 text-white px-3 py-2 rounded-full text-sm font-semibold hover:bg-red-700 transition-colors flex items-center space-x-1"
              >
                <i className="fas fa-bookmark text-xs"></i>
                <span>Guardar</span>
              </button>
            </div>
            <div className="flex justify-between items-center">
              <button 
                onClick={handleLike}
                className={`rounded-full p-2 transition-all hover:scale-110 ${
                  isLiked 
                    ? 'bg-red-500 text-white' 
                    : 'bg-white bg-opacity-90 hover:bg-opacity-100'
                }`}
                aria-label={isLiked ? 'Quitar like' : 'Dar like'}
              >
                <i className={`fas fa-heart ${isLiked ? 'text-white' : 'text-gray-700'}`}></i>
              </button>
              <button 
                onClick={handleShare}
                className="bg-white bg-opacity-90 rounded-full p-2 hover:bg-opacity-100 transition-all hover:scale-110"
                aria-label="Compartir"
              >
                <i className="fas fa-share text-gray-700"></i>
              </button>
            </div>
          </div>
        </div>
      </Link>
      
      {/* Información del pin */}
      <div className="mt-2 px-2">
        <h3 className="font-semibold text-sm truncate text-gray-900">
          {pin.title || 'Sin título'}
        </h3>
        {pin.description && (
          <p className="text-gray-600 text-xs truncate mt-1">
            {pin.description}
          </p>
        )}
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-xs overflow-hidden shrink-0">
              {getAvatar()}
            </div>
            <span className="text-xs text-gray-500 truncate">
              {getUsername()}
            </span>
          </div>
          <div className="flex items-center text-xs text-gray-500 shrink-0">
            <i className="fas fa-heart text-xs mr-1"></i>
            {likesCount}
          </div>
        </div>
      </div>
    </div>
  )
}