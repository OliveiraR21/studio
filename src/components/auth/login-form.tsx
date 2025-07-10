'use client';

import { useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { login, type AuthFormState } from '@/actions/auth-actions';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';


function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Entrar
    </Button>
  );
}

export function LoginForm() {
  const initialState: AuthFormState = { success: false, message: '' };
  const [state, dispatch] = useActionState(login, initialState);
  const { toast } = useToast();

  useEffect(() => {
    if (!state.success && state.message) {
      toast({ variant: 'destructive', title: 'Erro no Login', description: state.message });
    }
    // Success case is handled by redirect in the action
  }, [state, toast]);

  return (
    <form action={dispatch} className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="email">E-mail</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="seu@email.com"
          required
        />
      </div>
      <div className="grid gap-2">
        <div className="flex items-center">
          <Label htmlFor="password">Senha</Label>
          <Link
            href="#"
            className="ml-auto inline-block text-sm underline"
            onClick={(e) => {
                e.preventDefault();
                toast({ title: 'Funcionalidade em desenvolvimento', description: 'A recuperação de senha ainda não foi implementada.' });
            }}
          >
            Esqueceu sua senha?
          </Link>
        </div>
        <Input id="password" name="password" type="password" required />
      </div>
      <SubmitButton />
    </form>
  );
}