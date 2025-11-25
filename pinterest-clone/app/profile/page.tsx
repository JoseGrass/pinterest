'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { authService } from '@/lib/authService'
import { supabase } from '@/lib/supabaseClient'

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [username, setUsername] = useState('')
  const [fullName, setFullName] = useState('')
  const [avatar, setAvatar] = useState('')
  const [website, setWebsite] = useState('')
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()
  const [shouldFetch, setShouldFetch] = useState(true)

  useEffect(() => {
    if (!shouldFetch) return
    const fetchUser = async () => {
      const currentUser = await authService.getCurrentUser()
      setUser(currentUser)
      if (currentUser) {
        setEmail(currentUser.email)
        const { data } = await supabase.from('profiles').select('*').eq('id', currentUser.id).single()
        if (data) {
          setUsername(data.username || '')
          setFullName(data.full_name || '')
          setAvatar(data.avatar_url || '')
          setWebsite(data.website || '')
        }
      }
    }
    fetchUser()
    setShouldFetch(false)
  }, [shouldFetch])

  const handleSignIn = async () => { /* igual que antes */ }
  const handleSignUp = async () => { /* igual que antes */ }
  const handleSignOut = async () => { /* igual que antes */ }
  const handleDeleteAccount = async () => { /* igual que antes */ }
  const handleSave = async () => { /* igual que antes */ }

  return (
    <div className="w-full min-h-screen bg-gray-50 flex justify-center items-center px-2 py-8">
      <div className="w-full sm:max-w-md bg-white rounded-2xl shadow-lg p-5 border border-gray-200 mx-auto transition-all flex flex-col justify-center items-center">
        {!user ? (
          <>
            <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Iniciar sesión o crear cuenta</h2>
            {message && <div className="mb-3 text-red-600 text-center">{message}</div>}
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-xl p-3 mb-2 focus:outline-none focus:ring-2 focus:ring-red-400"
              disabled={loading}
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-xl p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-red-400"
              disabled={loading}
            />
            <div className="flex gap-4 mb-2 flex-col sm:flex-row">
              <button
                onClick={handleSignIn}
                disabled={loading}
                className="bg-red-600 text-white py-2 px-5 rounded-xl font-semibold shadow hover:bg-red-700 transition-all w-full sm:w-auto"
              >
                {loading ? 'Iniciando...' : 'Iniciar sesión'}
              </button>
              <button
                onClick={handleSignUp}
                disabled={loading}
                className="bg-gray-200 text-gray-900 py-2 px-5 rounded-xl font-semibold shadow hover:bg-gray-300 transition-all w-full sm:w-auto"
              >
                {loading ? 'Creando...' : 'Crear cuenta'}
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-xl font-bold mb-5 text-center text-gray-800">Perfil de usuario</h2>
            {avatar && (
              <div className="flex flex-col items-center mb-4">
                <img
                  src={avatar}
                  alt="Avatar"
                  className="w-24 h-24 rounded-full border-4 border-red-200 shadow mb-2 object-cover"
                />
              </div>
            )}
            {message && <div className="mb-3 text-blue-600 text-center text-sm">{message}</div>}
            <div className="space-y-3 w-full">
              <div>
                <label className="block mb-1 font-medium text-gray-700 text-sm">Nombre de usuario</label>
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  disabled={loading || deleting}
                  className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-red-400"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium text-gray-700 text-sm">Nombre completo</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  disabled={loading || deleting}
                  className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-red-400"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium text-gray-700 text-sm">URL Avatar</label>
                <input
                  type="url"
                  value={avatar}
                  onChange={e => setAvatar(e.target.value)}
                  disabled={loading || deleting}
                  className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-red-400"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium text-gray-700 text-sm">Sitio web</label>
                <input
                  type="url"
                  value={website}
                  onChange={e => setWebsite(e.target.value)}
                  disabled={loading || deleting}
                  className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-red-400"
                />
              </div>
            </div>
            <button
              onClick={handleSave}
              disabled={loading || deleting}
              className="bg-red-600 text-white rounded-xl px-6 py-3 mt-5 font-semibold shadow hover:bg-red-700 w-full"
            >
              Guardar cambios
            </button>
            <button
              onClick={handleSignOut}
              disabled={loading || deleting}
              className="bg-gray-200 text-gray-700 rounded-xl px-6 py-3 mt-3 font-semibold shadow hover:bg-gray-300 w-full"
            >
              Cerrar sesión
            </button>
            <button
              onClick={handleDeleteAccount}
              disabled={loading || deleting}
              className="bg-black text-white rounded-xl px-6 py-3 mt-3 font-semibold shadow hover:bg-red-800 w-full"
            >
              {deleting ? 'Eliminando...' : 'Eliminar cuenta'}
            </button>
          </>
        )}
      </div>
    </div>
  )
}
