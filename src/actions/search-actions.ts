'use server';

import type { User, Course, Track, Module, UserRole } from '@/lib/types';
import { getCurrentUser } from '@/lib/auth';
import { getLearningModules } from '@/lib/data-access';
import { userHasCourseAccess } from '@/lib/access-control';

export type IconName = 'Home' | 'LayoutGrid' | 'UserIcon' | 'Settings' | 'HelpCircle' | 'Users' | 'UserCog' | 'Network' | 'BookMarked' | 'BarChart' | 'File';

// Define a result type that can be either a course or a navigation item
export type SearchResult = 
  | { type: 'course'; course: Course; track: Track; module: Module }
  | { type: 'page'; title: string; href: string; iconName: IconName };


// Define available static pages for searching
const getAvailablePages = (user: User): Omit<SearchResult, 'type' | 'course' | 'track' | 'module'>[] => {
    const pages: { title: string; href: string, iconName: IconName, requiredRole?: UserRole[], managerOnly?: boolean }[] = [
        { title: 'Meu Painel', href: '/dashboard', iconName: 'Home' },
        { title: 'Meus Cursos', href: '/meus-cursos', iconName: 'LayoutGrid' },
        { title: 'Meu Perfil', href: '/profile', iconName: 'UserIcon' },
        { title: 'Configurações', href: '/settings', iconName: 'Settings' },
        { title: 'Preciso de Ajuda', href: '/help', iconName: 'HelpCircle' },
        { title: 'Minha Equipe', href: '/team', iconName: 'Users', managerOnly: true },
        { title: 'Gerenciamento de Usuários', href: '/admin/users', iconName: 'UserCog', requiredRole: ['Admin'] },
        { title: 'Gerenciamento de Trilhas', href: '/admin/tracks', iconName: 'Network', requiredRole: ['Admin'] },
        { title: 'Gerenciamento de Cursos', href: '/admin/courses', iconName: 'BookMarked', requiredRole: ['Admin'] },
        { title: 'Relatórios', href: '/admin/reports', iconName: 'BarChart', requiredRole: ['Admin'] },
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
