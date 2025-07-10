import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-background p-4">
      <div className="mx-auto grid w-[400px] gap-6">
        <div className="grid gap-2 text-center">
             {/* Light mode logo */}
            <img
                src="/BrSupply.png"
                alt="Br Supply Logo"
                className="h-28 block dark:hidden mx-auto"
                data-ai-hint="logo"
            />
            {/* Dark mode logo */}
            <img
                src="/br-supply-logo.png"
                alt="Br Supply Logo"
                className="h-28 hidden dark:block mx-auto"
                data-ai-hint="logo"
            />
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Esqueceu sua senha?</CardTitle>
            <CardDescription>
              Sem problemas! Digite seu e-mail abaixo e nós enviaremos um link para você criar uma nova senha.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ForgotPasswordForm />
          </CardContent>
        </Card>
        <div className="text-center">
            <Button variant="ghost" asChild>
                <Link href="/">
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Voltar para o Login
                </Link>
            </Button>
        </div>
      </div>
    </div>
  );
}
