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
  const [isLiked, setIsLiked] = useState(pin.is_liked || false)
  const [likesCount, setLikesCount] = useState(pin.likes_count || 0)

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    // Obtenemos el usuario directamente de Supabase
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    try {
      // Lógica de like directa con Supabase
      const { data: existingLike } = await supabase
        .from('likes')
        .select('id')
        .eq('pin_id', pin.id)
        .eq('user_id', user.id)
        .single()

      if (existingLike) {
        // Eliminar like
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
        // Agregar like
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
        />
      )
    }
    return getUsername().charAt(0).toUpperCase()
  }

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    console.log('Guardar pin:', pin.id)
  }

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    console.log('Compartir pin:', pin.id)
  }

  return (
    <div className="break-inside-avoid relative group cursor-zoom-in mb-4">
      <Link href={`/pin/${pin.id}`} className="block">
        <div className="relative rounded-2xl overflow-hidden bg-gray-200 shadow-lg">
          <Image
            src={pin.image_url}
            alt={pin.title || 'Pin image'}
            width={500}
            height={750}
            className={`w-full transition-opacity duration-300 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
            priority={false}
          />
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-2xl" />
          )}
          
          {/* Overlay con acciones */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 opacity-0 group-hover:opacity-100 flex flex-col justify-between p-4">
            <div className="flex justify-end">
              <button 
                onClick={handleSave}
                className="bg-red-600 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-red-700 transition-colors"
              >
                Guardar
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
                <svg 
                  className="w-5 h-5" 
                  fill={isLiked ? "currentColor" : "none"} 
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
              </button>
              <button 
                onClick={handleShare}
                className="bg-white bg-opacity-90 rounded-full p-2 hover:bg-opacity-100 transition-all hover:scale-110"
                aria-label="Compartir"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </Link>
      
      {/* Información del pin */}
      <div className="mt-2 px-2">
        <h3 className="font-semibold text-sm truncate">{pin.title || 'Sin título'}</h3>
        {pin.description && (
          <p className="text-gray-600 text-xs truncate">{pin.description}</p>
        )}
        <div className="flex items-center justify-between mt-1">
          <div className="flex items-center">
            <div className="w-6 h-6 bg-gray-300 rounded-full mr-2 flex items-center justify-center text-xs overflow-hidden">
              {getAvatar()}
            </div>
            <span className="text-xs text-gray-500">{getUsername()}</span>
          </div>
          <div className="flex items-center text-xs text-gray-500">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
            </svg>
            {likesCount}
          </div>
        </div>
      </div>
    </div>
  )
}