import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SignupForm } from "@/components/auth/signup-form";

export default function SignupPage() {
  return (
    <Card className="w-full max-w-[380px] bg-background/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Criar Conta</CardTitle>
        <CardDescription>
          Preencha os campos abaixo para criar sua conta.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SignupForm />
        <div className="mt-4 text-center text-sm">
          Já tem uma conta?{" "}
          <Link href="/" className="underline text-primary">
            Fazer login
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
