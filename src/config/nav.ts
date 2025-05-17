
// src/config/nav.ts
import type { LucideIcon } from 'lucide-react';
import { LayoutDashboard, Send, Truck, GitFork } from 'lucide-react';

export interface NavItemConfig {
  href?: string;
  label: string;
  icon?: LucideIcon;
  section?: string;
  type?: 'separator' | 'label';
}

export const navItems: NavItemConfig[] = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard, section: "general" },
  { type: 'separator', section: "solicitudes" as string },
  { type: 'label', label: 'Gestión de Envíos', section: "solicitudes" },
  { href: '/mensajeria', label: 'Mensajería', icon: Send, section: "solicitudes" },
  { href: '/delivery', label: 'Delivery', icon: Truck, section: "solicitudes" },
  { href: '/envios-flex', label: 'Envíos Flex', icon: GitFork, section: "solicitudes" },
  // Example of how you could add more sections CRUD
  // { type: 'separator', section: "admin" },
  // { type: 'label', label: 'Administración', section: "admin" },
  // { href: '/usuarios', label: 'Usuarios', icon: Users, section: "admin" },
  // { href: '/productos', label: 'Productos', icon: Archive, section: "admin" },
];
