import { supabase } from './supabaseClient'
import { Board } from '@/types/database'

export const boardService = {
  async getAllBoards(): Promise<Board[]> {
    const { data, error } = await supabase
      .from('boards')
      .select(`
        *,
        profiles:user_id (
          username,
          full_name,
          avatar_url
        ),
        pins:pin_boards(count)
      `)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching boards:', error)
      throw error
    }

    return (data || []).map((board: any) => ({
      ...board,
      pins_count: board.pins?.[0]?.count || 0
    }))
  },

  async createBoard(boardData: Omit<Board, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<Board> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User must be authenticated')

    const { data, error } = await supabase
      .from('boards')
      .insert([{
        ...boardData,
        user_id: user.id
      }])
      .select(`
        *,
        profiles:user_id (
          username,
          full_name,
          avatar_url
        )
      `)
      .single()

    if (error) {
      console.error('Error creating board:', error)
      throw error
    }
    return data
  },

  async addPinToBoard(pinId: string, boardId: string): Promise<void> {
    const { error } = await supabase
      .from('pin_boards')
      .insert([{
        pin_id: pinId,
        board_id: boardId
      }])

    if (error) {
      console.error('Error adding pin to board:', error)
      throw error
    }
  },

  async getBoardsByUser(userId: string): Promise<Board[]> {
    const { data, error } = await supabase
      .from('boards')
      .select(`
        *,
        pins:pin_boards (
          pin:pin_id (*)
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching user boards:', error)
      throw error
    }

    return (data || []).map((board: any) => ({
      ...board,
      pins_count: Array.isArray(board.pins) ? board.pins.length : 0
    }))
  }
}