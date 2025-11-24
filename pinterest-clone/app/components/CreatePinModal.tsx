// components/CreatePinModal.tsx - Versión con mejor debugging
'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import ImageUploader from '../components/ImageUploader'

interface CreatePinModalProps {
  isOpen: boolean
  onClose: () => void
  onPinCreated: () => void
}

export default function CreatePinModal({ isOpen, onClose, onPinCreated }: CreatePinModalProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!title || !imageUrl) {
      alert('Por favor, completa el título y la URL de la imagen')
      return
    }

    setLoading(true)
    try {
      console.log('🔍 Iniciando creación de pin...')
      
      // 1. Verificar usuario
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      console.log('Usuario:', user)
      
      if (userError) {
        console.error('Error al obtener usuario:', userError)
        throw userError
      }
      
      if (!user) {
        alert('Debes iniciar sesión para crear un pin')
        return
      }

      // 2. Preparar datos
      const pinData = {
        title,
        description,
        image_url: imageUrl,
        user_id: user.id
      }
      
      console.log('📝 Datos del pin:', pinData)

      // 3. Insertar en la base de datos
      const { data, error } = await supabase
        .from('pins')
        .insert([pinData])
        .select() // ← Esto es importante para obtener el resultado

      if (error) {
        console.error('❌ Error de Supabase:', error)
        throw error
      }

      console.log('✅ Pin creado exitosamente:', data)

      // 4. Limpiar y cerrar
      setTitle('')
      setDescription('')
      setImageUrl('')
      
      onPinCreated()
      onClose()
      
    } catch (error: any) {
      console.error('❌ Error completo al crear pin:', error)
      alert(`Error al crear el pin: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold">Crear nuevo Pin</h2>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700"
            disabled={loading}
          >
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Título *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Añade un título"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Añade una descripción"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              URL de la imagen *
            </label>
            <ImageUploader onUploaded={(url) => setImageUrl(url)} />
            <p className="text-xs text-gray-500 mt-1">
              Puedes usar imágenes de <a href="https://unsplash.com" target="_blank" className="text-red-600">Unsplash</a>
            </p>
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-red-600 text-white px-6 py-2 rounded-full hover:bg-red-700 disabled:opacity-50 flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  <span>Creando...</span>
                </>
              ) : (
                <>
                  <i className="fas fa-plus"></i>
                  <span>Crear Pin</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}