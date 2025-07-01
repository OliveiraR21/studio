import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function UserNotFound() {
    return (
        <div className="container mx-auto flex items-center justify-center h-full p-4">
            <Card className="max-w-lg mx-auto text-center">
                <CardHeader>
                    <CardTitle>Dados Não Carregados</CardTitle>
                    <CardDescription>Não foi possível carregar os dados de simulação.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                        Por favor, verifique se o arquivo <code className="font-mono bg-muted p-1 rounded">src/lib/mock-data.ts</code> não está vazio ou corrompido.
                    </p>
                     <p className="text-xs text-muted-foreground mt-4">
                        Se o problema persistir, tente reiniciar o servidor de desenvolvimento.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
