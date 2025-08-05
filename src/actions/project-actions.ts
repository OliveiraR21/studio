'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { getCurrentUser } from '@/lib/auth';
import {
  createProjectSubmission,
  getProjectSubmissions as getAllSubmissions,
  updateProjectSubmissionStatus as updateStatus,
} from '@/lib/data-access';
import type { SubmissionStatus } from '@/lib/types';

// Schema for the project submission form
const submitProjectSchema = z.object({
  projectName: z.string().min(5, { message: 'O nome do projeto deve ter pelo menos 5 caracteres.' }),
});

export async function submitProjectProposal(
  prevState: { success: boolean; message: string },
  formData: FormData
): Promise<{ success: boolean; message: string }> {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return { success: false, message: 'Usuário não autenticado.' };
  }

  const validatedFields = submitProjectSchema.safeParse({
    projectName: formData.get('projectName'),
  });

  if (!validatedFields.success) {
    return { success: false, message: validatedFields.error.flatten().fieldErrors.projectName?.[0] || 'Nome do projeto inválido.' };
  }

  try {
    await createProjectSubmission(
      currentUser.id,
      currentUser.name,
      currentUser.email,
      validatedFields.data.projectName
    );
    revalidatePath('/meus-cursos');
    return { success: true, message: 'Sua candidatura foi enviada com sucesso! Acompanhe o status por e-mail.' };
  } catch (e) {
    return { success: false, message: e instanceof Error ? e.message : 'Ocorreu um erro desconhecido.' };
  }
}

// Action for admins to get all submissions
export async function getProjectSubmissions() {
  // In a real app, you would add role checks here to ensure only admins can call this
  return await getAllSubmissions();
}

// Action for admins to update a submission's status
export async function updateSubmissionStatus(submissionId: string, status: SubmissionStatus) {
  try {
    await updateStatus(submissionId, status);
    revalidatePath('/admin/projects'); // Revalidate the admin page
    return { success: true, message: `Status da candidatura atualizado para "${status}".` };
  } catch (e) {
    return { success: false, message: e instanceof Error ? e.message : 'Ocorreu um erro desconhecido.' };
  }
}
