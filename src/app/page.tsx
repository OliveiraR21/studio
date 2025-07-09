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

export default function LoginPage() {
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
    <div className="w-full min-h-screen flex items-center justify-center bg-background p-4">
       <div className="container grid lg:grid-cols-2 items-center gap-16">

        {/* Coluna da Esquerda: Formulário de Login */}
        <div className="flex justify-center lg:justify-end">
          <div className="mx-auto grid w-[380px] gap-6">
            <div className="grid gap-2 text-center lg:text-left">
                <h1 className="text-3xl font-bold">
                  <span className="text-primary">Br</span> Supply | Academia
                </h1>
            </div>
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Login</CardTitle>
                <CardDescription>
                  Digite seu e-mail e senha para acessar a plataforma.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <LoginForm />
                <div className="mt-4 text-center text-sm">
                  Não tem uma conta?{" "}
                  <Link href="/signup" className="underline">
                    Cadastre-se
                  </Link>
                </div>
              </CardContent>
            </Card>
            <div className="flex justify-center lg:justify-start">
                {/* Light mode logo */}
                <img
                    src="/BrSupply.png"
                    alt="Br Supply Logo"
                    className="h-28 block dark:hidden"
                    data-ai-hint="logo"
                />
                {/* Dark mode logo */}
                <img
                    src="/br-supply-logo.png"
                    alt="Br Supply Logo"
                    className="h-28 hidden dark:block"
                    data-ai-hint="logo"
                />
            </div>
          </div>
        </div>

        {/* Coluna da Direita: Mascote */}
        <div className="hidden lg:flex justify-start items-center [perspective:1000px]">
          <img
            src="/mascote.png"
            alt="Mascote da Plataforma"
            className="w-full max-w-md h-auto rounded-lg transition-transform duration-700 ease-out transform-gpu [transform:rotateY(20deg)_rotateX(-10deg)] hover:[transform:rotateY(-5deg)_rotateX(5deg)_scale(1.05)] animate-float drop-shadow-2xl"
            data-ai-hint="friendly robot mascot"
          />
        </div>

      </div>
    </div>
  );
}
