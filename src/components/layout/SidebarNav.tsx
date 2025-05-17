
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
import { PackageOpen } from 'lucide-react';
import { navItems } from '@/config/nav'; // Import from centralized config

export default function SidebarNav() {
  const pathname = usePathname();

  return (
    // The Sidebar component is already configured to be hidden on mobile (md:block)
    // and collapsible on desktop.
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4 flex items-center group-data-[collapsible=icon]:justify-center">
        <Link href="/" className="flex items-center text-xl font-semibold text-sidebar-foreground">
          <PackageOpen className="h-7 w-7 shrink-0" />
          <span className="ml-2 group-data-[collapsible=icon]:hidden">NuevoEnvios</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item, index) => {
            if (item.type === 'separator') {
              return <SidebarMenuItem key={`sep-desktop-${index}-${item.section || 'default'}`} className="my-1"><hr className="border-sidebar-border group-data-[collapsible=icon]:mx-2 mx-4" /></SidebarMenuItem>;
            }
            if (item.type === 'label') {
              return (
                <SidebarMenuItem key={`label-desktop-${index}-${item.section || 'default'}`} className="px-2 group-data-[collapsible=icon]:hidden">
                  <span className="text-xs font-semibold text-sidebar-foreground/70 ">{item.label}</span>
                </SidebarMenuItem>
              );
            }
            if (!item.href || !item.icon) return null;
            const Icon = item.icon;
            return (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href} passHref legacyBehavior>
                  <SidebarMenuButton
                    isActive={pathname === item.href}
                    tooltip={item.label}
                    className="justify-start"
                  >
                    <Icon className="h-5 w-5 shrink-0" />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
