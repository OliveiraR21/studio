import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Brush, Bell, UserCog } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="container mx-auto space-y-6">
      <div>
            <h1 className="text-3xl font-bold">Configurações</h1>
            <p className="text-muted-foreground">
                Gerencie as preferências da sua conta e da aplicação.
            </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
            <CardHeader>
                <div className="flex items-center gap-3">
                    <Brush className="h-6 w-6 text-primary" />
                    <CardTitle>Aparência</CardTitle>
                </div>
                <CardDescription>Personalize a aparência da interface.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border p-4">
                    <Label htmlFor="theme-switcher">
                        <p className="font-semibold">Tema</p>
                        <p className="text-sm text-muted-foreground">Selecione o tema claro, escuro ou o padrão do sistema.</p>
                    </Label>
                    <ThemeToggle />
                </div>
            </CardContent>
        </Card>
        
        <Card>
            <CardHeader>
                <div className="flex items-center gap-3">
                    <Bell className="h-6 w-6 text-primary" />
                    <CardTitle>Notificações</CardTitle>
                </div>
                <CardDescription>Gerencie como você recebe notificações.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border p-4">
                     <Label htmlFor="email-notifications" className="flex-grow">
                        <p className="font-semibold">Notificações por E-mail</p>
                        <p className="text-sm text-muted-foreground">Receba e-mails sobre novos cursos e progresso.</p>
                    </Label>
                    <Switch id="email-notifications" disabled />
                </div>
                <div className="flex items-center justify-between rounded-lg border p-4">
                     <Label htmlFor="push-notifications" className="flex-grow">
                        <p className="font-semibold">Notificações Push</p>
                        <p className="text-sm text-muted-foreground">Receba notificações diretamente no seu navegador.</p>
                    </Label>
                    <Switch id="push-notifications" disabled />
                </div>
            </CardContent>
        </Card>

        <Card className="lg:col-span-2">
             <CardHeader>
                <div className="flex items-center gap-3">
                    <UserCog className="h-6 w-6 text-primary" />
                    <CardTitle>Conta</CardTitle>
                </div>
                <CardDescription>Gerencie as informações da sua conta.</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground">
                    O gerenciamento de contas é feito através do sistema de Single Sign-On (SSO) da empresa. Para alterar seu nome ou e-mail, entre em contato com o departamento de TI.
                </p>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
