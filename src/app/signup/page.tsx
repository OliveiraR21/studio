import Link from "next/link";
import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SignupPage() {
  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-background p-4">
      <div className="mx-auto grid w-[350px] gap-6">
        <div className="grid gap-2 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <BookOpen className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Br Supply Academy</h1>
          </div>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Cadastre-se</CardTitle>
            <CardDescription>
              Insira suas informações para criar uma conta
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="full-name">Nome completo</Label>
                <Input id="full-name" placeholder="John Doe" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Senha</Label>
                <Input id="password" type="password" />
              </div>
              <Button type="submit" className="w-full" asChild>
                <Link href="/dashboard">Criar uma conta</Link>
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Já tem uma conta?{" "}
              <Link href="/" className="underline">
                Entrar
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
