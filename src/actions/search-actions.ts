'use server';

import { getCurrentUser } from '@/lib/auth';
import { getLearningModules } from '@/lib/data-access';
import { userHasCourseAccess } from '@/lib/access-control';
import type { Course, Track, Module } from '@/lib/types';

export type SearchResult = {
  course: Course;
  track: Track;
  module: Module;
};

export async function globalSearch(query: string): Promise<SearchResult[]> {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return [];
  }

  if (!query || query.trim().length < 2) {
    return [];
  }

  const modules = await getLearningModules();
  const results: SearchResult[] = [];
  const lowerCaseQuery = query.toLowerCase();

  for (const module of modules) {
    for (const track of module.tracks) {
      for (const course of track.courses) {
        if (userHasCourseAccess(currentUser, course)) {
          const titleMatch = course.title.toLowerCase().includes(lowerCaseQuery);
          const descriptionMatch = course.description.toLowerCase().includes(lowerCaseQuery);

          if (titleMatch || descriptionMatch) {
            results.push({ course, track, module });
          }
        }
      }
    }
  }

  return results;
}
