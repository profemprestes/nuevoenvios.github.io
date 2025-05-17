
// src/components/layout/MobileNav.tsx
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { X, PackageOpen } from 'lucide-react';
import { navItems, type NavItemConfig } from '@/config/nav'; // Import from centralized config
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface MobileNavProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function MobileNav({ isOpen, setIsOpen }: MobileNavProps) {
  const pathname = usePathname();

  // Uses data-state for CSS animations from globals.css if you add them
  // e.g. data-[state=open]:animate-in data-[state=open]:fade-in-0
  // data-[state=closed]:animate-out data-[state=closed]:fade-out-0
  return (
    <div
      className={cn(
        "fixed inset-0 z-40 flex flex-col bg-background/95 backdrop-blur-sm transition-opacity duration-300 ease-in-out md:hidden",
        isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      )}
      // data-state={isOpen ? "open" : "closed"} // For CSS keyframe animations
    >
      <div className="flex items-center justify-between border-b px-4 py-3.5"> {/* Adjusted padding slightly */}
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold text-primary" onClick={() => setIsOpen(false)}>
          <PackageOpen className="h-6 w-6 text-primary" /> {/* Adjusted icon size */}
          <span>NuevoEnvios</span>
        </Link>
        <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} aria-label="Close menu">
          <X className="h-6 w-6" />
        </Button>
      </div>
      <ScrollArea className="flex-1 pt-2"> {/* Added pt-2 for spacing */}
        <nav className="grid gap-1 p-4"> {/* Reduced gap slightly */}
          {navItems.map((item, index) => {
            if (item.type === 'separator') {
              return <hr key={`sep-mobile-${index}-${item.section || 'default'}`} className="my-2 border-border" />;
            }
            if (item.type === 'label') {
              return (
                <span key={`label-mobile-${index}-${item.section || 'default'}`} className="mt-2 px-2 py-1 text-xs font-medium uppercase text-muted-foreground">
                  {item.label}
                </span>
              );
            }
            if (!item.href || !item.icon) return null;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-3 text-base font-medium transition-colors hover:bg-accent/80 hover:text-accent-foreground", // Adjusted padding and text size
                  pathname === item.href ? "bg-accent text-accent-foreground" : "text-foreground hover:bg-muted"
                )}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </ScrollArea>
      <div className="p-4 border-t">
        <Button variant="outline" className="w-full" onClick={() => setIsOpen(false)}>
          Cerrar Menú
        </Button>
      </div>
    </div>
  );
}
