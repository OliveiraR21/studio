import Link from "next/link";
import { KeyRound } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <KeyRound className="h-10 w-10 text-muted-foreground" />
            </div>
            <CardTitle className="text-2xl">Acesso via SSO</CardTitle>
            <CardDescription className="mt-2">
              Sua conta é criada automaticamente. Utilize o login com suas credenciais corporativas para acessar a plataforma.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mt-4 text-center text-sm">
              <Link href="/" className="underline">
                Voltar para a página de Login
              </Link>
            </div>
          </CardContent>
        </Card>
        <div className="flex justify-center">
            {/* Light mode logo */}
            <img
                src="/BrSupply.png"
                alt="Br Supply Logo"
                className="h-16 block dark:hidden"
                data-ai-hint="logo"
            />
            {/* Dark mode logo */}
            <img
                src="/br-supply-logo.png"
                alt="Br Supply Logo"
                className="h-16 hidden dark:block"
                data-ai-hint="logo"
            />
        </div>
      </div>
    </div>
  );
}
