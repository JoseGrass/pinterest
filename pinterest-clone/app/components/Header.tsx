'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { authService } from '@/lib/authService'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function Header() {
  const { user, loading } = useAuth()
  const [showAuthForm, setShowAuthForm] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [authLoading, setAuthLoading] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [searchLoading, setSearchLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)

  const router = useRouter()

  const handleAuth = async (e: React.FormEvent) => { /* igual que antes */ }
  const handleLogout = async () => { /* igual que antes */ }
  const handleGoHome = () => { router.push('/') }
  const handleGoMyPins = () => { router.push('/mypins') }

  // Búsqueda instantánea
  const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchValue(value)
    if (value.trim().length === 0) {
      setSearchResults([])
      setShowResults(false)
      return
    }
    setSearchLoading(true)
    setShowResults(true)
    // Busca por título o descripción
    const { data } = await supabase
      .from('pins')
      .select('*')
      .or(`title.ilike.%${value}%,description.ilike.%${value}%`)
      .limit(10)
    setSearchResults(data || [])
    setSearchLoading(false)
  }

  // Cierra resultados si el input queda vacío o se borra todo
  const handleBlur = () => {
    setTimeout(() => setShowResults(false), 200)
  }

  return (
    <header className="fixed top-0 left-0 right-0 bg-white z-50 shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={handleGoHome}>
            <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">P</span>
            </div>
            <span className="text-red-600 font-bold text-xl">interest</span>
          </div>
          <button
            className="px-4 py-2 bg-gray-900 text-white rounded-full text-sm font-semibold hover:bg-black transition-colors"
            onClick={handleGoHome}
          >
            Inicio
          </button>
          <button
            className="px-4 py-2 bg-gray-900 text-white rounded-full text-sm font-semibold hover:bg-black transition-colors"
            onClick={handleGoMyPins}
          >
            Favoritos
          </button>
        </div>
        <div className="flex-1 max-w-2xl mx-8 relative">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar"
              value={searchValue}
              onChange={handleSearchChange}
              onBlur={handleBlur}
              className="w-full bg-gray-100 rounded-full px-4 py-3 pl-12 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:bg-white transition-all"
              autoComplete="off"
              onFocus={() => searchValue && setShowResults(true)}
            />
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            {showResults && (
              <div className="absolute top-full left-0 w-full bg-white shadow-lg rounded-xl mt-2 z-50 max-h-80 overflow-auto border border-gray-100">
                {searchLoading ? (
                  <div className="p-4 text-center text-gray-400">Buscando...</div>
                ) : searchResults.length === 0 ? (
                  <div className="p-4 text-center text-gray-400">No hay resultados</div>
                ) : (
                  searchResults.map(pin => (
                    <div
                      key={pin.id}
                      className="flex items-center gap-3 px-4 py-2 cursor-pointer hover:bg-gray-50"
                      onMouseDown={() => router.push(`/pin/${pin.id}`)}
                    >
                      <img src={pin.image_url} alt={pin.title} className="w-12 h-12 object-cover rounded-lg border" />
                      <div>
                        <div className="font-semibold text-gray-900 truncate">{pin.title}</div>
                        <div className="text-sm text-gray-500 truncate">{pin.description}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
        {/* ... iconos y autenticación igual que antes ... */}
      </div>
    </header>
  )
}
