// components/BottomNav.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { User } from '@supabase/supabase-js'

export default function BottomNav() {
  const pathname = usePathname()
  const [user, setUser] = useState<User | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const navItems = [
    { href: '/', icon: 'fas fa-home', label: 'Inicio' },
    { href: '/search', icon: 'fas fa-search', label: 'Buscar' },
    { 
      icon: 'fas fa-plus', 
      label: 'Crear',
      action: () => setShowCreateModal(true)
    },
    { href: '/profile', icon: 'fas fa-user', label: 'Perfil' },
  ]

  return (
    <>
      {/* Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 md:hidden">
        <div className="flex justify-around items-center py-2">
          {navItems.map((item) => {
            const isActive = item.href ? pathname === item.href : false
            
            if (item.action) {
              return (
                <button
                  key={item.label}
                  onClick={item.action}
                  className="flex flex-col items-center p-2"
                >
                  <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center -mt-6">
                    <i className={`${item.icon} text-white text-lg`}></i>
                  </div>
                  <span className="text-xs mt-1 text-gray-600">{item.label}</span>
                </button>
              )
            }

            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex flex-col items-center p-2 ${
                  isActive ? 'text-red-600' : 'text-gray-600'
                }`}
              >
                <i className={`${item.icon} text-xl`}></i>
                <span className="text-xs mt-1">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Espacio para el contenido no se oculte detrás del nav */}
      <div className="pb-16 md:pb-0"></div>

      {/* Modal para crear pin - puedes usar tu CreatePinModal aquí */}
      {/* {showCreateModal && (
        <CreatePinModal 
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onPinCreated={() => setShowCreateModal(false)}
        />
      )} */}
    </>
  )
}