'use client';

import {
  BookMarked,
  Home,
  Network,
  UserCog,
} from 'lucide-react';
import Link from 'next/link';

import { Logo } from '@/components/layout/logo';
import { ThemeToggle } from '@/components/layout/theme-toggle';
import { UserNav } from '@/components/layout/user-nav';
import {
  Sidebar,
  SidebarContent,
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
  const userRole = 'Admin';

  const navItems = [{ href: '/dashboard', icon: Home, label: 'Meu Painel' }];

  const adminNavItems = [
    { href: '/admin/users', icon: UserCog, label: 'Gerenciamento de Usuários' },
    { href: '/admin/tracks', icon: Network, label: 'Gerenciamento de Trilhas' },
    {
      href: '/admin/courses',
      icon: BookMarked,
      label: 'Gerenciamento de Cursos',
    },
  ];

  const allNavItems = ['Admin', 'Gerente'].includes(userRole)
    ? [...navItems, ...adminNavItems]
    : navItems;

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
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center gap-4 border-b bg-background px-4 lg:h-[60px] lg:px-6">
          <SidebarTrigger />
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
