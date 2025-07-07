'use client';

import { useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { signup, type AuthFormState } from '@/actions/auth-actions';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Criar Conta
    </Button>
  );
}

export function SignupForm() {
  const initialState: AuthFormState = { success: false, message: '' };
  const [state, dispatch] = useActionState(signup, initialState);
  const { toast } = useToast();

  useEffect(() => {
    if (!state.success && state.message) {
      toast({ variant: 'destructive', title: 'Erro no Cadastro', description: state.message });
    }
    // Success case is handled by redirect in the action
  }, [state, toast]);

  return (
    <form action={dispatch} className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="name">Nome Completo</Label>
        <Input id="name" name="name" placeholder="Ex: João da Silva" required />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="email">E-mail</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="joao.silva@example.com"
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="password">Senha</Label>
        <Input 
          id="password" 
          name="password" 
          type="password" 
          required 
          placeholder="Mínimo de 6 caracteres"
        />
      </div>
      <SubmitButton />
    </form>
  );
}
