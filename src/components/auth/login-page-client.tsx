
'use client';

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { LoginForm } from "@/components/auth/login-form";

export function LoginPageClient() {
  const searchParams = useSearchParams();
  const { toast } = useToast();

  useEffect(() => {
    if (searchParams.get('message') === 'signup_success') {
      toast({
        title: "Conta Criada com Sucesso!",
        description: "Agora você pode fazer login com seu e-mail e senha.",
      });
    }
  }, [searchParams, toast]);

  return (
    <Card className="w-full max-w-[380px] bg-background/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-2xl text-card-foreground">Login</CardTitle>
        <CardDescription className="text-muted-foreground">
          Digite seu e-mail e senha para acessar a plataforma.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <LoginForm />
        <div className="mt-4 text-center text-sm text-muted-foreground">
          Não tem uma conta?{" "}
          <Link href="/signup" className="underline text-primary">
            Cadastre-se
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
