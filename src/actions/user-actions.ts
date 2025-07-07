'use server';

import { z } from 'zod';
import { createUser } from '@/lib/data-access';
import { revalidatePath } from 'next/cache';
import type { UserRole } from '@/lib/types';

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
