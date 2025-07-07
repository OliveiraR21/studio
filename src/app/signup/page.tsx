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
    <div className="w-full min-h-screen flex items-center justify-center bg-background p-4">
      <div className="mx-auto grid w-[380px] gap-6">
        <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">
              <span className="text-primary">Br</span> Supply | Academia
            </h1>
        </div>
        <Card>
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
              <Link href="/" className="underline">
                Fazer login
              </Link>
            </div>
          </CardContent>
        </Card>
        <div className="flex justify-center">
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
  );
}
