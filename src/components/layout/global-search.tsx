
'use client';

import { useCallback, useEffect, useState } from 'react';
import { File, Loader2, Search, AppWindow, Home, LayoutGrid, User as UserIcon, Settings, HelpCircle, Users, UserCog, Network, BookMarked, BarChart, Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useDebounce } from '@/hooks/use-debounce';

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import { globalSearch, type SearchResult, type IconName } from '@/actions/search-actions';
import { Skeleton } from '../ui/skeleton';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

const iconMap: Record<IconName, React.ElementType> = {
  Home,
  LayoutGrid,
  UserIcon,
  Settings,
  HelpCircle,
  Users,
  UserCog,
  Network,
  BookMarked,
  BarChart,
  File,
  Lock,
};


export function GlobalSearch() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === 'k' && (e.metaKey || e.ctrlKey))) {
        e.preventDefault();
        setIsOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  useEffect(() => {
    const fetchResults = async () => {
      if (debouncedQuery.length < 2) {
        setResults([]);
        return;
      }
      setIsLoading(true);
      try {
        const searchResults = await globalSearch(debouncedQuery);
        setResults(searchResults);
      } catch (error) {
        console.error('Search failed:', error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [debouncedQuery]);

  const runCommand = useCallback((command: () => unknown) => {
    setIsOpen(false);
    command();
  }, []);

  const pageResults = results.filter((r) => r.type === 'page');
  const courseResults = results.filter((r) => r.type === 'course');

  return (
    <>
      <Button
        variant="outline"
        className="relative h-10 w-full max-w-md lg:max-w-lg justify-start text-sm text-muted-foreground bg-card dark:bg-muted/50 hover:bg-muted/80 rounded-full"
        onClick={() => setIsOpen(true)}
      >
        <div className="flex items-center gap-2 pl-2">
            <Search className="h-4 w-4" />
            <span>Pesquisar...</span>
        </div>
        <kbd className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 hidden h-6 select-none items-center gap-1 rounded border bg-background px-2 font-mono text-xs font-medium text-muted-foreground opacity-100 sm:flex">
          Ctrl+K
        </kbd>
      </Button>
      <CommandDialog open={isOpen} onOpenChange={setIsOpen}>
        <div className="flex items-center gap-2 border-b bg-muted/50 px-3">
            <Avatar className="h-10 w-10">
                <AvatarImage src="/supply-avatar-face.png" alt="Supply Avatar" data-ai-hint="mascot avatar" />
                <AvatarFallback>S</AvatarFallback>
            </Avatar>
            <CommandInput
            placeholder="Pesquisar por cursos, páginas e mais..."
            value={query}
            onValueChange={setQuery}
            className="border-0 bg-transparent h-12 focus-visible:ring-0"
            />
        </div>
        <CommandList>
          {isLoading && (
            <div className="p-2 space-y-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
            </div>
          )}
          {!isLoading && !results.length && debouncedQuery.length > 1 && (
            <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
          )}
          {!isLoading && results.length > 0 && (
            <>
              {pageResults.length > 0 && (
                 <CommandGroup heading="Navegação">
                  {pageResults.map((result) => {
                    if (result.type === 'page') {
                      const Icon = iconMap[result.iconName];
                      return (
                        <CommandItem
                          key={result.href}
                          value={result.title}
                          onSelect={() => runCommand(() => router.push(result.href))}
                          className="!py-2"
                        >
                          <Icon className="mr-2 h-4 w-4" />
                          <span>{result.title}</span>
                        </CommandItem>
                      )
                    }
                    return null;
                  })}
                 </CommandGroup>
              )}
              {pageResults.length > 0 && courseResults.length > 0 && <CommandSeparator />}
              {courseResults.length > 0 && (
                 <CommandGroup heading="Cursos">
                  {courseResults.map((result) => {
                    if (result.type === 'course') {
                        const { course, track, isLocked, prerequisiteCourseTitle, prerequisiteCourseId } = result;
                        const Icon = isLocked ? iconMap['Lock'] : iconMap['File'];
                        return (
                          <CommandItem
                            key={course.id}
                            value={course.title}
                            onSelect={() => {
                                if (!isLocked) {
                                    runCommand(() => router.push(`/courses/${course.id}`))
                                }
                            }}
                            className={cn("!py-2 flex-col items-start", isLocked && "text-muted-foreground cursor-default")}
                          >
                            <div className="flex items-center">
                              <Icon className="mr-2 h-4 w-4" />
                              <div className="flex flex-col">
                                <span>{course.title}</span>
                                <span className="text-xs text-muted-foreground">{track.title}</span>
                              </div>
                            </div>
                            {isLocked && prerequisiteCourseTitle && (
                                <div className="text-xs text-muted-foreground ml-6 mt-1">
                                    Para liberar, conclua:{" "}
                                    <Link 
                                        href={`/courses/${prerequisiteCourseId}`} 
                                        className="underline font-semibold text-primary hover:text-primary/80"
                                        onClick={() => runCommand(() => router.push(`/courses/${prerequisiteCourseId}`))}
                                    >
                                        {prerequisiteCourseTitle}
                                    </Link>
                                </div>
                            )}
                          </CommandItem>
                        );
                    }
                    return null;
                  })}
                </CommandGroup>
              )}
            </>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}
