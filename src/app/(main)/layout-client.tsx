'use client';

import {
  BookMarked,
  Home,
  LayoutGrid,
  LogOut,
  Network,
  UserCog,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

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
import type { User, UserRole } from '@/lib/types';
import { NotificationBell } from '@/components/layout/notification-bell';

export function MainLayoutClient({
  user,
  children,
}: {
  user: User;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const userRole = user?.role || null;

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

  if (userRole && (managerRoles.includes(userRole) || userRole === 'Admin')) {
    allNavItems.push(teamNavItem);
  }

  if (userRole && userRole === 'Admin') {
    allNavItems.push(...adminNavItems);
  }

  if (!user) {
    return null;
  }
  
  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <Logo />
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {allNavItems.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton asChild tooltip={item.label} isActive={isActive}>
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
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
          <NotificationBell />
          <ThemeToggle />
          <UserNav user={user} />
        </header>
        <div className="flex-1 p-4 lg:p-6 bg-muted/20">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
