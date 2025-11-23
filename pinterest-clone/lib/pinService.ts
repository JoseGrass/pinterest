import { supabase } from './supabaseClient'
import { Pin } from '@/types/database'

export const pinService = {
  async getAllPins(userId?: string): Promise<Pin[]> {
    try {
      console.log('🔍 Buscando pins en Supabase...')
      
      // Consulta simplificada sin joins complejos
      const { data, error } = await supabase
        .from('pins')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('❌ Error de Supabase:', error)
        throw error
      }

      console.log('✅ Pins encontrados:', data?.length || 0)
      
      // Obtener información de usuarios por separado
      const pinsWithProfiles = await Promise.all(
        (data || []).map(async (pin) => {
          // Obtener perfil del usuario
          const { data: profile } = await supabase
            .from('profiles')
            .select('username, avatar_url')
            .eq('id', pin.user_id)
            .single()

          // Obtener conteo de likes
          const { count: likesCount } = await supabase
            .from('likes')
            .select('*', { count: 'exact', head: true })
            .eq('pin_id', pin.id)

          // Verificar si el usuario actual dio like
          let isLiked = false
          if (userId) {
            const { data: userLike } = await supabase
              .from('likes')
              .select('id')
              .eq('pin_id', pin.id)
              .eq('user_id', userId)
              .single()
            isLiked = !!userLike
          }

          return {
            ...pin,
            profiles: profile || undefined,
            likes_count: likesCount || 0,
            is_liked: isLiked
          }
        })
      )

      return pinsWithProfiles
    } catch (error) {
      console.error('❌ Error en pinService:', error)
      throw error
    }
  },

  async getPinById(id: string, userId?: string): Promise<Pin | null> {
    const { data, error } = await supabase
      .from('pins')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    if (!data) return null

    // Obtener perfil
    const { data: profile } = await supabase
      .from('profiles')
      .select('username, avatar_url')
      .eq('id', data.user_id)
      .single()

    // Obtener likes
    const { count: likesCount } = await supabase
      .from('likes')
      .select('*', { count: 'exact', head: true })
      .eq('pin_id', id)

    // Verificar like del usuario
    let isLiked = false
    if (userId) {
      const { data: userLike } = await supabase
        .from('likes')
        .select('id')
        .eq('pin_id', id)
        .eq('user_id', userId)
        .single()
      isLiked = !!userLike
    }

    return {
      ...data,
      profiles: profile || undefined,
      likes_count: likesCount || 0,
      is_liked: isLiked
    }
  },

  async createPin(pinData: Omit<Pin, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<Pin> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User must be authenticated')

    const { data, error } = await supabase
      .from('pins')
      .insert([{
        ...pinData,
        user_id: user.id
      }])
      .select()
      .single()

    if (error) throw error

    // Obtener perfil del usuario
    const { data: profile } = await supabase
      .from('profiles')
      .select('username, avatar_url')
      .eq('id', user.id)
      .single()

    return {
      ...data,
      profiles: profile || undefined,
      likes_count: 0,
      is_liked: false
    }
  },

  async toggleLike(pinId: string): Promise<{ is_liked: boolean; likes_count: number }> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User must be authenticated')

    // Verificar si ya existe like
    const { data: existingLike } = await supabase
      .from('likes')
      .select('id')
      .eq('pin_id', pinId)
      .eq('user_id', user.id)
      .single()

    if (existingLike) {
      // Eliminar like
      await supabase
        .from('likes')
        .delete()
        .eq('id', existingLike.id)
    } else {
      // Agregar like
      await supabase
        .from('likes')
        .insert([{
          pin_id: pinId,
          user_id: user.id
        }])
    }

    // Obtener nuevo conteo
    const { count } = await supabase
      .from('likes')
      .select('*', { count: 'exact', head: true })
      .eq('pin_id', pinId)

    return {
      is_liked: !existingLike,
      likes_count: count || 0
    }
  },

  async deletePin(id: string): Promise<void> {
    const { error } = await supabase
      .from('pins')
      .delete()
      .eq('id', id)

    if (error) throw error
  }
}