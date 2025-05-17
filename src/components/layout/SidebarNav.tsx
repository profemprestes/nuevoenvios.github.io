"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { LayoutDashboard, Send, Truck, GitFork, PackageOpen } from 'lucide-react';

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/mensajeria', label: 'Mensajería', icon: Send },
  { href: '/delivery', label: 'Delivery', icon: Truck },
  { href: '/envios-flex', label: 'Envíos Flex', icon: GitFork },
];

export default function SidebarNav() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4 justify-center items-center hidden md:flex">
         <Link href="/" className="flex items-center gap-2 text-xl font-semibold text-sidebar-foreground">
          <PackageOpen className="h-7 w-7" />
          <span className="group-data-[collapsible=icon]:hidden">NuevoEnvios</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href} passHref legacyBehavior>
                <SidebarMenuButton
                  isActive={pathname === item.href}
                  tooltip={item.label}
                  className="justify-start"
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
