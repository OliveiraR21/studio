'use server';

import { z } from 'zod';
import { findCourseById } from '@/lib/data';
import { revalidatePath } from 'next/cache';

const courseFormSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3, 'O título precisa ter pelo menos 3 caracteres.'),
  description: z.string().min(10, 'A descrição precisa ter pelo menos 10 caracteres.'),
  videoUrl: z.string().url('Por favor, insira uma URL válida.'),
});

export type CourseFormState = {
  message: string;
  errors?: {
    title?: string[];
    description?: string[];
    videoUrl?: string[];
  };
  success: boolean;
};

export async function saveCourse(
  prevState: CourseFormState,
  formData: FormData
): Promise<CourseFormState> {
    
  const validatedFields = courseFormSchema.safeParse({
    id: formData.get('id') || undefined,
    title: formData.get('title'),
    description: formData.get('description'),
    videoUrl: formData.get('videoUrl'),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Erro de validação. Por favor, corrija os campos.',
    };
  }

  const { id, title, description, videoUrl } = validatedFields.data;

  try {
    if (id) {
      console.log('--- ATUALIZANDO CURSO (SIMULAÇÃO) ---');
      console.log('ID:', id);
      const existingCourse = findCourseById(id);
      if (!existingCourse) {
        return { success: false, message: 'Curso não encontrado.', errors: {} };
      }
      console.log('Dados Antigos:', existingCourse.course);
      console.log('Novos Dados:', { title, description, videoUrl });
      console.log('------------------------------------');
    } else {
      const newId = `course-${Math.random().toString(36).substr(2, 9)}`;
      console.log('--- CRIANDO NOVO CURSO (SIMULAÇÃO) ---');
      console.log('Novo ID Gerado:', newId);
      console.log('Dados:', { title, description, videoUrl });
      console.log('-----------------------------------');
    }
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : 'Ocorreu um erro desconhecido.';
    return { success: false, message: `Falha ao salvar o curso: ${errorMessage}`, errors: {} };
  }

  revalidatePath('/admin/courses');
  
  return { success: true, message: `Curso "${title}" salvo com sucesso!` };
}
