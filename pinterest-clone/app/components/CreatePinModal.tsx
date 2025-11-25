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
  const [urlInput, setUrlInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(null)

  const handleUploaded = (url: string) => {
    setImageUrl(url)
    setPreview(url)
    setUrlInput('')
  }

  const handleUrlPreview = () => {
    setPreview(urlInput)
    setImageUrl(urlInput)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)
    if (!title || !imageUrl) {
      setErrorMsg('Por favor, completa el título y sube una imagen o pega una URL.')
      return
    }
    setLoading(true)
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError) throw userError
      if (!user) {
        setErrorMsg('Debes iniciar sesión para crear un pin')
        return
      }
      const pinData = {
        title,
        description,
        image_url: imageUrl,
        user_id: user.id
      }
      const { error } = await supabase.from('pins').insert([pinData])
      if (error) throw error
      setTitle('')
      setDescription('')
      setImageUrl('')
      setUrlInput('')
      setPreview(null)
      onPinCreated()
      onClose()
    } catch (error: any) {
      setErrorMsg(error.message || 'Error al crear el pin')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 flex justify-center items-center z-50 pointer-events-auto" style={{ background: 'rgba(0,0,0,0.08)' }}>
      {/* Modal tarjeta (centrado y pequeño) */}
      <div
        className="
          bg-white rounded-xl shadow-xl border border-gray-200
          w-full max-w-sm min-w-[310px]
          mx-auto
          p-4
          flex flex-col
          animate-fadein
        "
        style={{
          maxHeight: '80vh',
          overflowY: 'auto',
          bottom: '5rem', // deja libre el espacio para el menú inferior en móviles
          position: 'relative'
        }}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-2 border-b pb-2">
          <h2 className="text-lg md:text-xl font-bold text-gray-800">Crear nuevo Pin</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700"
            disabled={loading}
          >
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMsg && <div className="text-red-600 text-sm mb-1">{errorMsg}</div>}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Título <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500"
              placeholder="Título del pin"
              required
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500"
              placeholder="Detalles del pin"
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Imagen <span className="text-red-500">*</span>
            </label>
            <ImageUploader onUploaded={handleUploaded} />
            <div className="flex items-center gap-2 mt-2">
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="URL de imagen pública (http...)"
                className="border border-gray-300 rounded-lg px-2 py-1 w-full text-sm focus:ring-2 focus:ring-red-400"
                disabled={loading}
              />
              <button
                type="button"
                className="px-3 py-1 bg-gray-100 rounded text-sm text-gray-700 hover:bg-gray-200"
                onClick={handleUrlPreview}
                disabled={loading || !urlInput}
              >
                Usar URL
              </button>
            </div>
            {preview && (
              <img
                src={preview}
                alt="Vista previa"
                className="max-h-40 w-auto rounded-lg mx-auto mt-2 shadow"
                style={{ border: '1px solid #eee', background: '#fafafa' }}
              />
            )}
            <p className="text-xs text-gray-500 mt-1">
              Sube una imagen desde tu dispositivo <b>o</b> pega una URL pública directa.
            </p>
          </div>
          <div className="flex justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-900 bg-gray-100 rounded"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-red-600 text-white px-6 py-2 rounded-full hover:bg-red-700 opacity-90 flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  <span>Creando...</span>
                </>
              ) : (
                <>
                  <i className="fas fa-plus"></i>
                  <span>Crear</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
      {/* El BottomNav nunca se tapa ni se desactiva */}
    </div>
  )
}
