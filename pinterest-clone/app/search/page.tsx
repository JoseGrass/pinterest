'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [allPins, setAllPins] = useState<any[]>([])
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filtered, setFiltered] = useState(false)

  // Carga todas las imágenes al inicio
  useEffect(() => {
    const fetchPins = async () => {
      setLoading(true)
      const { data, error } = await supabase.from('pins').select('*')
      if (error) {
        setAllPins([])
        setResults([])
      } else {
        setAllPins(data || [])
        setResults(data || [])
      }
      setLoading(false)
    }
    fetchPins()
  }, [])

  // Filtrado instantáneo en frontend cuando se escribe
  useEffect(() => {
    if (!query.length) {
      setResults(allPins)
      setFiltered(false)
      return
    }
    const search = query.toLowerCase()
    const filteredPins = allPins.filter(pin =>
      (pin.title?.toLowerCase().includes(search) || pin.description?.toLowerCase().includes(search))
    )
    setResults(filteredPins)
    setFiltered(true)
  }, [query, allPins])

  return (
    <div className="max-w-lg mx-auto pt-24 pb-12 px-2">
      <h1 className="text-xl font-bold mb-4">Buscar Pins</h1>
      <input
        type="text"
        className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-6 focus:ring-2 focus:ring-red-400"
        placeholder="Buscar por título o descripción..."
        value={query}
        onChange={e => setQuery(e.target.value)}
      />
      {loading && <p className="text-sm text-gray-500 mb-2">Cargando imágenes...</p>}
      <div className="grid gap-4">
        {results.length === 0 && filtered && !loading && (
          <div className="text-gray-400">No se encontraron resultados</div>
        )}
        {results.map(pin => (
          <div key={pin.id} className="border rounded-lg p-3 bg-white flex gap-3 items-center shadow">
            <img src={pin.image_url} alt={pin.title} className="w-16 h-16 object-cover rounded-lg" />
            <div>
              <div className="font-semibold">{pin.title}</div>
              <div className="text-sm text-gray-600">{pin.description}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
