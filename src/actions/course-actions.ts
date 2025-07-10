
'use server';

import { z } from 'zod';
import { createCourse, updateCourse, findCourseById, getUserById, updateUser, deleteCourse } from '@/lib/data-access';
import { revalidatePath } from 'next/cache';
import type { Course, Quiz, UserRole } from '@/lib/types';
import { getSimulatedUserId } from '@/lib/auth';

// Helper to extract src from iframe
function extractSrcFromIframe(embedCode: string): string | null {
    const match = embedCode.match(/src="([^"]+)"/);
    return match ? match[1] : null;
}

const courseFormSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3, 'O título precisa ter pelo menos 3 caracteres.'),
  description: z.string().min(10, 'A descrição precisa ter pelo menos 10 caracteres.'),
  videoUrl: z.string().min(1, "A URL do vídeo ou código de incorporação é obrigatório."),
  thumbnailUrl: z.string().optional(),
  duration: z.string().optional()
    .refine((val) => {
        if (!val || val.trim() === '') return true; // Allow empty string
        return /^\d{1,2}:\d{2}:\d{2}$/.test(val);
    }, { message: "Formato de duração inválido. Use hh:mm:ss." })
    .refine((val) => {
        if (!val || val.trim() === '') return true;
        const parts = val.split(':').map(Number);
        return parts[1] < 60 && parts[2] < 60;
    }, { message: "Minutos e segundos devem ser menores que 60." }),
  trackId: z.string().optional(),
  minimumRole: z.enum(['', 'none', 'Assistente', 'Analista', 'Supervisor', 'Coordenador', 'Gerente', 'Diretor', 'Admin']).optional(),
  accessAreas: z.string().optional(),
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
    thumbnailUrl?: string[];
    duration?: string[];
    trackId?: string[];
    minimumRole?: string[];
    accessAreas?: string[];
  };
  success: boolean;
};

// Helper to convert 'hh:mm:ss' to seconds
function timeStringToSeconds(timeString: string | null | undefined): number | undefined {
  if (!timeString || timeString.trim() === '') return undefined;
  const parts = timeString.split(':').map(Number);
  if (parts.length !== 3 || parts.some(isNaN)) {
    return undefined;
  }
  return (parts[0] * 3600) + (parts[1] * 60) + (parts[2]);
}


export async function saveCourse(
  prevState: CourseFormState,
  formData: FormData
): Promise<CourseFormState> {
    
  const rawData = {
    id: formData.get('id') || undefined,
    title: formData.get('title'),
    description: formData.get('description'),
    videoUrl: formData.get('videoUrl'),
    thumbnailUrl: formData.get('thumbnailUrl'),
    duration: formData.get('duration'),
    trackId: formData.get('trackId') || undefined,
    minimumRole: formData.get('minimumRole'),
    accessAreas: formData.get('accessAreas'),
  };

  const validatedFields = courseFormSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Erro de validação. Por favor, corrija os campos.',
    };
  }

  const { id, trackId, duration, videoUrl: videoUrlOrEmbed, minimumRole, accessAreas, ...courseDetails } = validatedFields.data;

  let finalVideoUrl: string;
  const trimmedInput = (videoUrlOrEmbed || '').trim();

  if (trimmedInput.startsWith('<iframe')) {
    const extractedUrl = extractSrcFromIframe(trimmedInput);
    if (!extractedUrl) {
      return {
        success: false,
        errors: { videoUrl: ['Código de incorporação inválido. Não foi possível encontrar a URL (src) do vídeo.'] },
        message: 'Erro de validação. Verifique o código de incorporação.',
      };
    }
    finalVideoUrl = extractedUrl;
  } else {
    finalVideoUrl = trimmedInput;
  }
  
  const urlValidationResult = z.string().url({ message: "A URL do vídeo fornecida ou extraída não é válida." }).safeParse(finalVideoUrl);
  if (!urlValidationResult.success) {
      return {
          success: false,
          errors: { videoUrl: urlValidationResult.error.flatten().formErrors },
          message: 'Erro de validação. A URL do vídeo não é válida.'
      }
  }


  const courseData = {
    ...courseDetails,
    videoUrl: urlValidationResult.data, // Use validated and cleaned URL
    durationInSeconds: timeStringToSeconds(duration),
    minimumRole: minimumRole && minimumRole !== '' && minimumRole !== 'none' ? (minimumRole as UserRole) : undefined,
    accessAreas: accessAreas ? accessAreas.split(',').map(a => a.trim()).filter(Boolean) : undefined,
  };


  try {
    if (id) {
      // For updates, we don't change the trackId, so it's not passed.
      await updateCourse(id, courseData);
    } else {
      // The schema refinement ensures trackId is present for new courses.
      await createCourse({ trackId: trackId!, ...courseData });
    }
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : 'Ocorreu um erro desconhecido.';
    return { success: false, message: `Falha ao salvar o curso: ${errorMessage}`, errors: {} };
  }

  revalidatePath('/admin/courses');
  revalidatePath('/admin/tracks');
  revalidatePath('/dashboard');
  revalidatePath('/meus-cursos');
  
  return { success: true, message: `Curso "${validatedFields.data.title}" salvo com sucesso!` };
}

