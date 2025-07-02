'use client';

import type { Course, Module } from '@/lib/types';
import { useFormStatus } from 'react-dom';
import { useEffect, useActionState, useState, useMemo } from 'react';
import { saveCourse } from '@/actions/course-actions';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Loader2, ChevronsUpDown, Check } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';

interface CourseFormProps {
  course: Course | null;
  modules: Module[];
}

function SubmitButton({ isNew }: { isNew: boolean }) {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending}>
            {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isNew ? 'Criar Curso' : 'Salvar Alterações'}
        </Button>
    );
}

// Helper function to format seconds into "hh:mm:ss"
const formatSecondsToHHMMSS = (totalSeconds: number | undefined) => {
    if (totalSeconds === undefined || totalSeconds === null || totalSeconds < 0) return '';
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const pad = (num: number) => num.toString().padStart(2, '0');

    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
};


export function CourseForm({ course, modules }: CourseFormProps) {
  const isNew = course === null;
  const router = useRouter();
  const { toast } = useToast();

  const initialState = { message: '', errors: {}, success: false };
  const [state, dispatch] = useActionState(saveCourse, initialState);

  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(course?.moduleId ?? null);
  const [selectedTrackId, setSelectedTrackId] = useState<string | null>(course?.trackId ?? null);
  const [popoverOpen, setPopoverOpen] = useState(false);

  const availableTracks = useMemo(() => {
    if (!selectedModuleId) return [];
    const module = modules.find(m => m.id === selectedModuleId);
    return module?.tracks ?? [];
  }, [selectedModuleId, modules]);

  // When selected module changes, reset selected track if it's not in the new list
  useEffect(() => {
    if (selectedTrackId && !availableTracks.some(t => t.id === selectedTrackId)) {
        setSelectedTrackId(null);
    }
  }, [selectedModuleId, availableTracks, selectedTrackId]);


  useEffect(() => {
    if (state.success) {
      toast({
        title: "Sucesso!",
        description: state.message,
      });
      router.push('/admin/courses');
    } else if (state.message && !state.success && state.errors && Object.keys(state.errors).length > 0) {
       toast({
        variant: "destructive",
        title: "Erro de Validação",
        description: state.message,
      });
    } else if (state.message && !state.success) {
       toast({
        variant: "destructive",
        title: "Ocorreu um Erro",
        description: state.message,
      });
    }
  }, [state, toast, router]);
  
  return (
    <form action={dispatch} className="space-y-6">
      {!isNew && <input type="hidden" name="id" value={course.id} />}
      
      {isNew && (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="moduleId">Módulo</Label>
                <Select
                    onValueChange={(value) => {
                        setSelectedModuleId(value);
                    }}
                    defaultValue={selectedModuleId ?? ""}
                    required
                >
                    <SelectTrigger id="moduleId">
                        <SelectValue placeholder="Primeiro, selecione um módulo" />
                    </SelectTrigger>
                    <SelectContent>
                        {modules.map(module => (
                            <SelectItem key={module.id} value={module.id}>
                                {module.title}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            
            <div className="space-y-2">
                <Label htmlFor="trackId">Trilha de Aprendizagem</Label>
                <input type="hidden" name="trackId" value={selectedTrackId ?? ''} />
                <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                    <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={popoverOpen}
                        className="w-full justify-between"
                        disabled={!selectedModuleId}
                    >
                        {selectedTrackId
                        ? availableTracks.find((track) => track.id === selectedTrackId)?.title
                        : "Depois, selecione a trilha..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                        <Command>
                            <CommandInput placeholder="Filtrar trilha..." />
                            <CommandList>
                                <CommandEmpty>Nenhuma trilha encontrada.</CommandEmpty>
                                <CommandGroup>
                                    {availableTracks.map((track) => (
                                    <CommandItem
                                        key={track.id}
                                        value={track.title}
                                        onSelect={() => {
                                            setSelectedTrackId(track.id);
                                            setPopoverOpen(false);
                                        }}
                                    >
                                        <Check
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                selectedTrackId === track.id ? "opacity-100" : "opacity-0"
                                            )}
                                        />
                                        {track.title}
                                    </CommandItem>
                                    ))}
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
                {state.errors?.trackId && <p className="text-sm text-destructive">{state.errors.trackId[0]}</p>}
            </div>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="title">Título do Curso</Label>
        <Input 
          id="title" 
          name="title"
          defaultValue={course?.title}
          placeholder="Ex: Introdução à Segurança no Trabalho" 
          required 
        />
        {state.errors?.title && <p className="text-sm text-destructive">{state.errors.title[0]}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descrição</Label>
        <Textarea 
          id="description" 
          name="description"
          defaultValue={course?.description}
          placeholder="Descreva o conteúdo e os objetivos do curso."
          required
          rows={4}
        />
        {state.errors?.description && <p className="text-sm text-destructive">{state.errors.description[0]}</p>}
      </div>

       <div className="space-y-2">
        <Label htmlFor="videoUrl">URL do Vídeo</Label>
        <Input 
          id="videoUrl" 
          name="videoUrl"
          type="url"
          defaultValue={course?.videoUrl}
          placeholder="https://exemplo.com/video"
          required
        />
        {state.errors?.videoUrl && <p className="text-sm text-destructive">{state.errors.videoUrl[0]}</p>}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="duration">Duração (hh:mm:ss)</Label>
        <Input 
          id="duration" 
          name="duration"
          type="text"
          defaultValue={formatSecondsToHHMMSS(course?.durationInSeconds)}
          placeholder="Ex: 00:05:00"
        />
        {state.errors?.duration && <p className="text-sm text-destructive">{state.errors.duration[0]}</p>}
      </div>


      <div className="flex justify-end gap-4">
        <Button variant="outline" type="button" onClick={() => router.back()}>Cancelar</Button>
        <SubmitButton isNew={isNew} />
      </div>
    </form>
  );
}
