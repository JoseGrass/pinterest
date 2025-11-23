// components/Navbar.tsx
'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { User } from '@supabase/supabase-js';

interface NavbarProps {
  onMobileMenuToggle?: () => void;
}

export default function Navbar({ onMobileMenuToggle }: NavbarProps) {
  const [user, setUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const pathname = usePathname();

  useEffect(() => {
    // Obtener usuario actual
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };

    getUser();

    // Escuchar cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="hidden md:flex fixed top-0 left-0 w-full bg-white z-40 shadow-sm items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-lg">M</span>
          </div>
          <span className="font-bold text-xl">Mariposas</span>
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
          <Link 
            href="/" 
            className={`p-2 rounded-full ${
              isActive('/') ? 'bg-gray-100 text-red-600' : 'hover:bg-gray-100 text-gray-700'
            }`}
          >
            <i className="fas fa-home text-xl"></i>
          </Link>
          
          <Link 
            href="/search" 
            className={`p-2 rounded-full ${
              isActive('/search') ? 'bg-gray-100 text-red-600' : 'hover:bg-gray-100 text-gray-700'
            }`}
          >
            <i className="fas fa-search text-xl"></i>
          </Link>

          <Link 
            href="/create-pin" 
            className={`p-2 rounded-full ${
              isActive('/create-pin') ? 'bg-gray-100 text-red-600' : 'hover:bg-gray-100 text-gray-700'
            }`}
          >
            <i className="fas fa-plus text-xl"></i>
          </Link>

          {user ? (
            <div className="flex items-center space-x-3">
              <Link 
                href="/profile" 
                className={`p-2 rounded-full ${
                  isActive('/profile') ? 'bg-gray-100 text-red-600' : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                <i className="fas fa-user text-xl"></i>
              </Link>
              <button
                onClick={handleSignOut}
                className="bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700 text-sm"
              >
                Cerrar Sesión
              </button>
            </div>
          ) : (
            <Link
              href="/auth"
              className="bg-red-600 text-white px-6 py-2 rounded-full hover:bg-red-700"
            >
              Iniciar Sesión
            </Link>
          )}
        </div>
      </nav>

      {/* Mobile Bottom Navbar */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 z-40">
        <div className="flex justify-around items-center py-3">
          {/* Home */}
          <Link 
            href="/" 
            className={`flex flex-col items-center p-2 ${
              isActive('/') ? 'text-red-600' : 'text-gray-600'
            }`}
          >
            <i className="fas fa-home text-xl mb-1"></i>
            <span className="text-xs">Inicio</span>
          </Link>

          {/* Search */}
          <Link 
            href="/search" 
            className={`flex flex-col items-center p-2 ${
              isActive('/search') ? 'text-red-600' : 'text-gray-600'
            }`}
          >
            <i className="fas fa-search text-xl mb-1"></i>
            <span className="text-xs">Buscar</span>
          </Link>

          {/* Create Pin */}
          <Link 
            href="/create-pin" 
            className={`flex flex-col items-center p-2 ${
              isActive('/create-pin') ? 'text-red-600' : 'text-gray-600'
            }`}
          >
            <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center -mt-6 mb-1 shadow-lg">
              <i className="fas fa-plus text-white text-lg"></i>
            </div>
            <span className="text-xs">Crear</span>
          </Link>

          {/* Profile */}
          {user ? (
            <Link 
              href="/profile" 
              className={`flex flex-col items-center p-2 ${
                isActive('/profile') ? 'text-red-600' : 'text-gray-600'
              }`}
            >
              <i className="fas fa-user text-xl mb-1"></i>
              <span className="text-xs">Perfil</span>
            </Link>
          ) : (
            <Link 
              href="/auth" 
              className={`flex flex-col items-center p-2 ${
                isActive('/auth') ? 'text-red-600' : 'text-gray-600'
              }`}
            >
              <i className="fas fa-sign-in-alt text-xl mb-1"></i>
              <span className="text-xs">Entrar</span>
            </Link>
          )}

          {/* Logout (solo si está logueado) */}
          {user && (
            <button 
              onClick={handleSignOut}
              className="flex flex-col items-center p-2 text-gray-600"
            >
              <i className="fas fa-sign-out-alt text-xl mb-1"></i>
              <span className="text-xs">Salir</span>
            </button>
          )}
        </div>
      </nav>

      {/* Mobile Top Bar (solo logo) */}
      <div className="md:hidden fixed top-0 left-0 w-full bg-white z-30 shadow-sm py-3 px-4">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-lg">M</span>
          </div>
          <span className="font-bold text-xl">Mariposas</span>
        </Link>
      </div>
    </>
  );
}