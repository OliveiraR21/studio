'use server';

import { z } from 'zod';
import { createCourse, updateCourse } from '@/lib/data-access';
import { revalidatePath } from 'next/cache';
import type { Course, Quiz } from '@/lib/types';

const courseFormSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3, 'O título precisa ter pelo menos 3 caracteres.'),
  description: z.string().min(10, 'A descrição precisa ter pelo menos 10 caracteres.'),
  videoUrl: z.string().url('Por favor, insira uma URL válida.'),
  durationInMinutes: z.coerce.number().int().positive().optional(),
  trackId: z.string().optional(),
}).refine(data => {
    // If id is not present (new course), trackId must be present.
    return !!data.id || !!data.trackId;
}, {
    message: "É necessário selecionar uma trilha para um novo curso.",
    path: ["trackId"],
});


export type CourseFormState = {
  message: string;
  errors?: {
    title?: string[];
    description?: string[];
    videoUrl?: string[];
    durationInMinutes?: string[];
    trackId?: string[];
  };
  success: boolean;
};

export async function saveCourse(
  prevState: CourseFormState,
  formData: FormData
): Promise<CourseFormState> {
    
  const rawData = {
    id: formData.get('id') || undefined,
    title: formData.get('title'),
    description: formData.get('description'),
    videoUrl: formData.get('videoUrl'),
    durationInMinutes: formData.get('durationInMinutes') || undefined,
    trackId: formData.get('trackId') || undefined,
  };

  const validatedFields = courseFormSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Erro de validação. Por favor, corrija os campos.',
    };
  }

  const { id, trackId, ...courseDetails } = validatedFields.data;

  try {
    if (id) {
      // For updates, we don't change the trackId, so it's not passed.
      await updateCourse(id, courseDetails);
    } else {
      // The schema refinement ensures trackId is present for new courses.
      await createCourse({ trackId: trackId!, ...courseDetails });
    }
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : 'Ocorreu um erro desconhecido.';
    return { success: false, message: `Falha ao salvar o curso: ${errorMessage}`, errors: {} };
  }

  revalidatePath('/admin/courses');
  revalidatePath('/admin/tracks');
  
  return { success: true, message: `Curso "${validatedFields.data.title}" salvo com sucesso!` };
}

export async function saveQuiz(courseId: string, quiz: Quiz): Promise<{ success: boolean; message: string }> {
  if (!courseId) {
    return { success: false, message: "ID do curso não fornecido." };
  }
  
  try {
    // updateCourse updates a course in-memory.
    await updateCourse(courseId, { quiz });
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : 'Ocorreu um erro desconhecido.';
    return { success: false, message: `Falha ao salvar o questionário: ${errorMessage}` };
  }

  // Revalidate paths to ensure the UI updates with the new quiz data
  revalidatePath(`/admin/courses`);
  revalidatePath(`/admin/courses/${courseId}/edit`);
  
  return { success: true, message: 'Questionário salvo com sucesso!' };
}
