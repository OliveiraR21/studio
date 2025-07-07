'use server';

import { z } from 'zod';
import { findUserByEmail, createUser } from '@/lib/data-access';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

// --- Login Action ---

const loginSchema = z.object({
  email: z.string().email({ message: "Por favor, insira um e-mail válido." }),
  password: z.string().min(1, { message: "A senha não pode estar em branco." }),
});

export type AuthFormState = {
  message: string;
  success: boolean;
};

export async function login(prevState: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const validatedFields = loginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      message: validatedFields.error.flatten().fieldErrors.email?.[0] || validatedFields.error.flatten().fieldErrors.password?.[0] || 'Dados inválidos.',
    };
  }

  const { email, password } = validatedFields.data;

  try {
    const user = await findUserByEmail(email);
    // IMPORTANT: In a real app, NEVER store plain text passwords. Always use hashing (e.g., bcrypt).
    if (!user || user.password !== password) {
      return { success: false, message: 'E-mail ou senha inválidos.' };
    }
    
    // In a real app, you would set a session cookie here.
    // For this prototype, we just redirect.
    
  } catch (error) {
    return { success: false, message: 'Ocorreu um erro no servidor. Tente novamente.' };
  }

  // Redirect to dashboard on successful login
  redirect('/dashboard');
}


// --- Signup Action ---

const signupSchema = z.object({
    name: z.string().min(3, { message: "O nome deve ter pelo menos 3 caracteres." }),
    email: z.string().email({ message: "Por favor, insira um e-mail válido." }),
    password: z.string().min(6, { message: "A senha deve ter pelo menos 6 caracteres." }),
});

export async function signup(prevState: AuthFormState, formData: FormData): Promise<AuthFormState> {
    const validatedFields = signupSchema.safeParse(Object.fromEntries(formData.entries()));

    if (!validatedFields.success) {
        const errors = validatedFields.error.flatten().fieldErrors;
        return {
            success: false,
            message: errors.name?.[0] || errors.email?.[0] || errors.password?.[0] || 'Dados de cadastro inválidos.',
        };
    }

    const { name, email, password } = validatedFields.data;

    try {
        await createUser({
            name,
            email,
            password,
            role: 'Analista', // Default role for new signups
            area: 'Não definido'
        });
    } catch (e) {
        const errorMessage = e instanceof Error ? e.message : 'Ocorreu um erro desconhecido.';
        return { success: false, message: `Falha ao criar conta: ${errorMessage}` };
    }

    revalidatePath('/');
    redirect('/?message=signup_success');
}
