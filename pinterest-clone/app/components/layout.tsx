// components/Layout.tsx
import { ReactNode } from 'react';
import Navbar from './Navbar';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      {/* Ajustamos los paddings para móvil y desktop */}
      <main className="pt-16 pb-20 md:pb-0 md:pt-16">
        {children}
      </main>
    </div>
  );
}