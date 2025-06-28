'use client';

import {
  BookMarked,
  Home,
  LayoutGrid,
  Network,
  UserCog,
  Users,
} from 'lucide-react';
import Link from 'next/link';

import { Logo } from '@/components/layout/logo';
import { ThemeToggle } from '@/components/layout/theme-toggle';
import { UserNav } from '@/components/layout/user-nav';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  // In a real app, user role would come from an auth session.
  // We simulate a 'Gerente' to show the new "Minha Equipe" menu.
  const userRole = 'Gerente';

  const baseNavItems = [
    { href: '/dashboard', icon: Home, label: 'Meu Painel' },
    { href: '/meus-cursos', icon: LayoutGrid, label: 'Meus Cursos' },
  ];

  const managerRoles = ['Supervisor', 'Coordenador', 'Gerente', 'Diretor'];
  const teamNavItem = { href: '/team', icon: Users, label: 'Minha Equipe' };

  const adminNavItems = [
    { href: '/admin/users', icon: UserCog, label: 'Gerenciamento de Usuários' },
    { href: '/admin/tracks', icon: Network, label: 'Gerenciamento de Trilhas' },
    {
      href: '/admin/courses',
      icon: BookMarked,
      label: 'Gerenciamento de Cursos',
    },
  ];

  const allNavItems = [...baseNavItems];

  // Add "Minha Equipe" for managers and admin
  if (managerRoles.includes(userRole) || userRole === 'Admin') {
    allNavItems.push(teamNavItem);
  }

  // Add Admin items only for Admin
  if (userRole === 'Admin') {
    allNavItems.push(...adminNavItems);
  }

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <Logo />
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {allNavItems.map((item) => (
              <SidebarMenuItem key={item.label}>
                <SidebarMenuButton asChild tooltip={item.label}>
                  <Link href={item.href}>
                    <item.icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <SidebarTrigger />
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center gap-4 border-b bg-background px-4 lg:h-[60px] lg:px-6">
          <SidebarTrigger className="md:hidden" />
          <div className="w-full flex-1">
            {/* Future search bar can go here */}
          </div>
          <ThemeToggle />
          <UserNav />
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 overflow-auto bg-muted/20">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
