// types/database.ts
export interface Pin {
  id: string;
  title: string;
  description?: string | null;
  image_url: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  is_liked?: boolean;
  likes_count?: number;
  profiles?: {
    username?: string | null;
    full_name?: string | null;
    avatar_url?: string | null;
  };
}

export interface Profile {
  id: string;
  username?: string | null;
  full_name?: string | null;
  avatar_url?: string | null;
  created_at: string;
  updated_at: string;
}