'use client';

import { useCallback, useEffect, useState } from 'react';
import { File, Loader2, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useDebounce } from '@/hooks/use-debounce';

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { globalSearch, type SearchResult } from '@/actions/search-actions';
import { Button } from '@/components/ui/button';
import { Skeleton } from '../ui/skeleton';

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

  return (
    <>
      <Button
        variant="ghost"
        className="h-9 w-9 rounded-full border hover:bg-primary/10 text-foreground hover:text-primary hover:border-primary focus-visible:ring-0 focus-visible:ring-offset-0"
        onClick={() => setIsOpen(true)}
      >
        <Search className="h-[1.2rem] w-[1.2rem]" />
        <span className="sr-only">Pesquisar</span>
      </Button>
      <CommandDialog open={isOpen} onOpenChange={setIsOpen}>
        <CommandInput
          placeholder="Pesquisar por cursos..."
          value={query}
          onValueChange={setQuery}
        />
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
            <CommandGroup heading="Cursos">
              {results.map(({ course, track }) => (
                <CommandItem
                  key={course.id}
                  value={course.title}
                  onSelect={() => {
                    runCommand(() => router.push(`/courses/${course.id}`));
                  }}
                  className="!py-2"
                >
                  <File className="mr-2 h-4 w-4" />
                  <div className="flex flex-col">
                    <span>{course.title}</span>
                    <span className="text-xs text-muted-foreground">{track.title}</span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}
