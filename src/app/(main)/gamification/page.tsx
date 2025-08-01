
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
import { Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

const levelInfoMap: Record<number, { name: string; color: string; bgColor: string; description: string, xp: string }> = {
  0: { name: 'Ferro', color: 'text-gray-500', bgColor: 'bg-gray-500/10', description: 'Nível inicial.', xp: '0 XP' },
  1: { name: 'Bronze', color: 'text-yellow-600', bgColor: 'bg-yellow-600/10', description: 'Concluiu as primeiras aulas e a trilha do Módulo Integração.', xp: '150 XP' },
  2: { name: 'Prata', color: 'text-gray-400', bgColor: 'bg-gray-400/10', description: 'Conquistou o Módulo Integração! Um grande marco inicial.', xp: '800 XP' },
  3: { name: 'Ouro', color: 'text-yellow-400', bgColor: 'bg-yellow-400/10', description: 'Avançou significativamente no Módulo Soft Skills ou Human-Machine.', xp: '1.500 XP' },
  4: { name: 'Platina', color: 'text-cyan-400', bgColor: 'bg-cyan-400/10', description: 'Concluiu os 3 módulos menores (Integração, Soft, Human-Machine).', xp: '2.500 XP' },
  5: { name: 'Esmeralda', color: 'text-emerald-500', bgColor: 'bg-emerald-500/10', description: 'Está na metade da jornada do Módulo Hard Skills (o maior desafio).', xp: '3.500 XP' },
  6: { name: 'Diamante', color: 'text-teal-400', bgColor: 'bg-teal-400/10', description: 'Quase um mestre! Concluiu quase todo o Módulo Hard Skills.', xp: '4.200 XP' },
  7: { name: 'Mestre', color: 'text-purple-400', bgColor: 'bg-purple-400/10', description: 'Domínio do Conteúdo! Concluiu 100% de todos os Módulos e Trilhas.', xp: '4.900 XP' },
  8: { name: 'Grão-Mestre', color: 'text-fuchsia-500', bgColor: 'bg-fuchsia-500/10', description: 'Status de Elite. Além de concluir tudo, continuou engajado com logins e melhoria de notas.', xp: '6.000 XP' },
  9: { name: 'Desafiante', color: 'text-red-500', bgColor: 'bg-red-500/10', description: 'Lenda da Plataforma. Um reconhecimento para os mais dedicados a longo prazo.', xp: '8.000+ XP' },
};

export default async function GamificationPage() {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return <UserNotFound />;
  }

  // A mesma lógica do layout é usada aqui para garantir consistência.
  const allModules = await getLearningModules();
  const levelInfo = await calculateUserLevel(currentUser, allModules);

  const currentLevelStyle = levelInfoMap[levelInfo.level as keyof typeof levelInfoMap] || levelInfoMap[0];
  const isMaxLevel = levelInfo.level === 9;

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
              {levelInfo.currentXp.toLocaleString()} XP
            </h3>
            <p className="text-muted-foreground">
              Pontos de Experiência totais acumulados.
            </p>
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Progresso para o próximo nível</span>
              <span className="text-sm font-bold">{isMaxLevel ? 'Nível Máximo!' : `${levelInfo.currentXp.toLocaleString()} / ${levelInfo.xpForNextLevel.toLocaleString()} XP`}</span>
            </div>
            <Progress value={isMaxLevel ? 100 : levelInfo.progressPercentage} className="h-3" />
          </div>
          {isMaxLevel && (
            <div className="text-center pt-4">
                 <p className="font-semibold text-red-500">Parabéns! Você alcançou o nível máximo da plataforma!</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* How it Works Card */}
      <Card>
        <CardHeader>
          <CardTitle>Como Funcionam os Níveis?</CardTitle>
          <CardDescription>
            Seu nível é calculado com base nos Pontos de Experiência (XP) que você acumula.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.values(levelInfoMap).map((levelStyle, index) => (
                     <div key={index} className={cn("flex items-start gap-4 p-3 rounded-lg bg-muted/50", levelStyle.color.replace('text-', 'border-')/30 )}>
                        <div className="pt-1">
                            <Trophy className={cn("h-6 w-6", levelStyle.color)} />
                        </div>
                        <div>
                            <h4 className={cn("font-semibold", levelStyle.color)}>{levelStyle.name} <span className="text-xs font-normal text-muted-foreground">({levelStyle.xp})</span></h4>
                            <p className="text-sm text-muted-foreground">
                            {levelStyle.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
