
"use client";
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PackageOpen, Menu } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile'; // Assuming you have this hook
import MobileNav from './MobileNav'; 

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  // Effect to close mobile menu if window is resized to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && isMobileMenuOpen) { // 768px is md breakpoint
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobileMenuOpen]);

  // Effect to disable body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = ''; // Cleanup on unmount
    };
  }, [isMobileMenuOpen]);


  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/95 px-4 shadow-sm backdrop-blur-md md:px-6">
        <div className="flex items-center gap-2">
          {/* Hamburger menu button, only visible on mobile */}
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Abrir menú de navegación"
              className="md:hidden -ml-2 mr-1" // Adjust margins for better spacing
            >
              <Menu className="h-6 w-6" />
            </Button>
          )}
          <Link href="/" className="flex items-center gap-2 text-xl font-semibold text-primary">
            <PackageOpen className="h-7 w-7 text-primary" />
            {/* Hide text on very small screens if necessary, or adjust overall header layout */}
            <span className="hidden sm:inline">NuevoEnvios</span> 
          </Link>
        </div>
        {/* Placeholder for user menu or other actions */}
        {/* <Button variant="outline" size="sm">Sign In</Button> */}
      </header>
      {/* Render MobileNav, controlled by isMobileMenuOpen and only if isMobile is true */}
      {isMobile && <MobileNav isOpen={isMobileMenuOpen} setIsOpen={setIsMobileMenuOpen} />}
    </>
  );
}
