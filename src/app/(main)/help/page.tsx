'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Home,
  LayoutGrid,
  Video,
  UserCog,
  Users,
  Network,
  BookMarked,
  HelpCircle,
  Navigation,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTour } from '@/hooks/use-tour';

export default function HelpPage() {
  const { startTour } = useTour();

  return (
    <div className="container mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <HelpCircle className="h-10 w-10 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Precisa de Ajuda?</h1>
            <p className="text-muted-foreground">
              Um guia rápido para você aproveitar ao máximo a plataforma.
            </p>
          </div>
        </div>
        <Button onClick={startTour}>
          <Navigation className="mr-2 h-4 w-4" />
          Refazer o Tour Interativo
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Card: Meu Painel */}
        <Card className="flex flex-col">
          <CardHeader className="flex flex-row items-center gap-3">
            <Home className="h-6 w-6 text-primary" />
            <div className="flex-1">
              <CardTitle>Meu Painel</CardTitle>
              <CardDescription>Sua central de progresso.</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="flex-grow space-y-4">
            <p className="text-sm">
              O painel oferece uma visão geral do seu desempenho, incluindo:
            </p>
            <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
              <li>
                <strong>Evolução:</strong> Gráfico com o percentual de cursos
                concluídos.
              </li>
              <li>
                <strong>Média Geral:</strong> Sua pontuação média em todos os
                questionários.
              </li>
              <li>
                <strong>Trilhas Concluídas:</strong> O número total de trilhas
                que você já finalizou.
              </li>
              <li>
                <strong>Pendências:</strong> Cursos que você precisa refazer
                para atingir a nota mínima.
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Card: Meus Cursos */}
        <Card className="flex flex-col">
          <CardHeader className="flex flex-row items-center gap-3">
            <LayoutGrid className="h-6 w-6 text-primary" />
            <div className="flex-1">
              <CardTitle>Meus Cursos</CardTitle>
              <CardDescription>Sua jornada de aprendizado.</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="flex-grow space-y-4">
            <p className="text-sm">
              Nesta tela você encontra todas as suas trilhas de conhecimento,
              organizadas em módulos.
            </p>
            <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
              <li>
                <strong>Módulos:</strong> As grandes áreas de conhecimento (ex:
                Hard Skills, Soft Skills).
              </li>
              <li>
                <strong>Trilhas:</strong> Sequências de cursos que formam um
                caminho de aprendizado.
              </li>
              <li>
                <strong>Cursos Bloqueados:</strong> Você precisa concluir o curso
                ou a trilha anterior para desbloquear o próximo.
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Card: Realizando um Curso */}
        <Card className="flex flex-col">
          <CardHeader className="flex flex-row items-center gap-3">
            <Video className="h-6 w-6 text-primary" />
            <div className="flex-1">
              <CardTitle>Realizando um Curso</CardTitle>
              <CardDescription>O passo a passo para aprender.</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="flex-grow space-y-4">
            <p className="text-sm">
              Cada curso é uma etapa do seu desenvolvimento. O processo é
              simples:
            </p>
            <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
              <li>
                <strong>Assista ao Vídeo:</strong> Preste atenção ao conteúdo
                principal da aula.
              </li>
              <li>
                <strong>Faça o Questionário:</strong> Teste seus conhecimentos.
                Você precisa de 90% de acerto para passar!
              </li>
              <li>
                <strong>Dê seu Feedback:</strong> Nos diga se gostou ou não do
                conteúdo. Sua opinião é anônima e nos ajuda a melhorar.
              </li>
              <li>
                <strong>Conclusão:</strong> Após o feedback, o curso é marcado
                como concluído e o próximo é liberado.
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Card: Administração (Condicional para Admins/Gerentes) */}
        <Card className="col-span-1 md:col-span-2 lg:col-span-3">
          <CardHeader className="flex flex-row items-center gap-3">
            <UserCog className="h-6 w-6 text-primary" />
            <div className="flex-1">
              <CardTitle>Área de Administração</CardTitle>
              <CardDescription>Para gestores e administradores.</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm mb-4">
              Se você tem permissão de Admin, verá seções adicionais no menu
              para gerenciar a plataforma:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-start gap-3">
                <Users className="h-5 w-5 mt-1 text-muted-foreground" />
                <div>
                  <h4 className="font-semibold">Minha Equipe</h4>
                  <p className="text-sm text-muted-foreground">
                    Acompanhe o progresso e o desempenho da sua equipe.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <UserCog className="h-5 w-5 mt-1 text-muted-foreground" />
                <div>
                  <h4 className="font-semibold">Gerenciamento de Usuários</h4>
                  <p className="text-sm text-muted-foreground">
                    Crie, edite e visualize todos os usuários da plataforma.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Network className="h-5 w-5 mt-1 text-muted-foreground" />
                <div>
                  <h4 className="font-semibold">Gerenciamento de Trilhas</h4>
                  <p className="text-sm text-muted-foreground">
                    Organize a estrutura de módulos e trilhas de aprendizagem.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <BookMarked className="h-5 w-5 mt-1 text-muted-foreground" />
                <div>
                  <h4 className="font-semibold">Gerenciamento de Cursos</h4>
                  <p className="text-sm text-muted-foreground">
                    Adicione e edite os cursos individuais e seus questionários.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
