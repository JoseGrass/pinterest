'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { User } from '@supabase/supabase-js';

export default function Navbar({ openCreateModal }: { openCreateModal: () => void }) {
  const [user, setUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const pathname = usePathname();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const isActive = (path: string) => pathname === path;

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="hidden md:flex fixed top-0 left-0 w-full bg-white z-40 shadow-sm items-center justify-between px-4 py-3">
        
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-lg">P</span>
          </div>
          <span className="font-bold text-xl">Pinterest</span>
        </Link>

        {/* Search Bar */}
        <div className="flex-1 max-w-2xl mx-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-100 rounded-full py-3 px-4 focus:outline-none focus:ring-2 focus:ring-gray-300"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <i className="fas fa-search text-gray-500"></i>
            </div>
          </div>
        </div>

        {/* Navigation Icons */}
        <div className="flex items-center space-x-4">

          {/* Home */}
          <Link 
            href="/"
            className={`p-2 rounded-full ${isActive('/') ? 'bg-gray-100 text-red-600' : 'hover:bg-gray-100 text-gray-700'}`}
          >
            <i className="fas fa-home text-xl"></i>
          </Link>

          {/* Crear Pin */}
          <button
            type="button"
            className="p-2 rounded-full hover:bg-gray-100 text-gray-700"
            onClick={openCreateModal}
          >
            <i className="fas fa-plus text-xl"></i>
          </button>

          {user ? (
            <div className="flex items-center space-x-3">
              
              {/* Perfil */}
              <Link 
                href="/profile" 
                className={`p-2 rounded-full ${isActive('/profile') ? 'bg-gray-100 text-red-600' : 'hover:bg-gray-100 text-gray-700'}`}
              >
                <i className="fas fa-user text-xl"></i>
              </Link>

              {/* Sign out */}
              <button
                onClick={handleSignOut}
                className="bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700 text-sm"
              >
                Salir
              </button>
            </div>

          ) : (
            <Link
              href="/auth"
              className="bg-red-600 text-white px-6 py-2 rounded-full hover:bg-red-700"
            >
              Entrar
            </Link>
          )}

        </div>
      </nav>

      {/* Mobile Top Bar */}
      <div className="md:hidden fixed top-0 left-0 w-full bg-white z-30 shadow-sm py-3 px-4 border-b">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-lg">P</span>
          </div>
          <span className="font-bold text-xl">Pinterest</span>
        </Link>
      </div>
    </>
  );
}
