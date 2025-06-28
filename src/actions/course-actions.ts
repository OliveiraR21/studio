'use server';

import { z } from 'zod';
import { createCourse, updateCourse } from '@/lib/data-access';
import { revalidatePath } from 'next/cache';
import type { Course } from '@/lib/types';
import { redirect } from 'next/navigation';

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

  const { id, ...courseData } = validatedFields.data;

  try {
    if (id) {
      await updateCourse(id, courseData);
    } else {
      // This is a simplified version. In a real scenario, you'd also
      // need to associate the new course with a track.
      // For now, it creates an "orphan" course.
      await createCourse(courseData as Omit<Course, 'id'>);
    }
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : 'Ocorreu um erro desconhecido.';
    return { success: false, message: `Falha ao salvar o curso: ${errorMessage}`, errors: {} };
  }

  revalidatePath('/admin/courses');
  // Redirecting is handled on the client-side useEffect for better UX with toasts
  
  return { success: true, message: `Curso "${courseData.title}" salvo com sucesso!` };
}
