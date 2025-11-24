'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

interface ImageUploaderProps {
  onUploaded: (url: string) => void
}

export default function ImageUploader({ onUploaded }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(null)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setError(null)
      setUploading(true)

      const file = e.target.files?.[0]
      if (!file) return

      // Vista previa local
      const previewURL = URL.createObjectURL(file)
      setPreview(previewURL)

      // 🔥 Nombre único para el archivo
      const filePath = `pins/${Date.now()}-${file.name}`

      // 🔥 Subida al bucket "images"
      const { error: uploadError } = await supabase.storage
        .from('images') // <-- bucket de supabase
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        })

      if (uploadError) throw uploadError

      // Obtener URL pública
      const { data } = supabase.storage
        .from('images')
        .getPublicUrl(filePath)

      const publicUrl = data.publicUrl

      console.log('URL de imagen subida:', publicUrl)

      // Devolver al componente padre
      onUploaded(publicUrl)

    } catch (err: any) {
      console.error('Error al subir imagen:', err)
      setError(err.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        Subir imagen desde tu dispositivo *
      </label>

      <input
        type="file"
        accept="image/*"
        onChange={handleUpload}
        disabled={uploading}
        className="block text-sm"
      />

      {uploading && (
        <p className="text-red-600 text-sm">Subiendo imagen...</p>
      )}

      {error && (
        <p className="text-red-600 text-sm">{error}</p>
      )}

      {preview && (
        <img 
          src={preview} 
          className="w-full rounded-lg shadow mt-2"
          alt="Preview"
        />
      )}
    </div>
  )
}
