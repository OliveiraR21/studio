
'use server';

import { z } from 'zod';
import { createUser, updateUser, getUserById } from '@/lib/data-access';
import { revalidatePath } from 'next/cache';
import type { UserRole } from '@/lib/types';
import { getSimulatedUserId } from '@/lib/auth';

const userFormSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, 'O nome precisa ter pelo menos 3 caracteres.'),
  email: z.string().email('Por favor, insira um e-mail válido.'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres.'),
  confirmPassword: z.string(),
  role: z.enum(['Admin', 'Diretor', 'Gerente', 'Coordenador', 'Supervisor', 'Analista', 'Assistente'], {
    errorMap: () => ({ message: "Por favor, selecione um cargo válido." })
  }),
  area: z.string().optional(),
  supervisor: z.string().optional(),
  coordenador: z.string().optional(),
  gerente: z.string().optional(),
  diretor: z.string().optional(),
  avatarUrl: z.string().url().optional(),
}).refine(data => data.password === data.confirmPassword, {
    message: "As senhas não coincidem.",
    path: ["confirmPassword"],
});


export type UserFormState = {
  message: string;
  errors?: {
    name?: string[];
    email?: string[];
    password?: string[];
    confirmPassword?: string[];
    role?: string[];
    area?: string[];
  };
  success: boolean;
};


export async function saveUser(
  prevState: UserFormState,
  formData: FormData
): Promise<UserFormState> {
    
  const rawData = Object.fromEntries(formData.entries());

  const validatedFields = userFormSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Erro de validação. Por favor, corrija os campos.',
    };
  }
  
  try {
    const { confirmPassword, ...userData } = validatedFields.data;
    // For now, we only support creation. id check would go here.
    await createUser(userData);
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : 'Ocorreu um erro desconhecido.';
    return { success: false, message: `Falha ao salvar o usuário: ${errorMessage}`, errors: {} };
  }

  revalidatePath('/admin/users');
  
  return { success: true, message: `Usuário "${validatedFields.data.name}" criado com sucesso!` };
}


export async function updateUserAvatar(avatarDataUrl: string): Promise<{ success: boolean; message: string }> {
  const userId = await getSimulatedUserId();
  if (!userId) {
    return { success: false, message: 'Usuário não autenticado.' };
  }

  if (!avatarDataUrl || !avatarDataUrl.startsWith('data:image')) {
    return { success: false, message: 'Formato de imagem inválido.' };
  }

  try {
    await updateUser(userId, { avatarUrl: avatarDataUrl });
    revalidatePath('/profile');
    revalidatePath('/(main)/layout'); // Revalidate layout to update UserNav
    return { success: true, message: 'Foto de perfil atualizada com sucesso!' };
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : 'Ocorreu um erro desconhecido.';
    return { success: false, message: `Falha ao atualizar a foto: ${errorMessage}` };
  }
}

export async function removeUserAvatar(): Promise<{ success: boolean; message: string }> {
  const userId = await getSimulatedUserId();
  if (!userId) {
    return { success: false, message: 'Usuário não autenticado.' };
  }

  try {
    await updateUser(userId, { avatarUrl: undefined });
    revalidatePath('/profile');
    revalidatePath('/(main)/layout');
    return { success: true, message: 'Foto de perfil removida com sucesso!' };
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : 'Ocorreu um erro desconhecido.';
    return { success: false, message: `Falha ao remover a foto: ${errorMessage}` };
  }
}

const userProfileSchema = z.object({
    preferredName: z.string().optional(),
});

export async function updateUserProfile(
    formData: FormData
): Promise<{ success: boolean; message: string }> {
    const userId = await getSimulatedUserId();
    if (!userId) {
        return { success: false, message: 'Usuário não autenticado.' };
    }
    
    const validatedFields = userProfileSchema.safeParse({
        preferredName: formData.get('preferredName'),
    });

    if (!validatedFields.success) {
        return { success: false, message: 'Dados inválidos.' };
    }
    
    try {
        await updateUser(userId, { preferredName: validatedFields.data.preferredName });
        revalidatePath('/profile');
        revalidatePath('/(main)/layout'); // Revalidate layout to update UserNav
        return { success: true, message: 'Perfil atualizado com sucesso!' };
    } catch (e) {
        const errorMessage = e instanceof Error ? e.message : 'Ocorreu um erro desconhecido.';
        return { success: false, message: `Falha ao atualizar o perfil: ${errorMessage}` };
    }
}

export async function completeOnboardingForUser(): Promise<{ success: boolean }> {
  const userId = await getSimulatedUserId();
  if (!userId) {
    return { success: false };
  }

  try {
    const user = await getUserById(userId);
    if (user && !user.hasCompletedOnboarding) {
      await updateUser(userId, { hasCompletedOnboarding: true });
    }
    return { success: true };
  } catch (e) {
    console.error("Failed to complete onboarding:", e);
    return { success: false };
  }
}
