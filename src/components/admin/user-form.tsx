'use client';

import type { User, UserRole } from '@/lib/types';
import { useFormStatus } from 'react-dom';
import { useEffect, useActionState } from 'react';
import { saveUser } from '@/actions/user-actions';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface UserFormProps {
  // Pass all users to populate manager dropdowns
  allUsers: User[];
}

const ROLES: UserRole[] = ['Assistente', 'Analista', 'Supervisor', 'Coordenador', 'Gerente', 'Diretor', 'Admin'];

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Criar Usuário
    </Button>
  );
}

export function UserForm({ allUsers }: UserFormProps) {
  const router = useRouter();
  const { toast } = useToast();

  const initialState = { message: '', errors: {}, success: false };
  const [state, dispatch] = useActionState(saveUser, initialState);
  
  const supervisors = allUsers.filter(u => u.role === 'Supervisor');
  const coordinators = allUsers.filter(u => u.role === 'Coordenador');
  const managers = allUsers.filter(u => u.role === 'Gerente');
  const directors = allUsers.filter(u => u.role === 'Diretor');

  useEffect(() => {
    if (state.success) {
      toast({
        title: 'Sucesso!',
        description: state.message,
      });
      router.push('/admin/users');
    } else if (state.message && !state.success && state.errors && Object.keys(state.errors).length > 0) {
      toast({
        variant: 'destructive',
        title: 'Erro de Validação',
        description: state.message,
      });
    } else if (state.message && !state.success) {
      toast({
        variant: 'destructive',
        title: 'Ocorreu um Erro',
        description: state.message,
      });
    }
  }, [state, toast, router]);

  return (
    <form action={dispatch} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="name">Nome Completo</Label>
            <Input id="name" name="name" placeholder="Ex: João da Silva" required />
            {state.errors?.name && <p className="text-sm text-destructive">{state.errors.name[0]}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input id="email" name="email" type="email" placeholder="Ex: joao.silva@example.com" required />
            {state.errors?.email && <p className="text-sm text-destructive">{state.errors.email[0]}</p>}
          </div>

           <div className="space-y-2">
            <Label htmlFor="role">Cargo</Label>
            <Select name="role" required>
                <SelectTrigger id="role">
                    <SelectValue placeholder="Selecione o cargo" />
                </SelectTrigger>
                <SelectContent>
                    {ROLES.map(role => (
                        <SelectItem key={role} value={role}>{role}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
            {state.errors?.role && <p className="text-sm text-destructive">{state.errors.role[0]}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="area">Área / Departamento</Label>
            <Input id="area" name="area" placeholder="Ex: Comercial" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input id="password" name="password" type="password" required />
             {state.errors?.password && <p className="text-sm text-destructive">{state.errors.password[0]}</p>}
          </div>

           <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar Senha</Label>
            <Input id="confirmPassword" name="confirmPassword" type="password" required />
             {state.errors?.confirmPassword && <p className="text-sm text-destructive">{state.errors.confirmPassword[0]}</p>}
          </div>
      </div>

      <div className="space-y-4 pt-4 border-t">
          <h3 className="text-lg font-medium">Hierarquia (Opcional)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-2">
                <Label htmlFor="supervisor">Supervisor</Label>
                <Select name="supervisor">
                    <SelectTrigger><SelectValue placeholder="Nenhum" /></SelectTrigger>
                    <SelectContent>{supervisors.map(u => <SelectItem key={u.id} value={u.name}>{u.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
               <div className="space-y-2">
                <Label htmlFor="coordenador">Coordenador</Label>
                 <Select name="coordenador">
                    <SelectTrigger><SelectValue placeholder="Nenhum" /></SelectTrigger>
                    <SelectContent>{coordinators.map(u => <SelectItem key={u.id} value={u.name}>{u.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
               <div className="space-y-2">
                <Label htmlFor="gerente">Gerente</Label>
                 <Select name="gerente">
                    <SelectTrigger><SelectValue placeholder="Nenhum" /></SelectTrigger>
                    <SelectContent>{managers.map(u => <SelectItem key={u.id} value={u.name}>{u.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
               <div className="space-y-2">
                <Label htmlFor="diretor">Diretor</Label>
                 <Select name="diretor">
                    <SelectTrigger><SelectValue placeholder="Nenhum" /></SelectTrigger>
                    <SelectContent>{directors.map(u => <SelectItem key={u.id} value={u.name}>{u.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
          </div>
      </div>


      <div className="flex justify-end gap-4 pt-4 border-t">
        <Button variant="outline" type="button" onClick={() => router.back()}>
          Cancelar
        </Button>
        <SubmitButton />
      </div>
    </form>
  );
}
