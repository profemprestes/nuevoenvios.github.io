
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
import { LayoutDashboard, Send, Truck, GitFork, PackageOpen, Users, Archive, PlusCircle } from 'lucide-react';

// Los iconos de Lucide React ya están en uso y son una excelente opción.
// Otras librerías como Font Awesome o Material Icons podrían usarse si se prefiere una estética diferente,
// pero Lucide es moderno, ligero y consistente con ShadCN.

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard, section: "general" },
  { type: 'separator', section: "solicitudes" },
  { type: 'label', label: 'Gestión de Envíos', section: "solicitudes" },
  { href: '/mensajeria', label: 'Mensajería', icon: Send, section: "solicitudes" },
  { href: '/delivery', label: 'Delivery', icon: Truck, section: "solicitudes" },
  { href: '/envios-flex', label: 'Envíos Flex', icon: GitFork, section: "solicitudes" },
  // Ejemplo de cómo podrías añadir más secciones CRUD
  // { type: 'separator', section: "admin" },
  // { type: 'label', label: 'Administración', section: "admin" },
  // { href: '/usuarios', label: 'Usuarios', icon: Users, section: "admin" },
  // { href: '/productos', label: 'Productos', icon: Archive, section: "admin" },
];

// Un posible ítem para "Crear Nuevo" que podría llevar a una página general de creación o ser más específico.
// Generalmente, los botones de "Crear" son más contextuales dentro de cada vista de lista del CRUD.
// const commonCrudActions = [
//   { href: '/solicitudes/nuevo', label: 'Nueva Solicitud', icon: PlusCircle, section: "actions" }
// ];

export default function SidebarNav() {
  const pathname = usePathname();

  return (
    // El componente Sidebar maneja la responsividad:
    // - collapsible="icon": En desktop, se colapsa a iconos con tooltips.
    // - En móvil (controlado por useIsMobile en ui/sidebar.tsx), se convierte en un Sheet (panel deslizable).
    // El diseño (animaciones, transiciones, fondo) es personalizable vía CSS variables en globals.css.
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4 flex items-center hidden md:flex group-data-[collapsible=icon]:justify-center">
        {/* Logo y título de la aplicación. El texto se oculta en modo icono. */}
        <Link href="/" className="flex items-center text-xl font-semibold text-sidebar-foreground">
          <PackageOpen className="h-7 w-7 shrink-0" />
          {/* El span se oculta cuando el sidebar está en modo icono en desktop */}
          <span className="ml-2 group-data-[collapsible=icon]:hidden">NuevoEnvios</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item, index) => {
            if (item.type === 'separator') {
              return <SidebarMenuItem key={`sep-${index}`} className="my-1"><hr className="border-sidebar-border group-data-[collapsible=icon]:mx-2 mx-4" /></SidebarMenuItem>;
            }
            if (item.type === 'label') {
              return (
                <SidebarMenuItem key={`label-${index}`} className="px-2 group-data-[collapsible=icon]:hidden">
                  <span className="text-xs font-semibold text-sidebar-foreground/70 ">{item.label}</span>
                </SidebarMenuItem>
              );
            }
            return (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href as string} passHref legacyBehavior>
                  <SidebarMenuButton
                    // El estado activo resalta el elemento del menú actual.
                    isActive={pathname === item.href}
                    // Tooltip se muestra cuando está en modo icono.
                    tooltip={item.label}
                    className="justify-start"
                  >
                    <item.icon className="h-5 w-5 shrink-0" />
                    {/* El texto del label se muestra normalmente y se usa para el tooltip en modo icono */}
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
        {/* 
        Si quieres un botón "Crear Nuevo" global en el sidebar:
        <SidebarMenu className="mt-auto pt-2 border-t border-sidebar-border group-data-[collapsible=icon]:border-none">
           {commonCrudActions.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href} passHref legacyBehavior>
                <SidebarMenuButton
                  isActive={pathname === item.href}
                  tooltip={item.label}
                  className="justify-start text-sidebar-primary hover:bg-sidebar-primary/10"
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
        */}
      </SidebarContent>
    </Sidebar>
  );
}
