
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
    <div className="relative w-full min-h-screen flex items-center justify-center p-4 overflow-hidden">
      {/* Background Iframe for YouTube */}
      <iframe
        className="absolute top-1/2 left-1/2 w-full h-full -translate-x-1/2 -translate-y-1/2 object-cover z-[-2]"
        src="https://www.youtube.com/embed/NgPkB-5-v6Y?autoplay=1&mute=1&loop=1&playlist=NgPkB-5-v6Y&controls=0&showinfo=0&modestbranding=1&iv_load_policy=3&rel=0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title="YouTube background video"
        data-ai-hint="background video"
      ></iframe>
      
      {/* Dark Overlay */}
      <div className="absolute top-0 left-0 w-full h-full bg-black/50 z-[-1]"></div>

      {/* Login Content */}
      <div className="relative z-10 mx-auto grid w-[380px] gap-6 text-center text-white">
        <div className="grid gap-2">
            <h1 className="text-3xl font-bold">
              <span className="text-primary">Br</span> Supply | Academia
            </h1>
        </div>
        <Card className="bg-background/80 backdrop-blur-sm">
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
        <div className="flex justify-center">
            {/* Logo for both light/dark themes, since the background is now dark */}
            <img
                src="/br-supply-logo.png"
                alt="Br Supply Logo"
                className="h-28"
                data-ai-hint="logo"
            />
        </div>
      </div>
    </div>
  );
}
