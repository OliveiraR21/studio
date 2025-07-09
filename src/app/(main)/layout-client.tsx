'use client';

import {
  BookMarked,
  HelpCircle,
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
import type { User } from '@/lib/types';
import { NotificationBell } from '@/components/layout/notification-bell';
import { OnboardingTour } from '@/components/layout/onboarding-tour';
import { TourProvider } from '@/hooks/use-tour';
import { GlobalSearch } from '@/components/layout/global-search';

// Helper to create a slug for data attributes
const toSlug = (str: string) => str.toLowerCase().replace(/\s+/g, '-');

// Nav Item Component to reduce repetition
const NavItem = ({ href, icon: Icon, label, pathname }: { href: string; icon: React.ElementType, label: string; pathname: string }) => {
  const isActive = pathname.startsWith(href);
  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        tooltip={label}
        isActive={isActive}
        data-tour-id={toSlug(label)}
      >
        <Link href={href}>
          <Icon />
          <span>{label}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};


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

  const helpNavItem = {
    href: '/help',
    icon: HelpCircle,
    label: 'Preciso de Ajuda',
  };

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

  const isManager = userRole && managerRoles.includes(userRole);
  const isAdmin = userRole === 'Admin';


  if (!user) {
    return null;
  }

  return (
    <TourProvider>
      <SidebarProvider>
        <Sidebar collapsible="icon">
          <SidebarHeader>
            <Logo />
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {baseNavItems.map((item) => (
                <NavItem key={item.label} {...item} pathname={pathname} />
              ))}

              {(isManager || isAdmin) && (
                <NavItem {...teamNavItem} pathname={pathname} />
              )}
              
              {isAdmin && (
                <div data-tour-id="area-de-administracao">
                   {adminNavItems.map((item) => (
                    <NavItem key={item.label} {...item} pathname={pathname} />
                  ))}
                </div>
              )}

              <NavItem {...helpNavItem} pathname={pathname} />

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
            <GlobalSearch />
            <NotificationBell />
            <ThemeToggle />
            <UserNav user={user} />
          </header>
          <div className="flex-1 p-4 lg:p-6 bg-muted/20">
            <OnboardingTour user={user} />
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </TourProvider>
  );
}
