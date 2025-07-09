
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
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover z-[-2]"
        data-ai-hint="background video"
      >
        {/* IMPORTANT: Add your video file named 'background-video.mp4' to the /public folder */}
        <source src="/background-video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      
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
