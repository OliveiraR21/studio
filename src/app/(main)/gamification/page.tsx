
import { getCurrentUser } from '@/lib/auth';
import { getLearningModules } from '@/lib/data-access';
import { calculateUserLevel } from '@/lib/gamification';
import { UserNotFound } from '@/components/layout/user-not-found';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Trophy, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

const levelInfoMap = {
  0: { name: 'Sem Nível', color: 'text-gray-500', bgColor: 'bg-gray-500/10' },
  1: { name: 'Bronze', color: 'text-yellow-600', bgColor: 'bg-yellow-600/10' },
  2: { name: 'Prata', color: 'text-gray-400', bgColor: 'bg-gray-400/10' },
  3: { name: 'Ouro', color: 'text-yellow-400', bgColor: 'bg-yellow-400/10' },
  4: { name: 'Diamante', color: 'text-teal-400', bgColor: 'bg-teal-400/10' },
};

export default async function GamificationPage() {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return <UserNotFound />;
  }

  const allModules = await getLearningModules();
  const levelInfo = await calculateUserLevel(currentUser, allModules);

  const currentLevelStyle = levelInfoMap[levelInfo.level as keyof typeof levelInfoMap] || levelInfoMap[0];
  const isMaxLevel = levelInfo.level === 4;

  return (
    <div className="container mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Trophy className="h-10 w-10 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Gamificação</h1>
          <p className="text-muted-foreground">
            Acompanhe seu progresso, suba de nível e se torne um expert!
          </p>
        </div>
      </div>

      {/* Current Level Card */}
      <Card className={cn("border-2", currentLevelStyle.color.replace('text-', 'border-'))}>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">Seu Nível Atual</CardTitle>
              <CardDescription>
                Este é o seu reconhecimento pelo conhecimento adquirido.
              </CardDescription>
            </div>
            <Badge className={cn("text-lg", currentLevelStyle.bgColor, currentLevelStyle.color)}>
              {levelInfo.levelName}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <Trophy className={cn("h-24 w-24 mx-auto mb-4", currentLevelStyle.color)} />
            <h3 className="text-4xl font-bold tracking-tighter">
              {levelInfo.currentXp}%
            </h3>
            <p className="text-muted-foreground">
              de todos os cursos da plataforma concluídos
            </p>
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Progresso de Conclusão</span>
              <span className="text-sm font-bold">{levelInfo.progressPercentage}%</span>
            </div>
            <Progress value={levelInfo.progressPercentage} className="h-3" />
          </div>
          {isMaxLevel && (
            <div className="text-center pt-4">
                 <p className="font-semibold text-teal-400">Parabéns! Você alcançou o nível máximo de maestria!</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* How it Works Card */}
      <Card>
        <CardHeader>
          <CardTitle>Como Funcionam os Níveis?</CardTitle>
          <CardDescription>
            Seu nível é calculado com base no percentual de cursos concluídos.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-4">
            <div className="flex items-start gap-4 p-3 rounded-lg bg-muted/50">
              <div className="pt-1">
                <Trophy className="h-6 w-6 text-gray-500" />
              </div>
              <div>
                <h4 className="font-semibold">Sem Nível</h4>
                <p className="text-sm text-muted-foreground">
                  Complete até 33% de todos os cursos disponíveis.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-3 rounded-lg bg-muted/50">
               <div className="pt-1">
                <Trophy className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <h4 className="font-semibold">Bronze</h4>
                <p className="text-sm text-muted-foreground">
                  Complete entre 34% e 66% de todos os cursos.
                </p>
              </div>
            </div>
             <div className="flex items-start gap-4 p-3 rounded-lg bg-muted/50">
               <div className="pt-1">
                <Trophy className="h-6 w-6 text-gray-400" />
              </div>
              <div>
                <h4 className="font-semibold">Prata</h4>
                <p className="text-sm text-muted-foreground">
                  Complete entre 67% e 99% de todos os cursos.
                </p>
              </div>
            </div>
             <div className="flex items-start gap-4 p-3 rounded-lg bg-muted/50">
               <div className="pt-1">
                <Trophy className="h-6 w-6 text-yellow-400" />
              </div>
              <div>
                <h4 className="font-semibold">Ouro</h4>
                <p className="text-sm text-muted-foreground">
                  Complete 100% de todos os cursos.
                </p>
              </div>
            </div>
             <div className="flex items-start gap-4 p-3 rounded-lg bg-muted/50 border border-teal-400/30">
               <div className="pt-1">
                 <Star className="h-6 w-6 text-teal-400" />
              </div>
              <div>
                <h4 className="font-semibold text-teal-400">Diamante (Nível Mestre)</h4>
                <p className="text-sm text-muted-foreground">
                  Requisito especial: Complete 100% dos cursos E tenha uma média
                  de notas em todas as provas superior a 95%.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

