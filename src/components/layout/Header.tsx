"use client";
import Link from 'next/link';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { PackageOpen } from 'lucide-react';

export default function Header() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/95 px-4 shadow-sm backdrop-blur-md md:px-6">
      <div className="flex items-center gap-2">
        <div className="md:hidden">
          <SidebarTrigger />
        </div>
        <Link href="/" className="flex items-center gap-2 text-xl font-semibold text-primary">
          <PackageOpen className="h-7 w-7 text-primary" />
          <span>NuevoEnvios</span>
        </Link>
      </div>
      {/* Placeholder for user menu or other actions */}
      {/* <Button variant="outline" size="sm">Sign In</Button> */}
    </header>
  );
}
