'use client';

import { useActionState, useEffect, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { requestPasswordReset, type AuthFormState } from '@/actions/auth-actions';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, MailCheck } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Enviar link de redefinição
    </Button>
  );
}

export function ForgotPasswordForm() {
  const initialState: AuthFormState = { success: false, message: '' };
  const [state, dispatch] = useActionState(requestPasswordReset, initialState);
  const { toast } = useToast();
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);


  useEffect(() => {
    if (state.message) {
      if (state.success) {
        // Instead of a toast, show a persistent message in the UI
        setShowSuccessMessage(true);
      } else {
        setShowSuccessMessage(false);
        toast({ variant: 'destructive', title: 'Erro', description: state.message });
      }
    }
  }, [state, toast]);
  
  if (showSuccessMessage) {
    return (
        <Alert variant="default" className="border-green-500/50 bg-green-500/10">
            <MailCheck className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-700 dark:text-green-400">Verifique seu E-mail</AlertTitle>
            <AlertDescription className="text-green-600 dark:text-green-500">
                {state.message}
            </AlertDescription>
        </Alert>
    )
  }

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
      <SubmitButton />
    </form>
  );
}
