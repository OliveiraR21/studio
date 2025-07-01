'use client';

import type { Course, Module } from '@/lib/types';
import { useFormStatus } from 'react-dom';
import { useActionState, useEffect } from 'react';
import { saveCourse } from '@/actions/course-actions';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup } from '@/components/ui/select';

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


export function CourseForm({ course, modules }: CourseFormProps) {
  const isNew = course === null;
  const router = useRouter();
  const { toast } = useToast();

  const initialState = { message: '', errors: {}, success: false };
  const [state, dispatch] = useActionState(saveCourse, initialState);

  useEffect(() => {
    if (state.success) {
      toast({
        title: "Sucesso!",
        description: state.message,
      });
      router.push('/admin/courses');
    } else if (state.message && !state.success && state.errors) {
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
        <div className="space-y-2">
            <Label htmlFor="trackId">Trilha de Aprendizagem</Label>
            <Select name="trackId" required>
                <SelectTrigger id="trackId">
                    <SelectValue placeholder="Selecione a trilha para este curso" />
                </SelectTrigger>
                <SelectContent>
                    {modules.map(module => (
                        <SelectGroup key={module.id}>
                            <Label className="px-2 py-1.5 text-sm font-semibold">{module.title}</Label>
                            {module.tracks.map(track => (
                                <SelectItem key={track.id} value={track.id}>
                                    {track.title}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    ))}
                </SelectContent>
            </Select>
            {state.errors?.trackId && <p className="text-sm text-destructive">{state.errors.trackId[0]}</p>}
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
        <Label htmlFor="durationInMinutes">Duração (minutos)</Label>
        <Input 
          id="durationInMinutes" 
          name="durationInMinutes"
          type="number"
          defaultValue={course?.durationInMinutes || ''}
          placeholder="Ex: 15"
        />
        {state.errors?.durationInMinutes && <p className="text-sm text-destructive">{state.errors.durationInMinutes[0]}</p>}
      </div>


      <div className="flex justify-end gap-4">
        <Button variant="outline" type="button" onClick={() => router.back()}>Cancelar</Button>
        <SubmitButton isNew={isNew} />
      </div>
    </form>
  );
}
