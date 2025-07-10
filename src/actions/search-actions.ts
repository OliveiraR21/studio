'use server';

import type { User, Course, Track, Module } from '@/lib/types';
import { getCurrentUser } from '@/lib/auth';
import { getLearningModules } from '@/lib/data-access';
import { userHasCourseAccess } from '@/lib/access-control';
import {
    BarChart,
    BookMarked,
    File,
    HelpCircle,
    Home,
    LayoutGrid,
    Network,
    UserCog,
    Users,
    Settings,
    User as UserIcon,
} from 'lucide-react';


// Define a result type that can be either a course or a navigation item
export type SearchResult = 
  | { type: 'course'; course: Course; track: Track; module: Module }
  | { type: 'page'; title: string; href: string; icon: React.ElementType };


// Define available static pages for searching
const getAvailablePages = (user: User): Omit<SearchResult, 'type'>[] => {
    const pages: { title: string; href: string, icon: React.ElementType, requiredRole?: UserRole[], managerOnly?: boolean }[] = [
        { title: 'Meu Painel', href: '/dashboard', icon: Home },
        { title: 'Meus Cursos', href: '/meus-cursos', icon: LayoutGrid },
        { title: 'Meu Perfil', href: '/profile', icon: UserIcon },
        { title: 'Configurações', href: '/settings', icon: Settings },
        { title: 'Preciso de Ajuda', href: '/help', icon: HelpCircle },
        { title: 'Minha Equipe', href: '/team', icon: Users, managerOnly: true },
        { title: 'Gerenciamento de Usuários', href: '/admin/users', icon: UserCog, requiredRole: ['Admin'] },
        { title: 'Gerenciamento de Trilhas', href: '/admin/tracks', icon: Network, requiredRole: ['Admin'] },
        { title: 'Gerenciamento de Cursos', href: '/admin/courses', icon: BookMarked, requiredRole: ['Admin'] },
        { title: 'Relatórios', href: '/admin/reports', icon: BarChart, requiredRole: ['Admin'] },
    ];
    
    const managerRoles = ['Supervisor', 'Coordenador', 'Gerente', 'Diretor'];

    return pages
        .filter(page => {
            if (page.requiredRole) {
                return page.requiredRole.includes(user.role);
            }
            if (page.managerOnly) {
                return user.role === 'Admin' || managerRoles.includes(user.role);
            }
            return true;
        })
        .map(({ requiredRole, managerOnly, ...page }) => page);
};

export async function globalSearch(query: string): Promise<SearchResult[]> {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return [];
  }

  if (!query || query.trim().length < 2) {
    return [];
  }

  const results: SearchResult[] = [];
  const lowerCaseQuery = query.toLowerCase();

  // Search Courses
  const modules = await getLearningModules();
  for (const module of modules) {
    for (const track of module.tracks) {
      for (const course of track.courses) {
        if (userHasCourseAccess(currentUser, course)) {
          const titleMatch = course.title.toLowerCase().includes(lowerCaseQuery);
          const descriptionMatch = course.description.toLowerCase().includes(lowerCaseQuery);

          if (titleMatch || descriptionMatch) {
            results.push({ type: 'course', course, track, module });
          }
        }
      }
    }
  }

  // Search Pages
  const availablePages = getAvailablePages(currentUser);
  for (const page of availablePages) {
      if (page.title.toLowerCase().includes(lowerCaseQuery)) {
          results.push({ type: 'page', ...page });
      }
  }

  return results;
}