export async function saveQuiz(courseId: string, quiz: Quiz): Promise<{ success: boolean; message: string }> {
  if (!courseId) {
    return { success: false, message: "ID do curso não fornecido." };
  }
  
  try {
    await updateCourse(courseId, { quiz });
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : 'Ocorreu um erro desconhecido.';
    return { success: false, message: `Falha ao salvar o questionário: ${errorMessage}` };
  }

  // Revalidate all paths where course/quiz data is displayed to ensure UI consistency
  revalidatePath('/admin/courses');
  revalidatePath(`/admin/courses/${courseId}/edit`);
  revalidatePath('/dashboard');
  revalidatePath('/meus-cursos');
  revalidatePath(`/courses/${courseId}`);
  
  return { success: true, message: 'Questionário salvo com sucesso!' };
}

export async function recordCourseFeedback(
  courseId: string, 
  newFeedback: 'like' | 'dislike' | 'none',
  oldFeedback: 'like' | 'dislike' | 'none',
  feedbackText?: string
): Promise<{ success: boolean; message: string; newLikes: number; newDislikes: number }> {
  if (!courseId) {
    return { success: false, message: "ID do curso não fornecido.", newLikes: 0, newDislikes: 0 };
  }

  const result = await findCourseById(courseId);
  if (!result) {
    return { success: false, message: `Curso com ID ${courseId} não encontrado.`, newLikes: 0, newDislikes: 0 };
  }
  const { course } = result;
  
  let currentLikes = course.likes || 0;
  let currentDislikes = course.dislikes || 0;

  // Decrement the old feedback if it was 'like' or 'dislike'
  if (oldFeedback === 'like') {
    currentLikes = Math.max(0, currentLikes - 1);
  } else if (oldFeedback === 'dislike') {
    currentDislikes = Math.max(0, currentDislikes - 1);
  }

  // Increment the new feedback
  if (newFeedback === 'like') {
    currentLikes += 1;
  } else if (newFeedback === 'dislike') {
    currentDislikes += 1;
  }

  const updateData = { likes: currentLikes, dislikes: currentDislikes };

  try {
    await updateCourse(courseId, updateData);
    if (newFeedback === 'dislike' && feedbackText && feedbackText.trim() !== '') {
        console.log(`\n[Feedback Recebido] Curso ID: ${courseId}`);
        console.log(`Motivo: "${feedbackText}"\n`);
    }
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : 'Ocorreu um erro desconhecido.';
    return { success: false, message: `Falha ao registrar o feedback: ${errorMessage}`, newLikes: course.likes || 0, newDislikes: course.dislikes || 0 };
  }

  revalidatePath(`/admin/courses`);
  revalidatePath(`/courses/${courseId}`);
  
  return { success: true, message: 'Feedback registrado com sucesso!', newLikes: currentLikes, newDislikes: currentDislikes };
}


export async function completeCourseForUser(
  courseId: string
): Promise<{ success: boolean; message: string }> {
  // Use the simulated user ID for the prototype.
  const userId = getSimulatedUserId(); 
  
  try {
    const user = await getUserById(userId);
    if (!user) {
      throw new Error(`Usuário com ID ${userId} não encontrado.`);
    }

    // This part is for the initial completion. Feedback is handled separately now.
    if (!user.completedCourses.includes(courseId)) {
        const updatedCompletedCourses = [...user.completedCourses, courseId];
        await updateUser(userId, { completedCourses: updatedCompletedCourses });
    }

    // Add user to course voters if not already there, for simulation purposes.
    const course = await findCourseById(courseId);
    if (course) {
        let voters = course.course.voters || [];
        if (!voters.includes(userId)) {
            voters.push(userId);
            await updateCourse(courseId, { voters });
        }
    }


    // Revalidate all paths where progress is shown
    revalidatePath('/dashboard');
    revalidatePath('/meus-cursos');
    revalidatePath(`/courses/${courseId}`);

    return { success: true, message: "Progresso salvo com sucesso!" };

  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : 'Ocorreu um erro desconhecido.';
    return { success: false, message: `Falha ao salvar progresso: ${errorMessage}` };
  }
}

export async function deleteCourseAction(courseId: string): Promise<{ success: boolean; message: string }> {
  if (!courseId) {
    return { success: false, message: "ID do curso não fornecido." };
  }

  try {
    await deleteCourse(courseId);
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : 'Ocorreu um erro desconhecido.';
    return { success: false, message: `Falha ao excluir o curso: ${errorMessage}` };
  }

  revalidatePath('/admin/courses');
  
  return { success: true, message: 'Curso excluído com sucesso!' };
}
