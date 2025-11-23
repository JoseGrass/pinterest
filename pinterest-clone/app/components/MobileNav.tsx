// components/MobileNav.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabaseClient'
import { User } from '@supabase/supabase-js'

interface MobileNavProps {
  onClose: () => void
}

export default function MobileNav({ onClose }: MobileNavProps) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    // Obtener usuario actual
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }

    getUser()

    // Escuchar cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      {/* Overlay de fondo */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      
      {/* Panel lateral */}
      <div className="absolute right-0 top-0 h-full w-64 bg-white shadow-xl">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <Link href="/" className="flex items-center space-x-2" onClick={onClose}>
              <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">M</span>
              </div>
              <span className="font-bold text-xl">Mariposas</span>
            </Link>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <i className="fas fa-times text-xl"></i>
            </button>
          </div>

          {/* Menú de navegación */}
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/" 
                  className="flex items-center space-x-3 p-3 hover:bg-gray-100 rounded-lg"
                  onClick={onClose}
                >
                  <i className="fas fa-home text-xl text-gray-700 w-6"></i>
                  <span>Inicio</span>
                </Link>
              </li>
              
              <li>
                <Link 
                  href="/create-pin" 
                  className="flex items-center space-x-3 p-3 hover:bg-gray-100 rounded-lg"
                  onClick={onClose}
                >
                  <i className="fas fa-plus text-xl text-gray-700 w-6"></i>
                  <span>Crear Pin</span>
                </Link>
              </li>

              {user ? (
                <>
                  <li>
                    <Link 
                      href="/profile" 
                      className="flex items-center space-x-3 p-3 hover:bg-gray-100 rounded-lg"
                      onClick={onClose}
                    >
                      <i className="fas fa-user text-xl text-gray-700 w-6"></i>
                      <span>Mi Perfil</span>
                    </Link>
                  </li>
                  <li>
                    <button 
                      onClick={handleSignOut}
                      className="flex items-center space-x-3 p-3 hover:bg-gray-100 rounded-lg w-full text-left"
                    >
                      <i className="fas fa-sign-out-alt text-xl text-gray-700 w-6"></i>
                      <span>Cerrar Sesión</span>
                    </button>
                  </li>
                </>
              ) : (
                <li>
                  <Link 
                    href="/auth" 
                    className="flex items-center space-x-3 p-3 hover:bg-gray-100 rounded-lg"
                    onClick={onClose}
                  >
                    <i className="fas fa-sign-in-alt text-xl text-gray-700 w-6"></i>
                    <span>Iniciar Sesión</span>
                  </Link>
                </li>
              )}
            </ul>
          </nav>

          {/* Footer con información del usuario */}
          {user && (
            <div className="p-4 border-t">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                  <i className="fas fa-user text-gray-500"></i>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{user.email}</p>
                  <p className="text-xs text-gray-500">Mi cuenta</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}