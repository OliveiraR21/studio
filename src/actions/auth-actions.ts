'use server';

import { z } from 'zod';
import { findUserByEmail, createUser } from '@/lib/data-access';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

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
    
    // Set the user ID in a cookie to simulate a session
    cookies().set('simulated_user_id', user.id, {
        httpOnly: true,
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 1 week
    });
    
  } catch (error) {
    return { success: false, message: 'Ocorreu um erro no servidor. Tente novamente.' };
  }
  
  // Revalidate the entire app to ensure user data is fresh everywhere.
  revalidatePath('/', 'layout');

  // Redirect to dashboard on successful login
  redirect('/dashboard');
}

// --- Logout Action ---
export async function logout() {
    cookies().delete('simulated_user_id');
    redirect('/');
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


// --- Forgot Password Action ---

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Por favor, insira um e-mail válido." }),
});

export async function requestPasswordReset(prevState: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const validatedFields = forgotPasswordSchema.safeParse({
    email: formData.get('email'),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      message: validatedFields.error.flatten().fieldErrors.email?.[0] || 'E-mail inválido.',
    };
  }

  const { email } = validatedFields.data;

  try {
    const user = await findUserByEmail(email);

    if (!user) {
        // To prevent email enumeration, we show a success message even if the user doesn't exist.
        // In a real app, you would still proceed to "send" a fake email or log this attempt.
         return { success: true, message: 'Se um usuário com este e-mail existir, um link de redefinição de senha foi enviado.' };
    }
    
    // --- SIMULATION ---
    // In a real application, you would:
    // 1. Generate a secure, unique, and expiring password reset token.
    // 2. Save the token hash to the user's record in the database.
    // 3. Create a reset URL (e.g., /reset-password?token=...).
    // 4. Send an email to the user with the reset URL.
    console.log(`[SIMULAÇÃO] Enviando link de redefinição para: ${email}`);
    
  } catch (error) {
    // In a real app, you'd want to log this error but probably still show a generic success message to the user.
    console.error("Erro no processo de redefinição de senha:", error);
    return { success: false, message: 'Ocorreu um erro no servidor. Tente novamente.' };
  }

  // Always return a success message to prevent user enumeration.
  return { success: true, message: 'Se um usuário com este e-mail existir, um link de redefinição de senha foi enviado.' };
}
