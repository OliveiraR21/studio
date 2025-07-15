
'use server';

import { getSimulatedUserId } from '@/lib/auth';
import { findModuleById, getUserById, updateUser, updateTrack } from '@/lib/data-access';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import type { Track } from '@/lib/types';


// --- Save Track (Update) Action ---

const trackFormSchema = z.object({
  id: z.string(),
  moduleId: z.string(),
  title: z.string().min(3, 'O título precisa ter pelo menos 3 caracteres.'),
  description: z.string().min(10, 'A descrição precisa ter pelo menos 10 caracteres.'),
  order: z.preprocess(
    (val) => (val === '' ? undefined : Number(val)),
    z.number({ invalid_type_error: 'A ordem deve ser um número.' }).optional()
  ),
});

export type TrackFormState = {
  message: string;
  errors?: {
    title?: string[];
    description?: string[];
    order?: string[];
  };
  success: boolean;
};


export async function saveTrack(
  prevState: TrackFormState,
  formData: FormData
): Promise<TrackFormState> {
  const validatedFields = trackFormSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Erro de validação. Por favor, corrija os campos.',
    };
  }

  const { id, moduleId, order, ...trackData } = validatedFields.data;

  // --- ORDER VALIDATION ---
  if (order !== undefined) {
    const moduleResult = await findModuleById(moduleId);
    if (moduleResult) {
      const hasDuplicateOrder = moduleResult.tracks.some(
        (track) => track.order === order && track.id !== id
      );
      if (hasDuplicateOrder) {
        return {
          success: false,
          errors: { order: [`A ordem "${order}" já está em uso neste módulo. Por favor, escolha outro número.`] },
          message: 'Erro de validação. O número de ordem já existe.',
        };
      }
    }
  }
  // --- END ORDER VALIDATION ---

  try {
    const updateData: Partial<Track> = {
        ...trackData,
        order,
    };
    await updateTrack(id, updateData);
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : 'Ocorreu um erro desconhecido.';
    return { success: false, message: `Falha ao salvar a trilha: ${errorMessage}`, errors: {} };
  }

  revalidatePath('/admin/tracks');
  revalidatePath('/dashboard');
  revalidatePath('/meus-cursos');

  return { success: true, message: `Trilha "${trackData.title}" salva com sucesso!` };
}



export async function completeTrackForUser(trackId: string): Promise<{ success: boolean; message: string }> {
  const userId = getSimulatedUserId();
  
  try {
    const user = await getUserById(userId);
    if (!user) {
      throw new Error(`Usuário com ID ${userId} não encontrado.`);
    }

    if (!user.completedTracks.includes(trackId)) {
        const updatedCompletedTracks = [...user.completedTracks, trackId];
        await updateUser(userId, { completedTracks: updatedCompletedTracks });
    }

    revalidatePath('/meus-cursos');
    revalidatePath('/dashboard');

    return { success: true, message: "Trilha concluída com sucesso!" };

  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : 'Ocorreu um erro desconhecido.';
    return { success: false, message: `Falha ao concluir trilha: ${errorMessage}` };
  }
}
