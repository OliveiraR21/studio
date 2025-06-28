import Link from "next/link";
import { BookOpen } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";

const MicrosoftIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 23 23" width="23" height="23" {...props}>
        <path d="M1 1h10v10H1z" fill="#f25022" />
        <path d="M12 1h10v10H12z" fill="#7fba00" />
        <path d="M1 12h10v10H1z" fill="#00a4ef" />
        <path d="M12 12h10v10H12z" fill="#ffb900" />
    </svg>
);


export default function LoginPage() {
  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-background p-4">
      <div className="mx-auto grid w-[380px] gap-6">
        <div className="grid gap-2 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <BookOpen className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Br Supply Academy</h1>
          </div>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Login</CardTitle>
            <CardDescription>
              Utilize sua conta corporativa para acessar a plataforma.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <Button type="submit" className="w-full" asChild>
                <Link href="/dashboard">
                   <MicrosoftIcon className="mr-2 h-5 w-5" />
                   Entrar com Microsoft (SSO)
                </Link>
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Problemas para acessar?{" "}
              <Link href="#" className="underline">
                Contate o suporte de TI
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
