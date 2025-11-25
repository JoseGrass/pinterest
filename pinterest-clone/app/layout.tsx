import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
import Header from './components/Header' // Asegúrate de la ruta
import BottomNav from './components/BottomNav' // Menú inferior solo en mobile

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Pinterest Clone',
  description: 'A Pinterest clone built with Next.js and Supabase',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </head>
      <body className={inter.className + ' bg-gray-50'}>
        <AuthProvider>
          <Header /> {/* Barra superior siempre visible */}
          <div className="pt-20 min-h-screen"> {/* Deja espacio debajo del header fijo */}
            {children}
          </div>
          <BottomNav /> {/* Siempre visible en móvil por 'md:hidden' */}
        </AuthProvider>
      </body>
    </html>
  )
}
