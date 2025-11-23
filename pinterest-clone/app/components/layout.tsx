// components/Layout.tsx
import { useState, ReactNode } from 'react';
import Navbar from './Navbar';
import MobileNav from './MobileNav';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [showMobileNav, setShowMobileNav] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      <Navbar onMobileMenuToggle={() => setShowMobileNav(!showMobileNav)} />
      {showMobileNav && <MobileNav onClose={() => setShowMobileNav(false)} />}
      <main className="pt-16 md:pt-20">
        {children}
      </main>
    </div>
  );
}