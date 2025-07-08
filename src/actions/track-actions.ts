'use server';

import { getSimulatedUserId } from '@/lib/auth';
import { getUserById, updateUser } from '@/lib/data-access';
import { revalidatePath } from 'next/cache';

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
