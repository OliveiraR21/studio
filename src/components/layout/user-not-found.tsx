import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function UserNotFound() {
    return (
        <div className="container mx-auto flex items-center justify-center h-full p-4">
            <Card className="max-w-lg mx-auto text-center">
                <CardHeader>
                    <CardTitle>Dados Não Carregados</CardTitle>
                    <CardDescription>O banco de dados parece estar vazio ou o usuário de simulação (ID '1') não foi encontrado.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                        Por favor, certifique-se de que você configurou suas credenciais do Firebase no arquivo <code className="font-mono bg-muted p-1 rounded">.env</code> e executou o script de carga de dados.
                    </p>
                    <p className="font-mono bg-muted p-2 rounded-md inline-block">
                        npm run db:seed
                    </p>
                     <p className="text-xs text-muted-foreground mt-4">
                        Após executar o comando, pode ser necessário reiniciar o servidor de desenvolvimento.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
