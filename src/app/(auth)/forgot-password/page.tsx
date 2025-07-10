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
    <>
      <Card className="w-full max-w-[400px] bg-background/80 backdrop-blur-sm">
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
      <div className="mt-6 text-center">
          <Button variant="link" asChild className="text-white hover:text-primary">
              <Link href="/">
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Voltar para o Login
              </Link>
          </Button>
      </div>
    </>
  );
}
