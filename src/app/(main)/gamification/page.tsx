
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
import { Trophy, CheckCircle, BrainCircuit, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

const levelInfoMap: Record<number, { name: string; color: string; bgColor: string; xp: string; description?: string }> = {
  0: { name: 'Ferro', color: 'text-gray-500', bgColor: 'bg-gray-500/10', xp: '0 XP' },
  1: { name: 'Bronze', color: 'text-yellow-600', bgColor: 'bg-yellow-600/10', xp: '150 XP' },
  2: { name: 'Prata', color: 'text-gray-400', bgColor: 'bg-gray-400/10', xp: '800 XP' },
  3: { name: 'Ouro', color: 'text-yellow-400', bgColor: 'bg-yellow-400/10', xp: '1.500 XP' },
  4: { name: 'Platina', color: 'text-cyan-400', bgColor: 'bg-cyan-400/10', xp: '2.500 XP' },
  5: { name: 'Esmeralda', color: 'text-emerald-500', bgColor: 'bg-emerald-500/10', xp: '3.500 XP' },
  6: { name: 'Diamante', color: 'text-teal-400', bgColor: 'bg-teal-400/10', xp: '4.900 XP' },
  7: { name: 'Grão-Mestre', color: 'text-purple-400', bgColor: 'bg-purple-400/10', xp: '6.000 XP' },
  8: { name: 'Mestre', color: 'text-fuchsia-500', bgColor: 'bg-fuchsia-500/10', xp: '8.000 XP' },
  9: { name: 'Extra Classe', color: 'text-red-500', bgColor: 'bg-red-500/10', xp: '10.000+ XP', description: 'Apresentar um projeto e ser aprovado por uma banca' },
};

const xpLogic = [
    { points: 30, description: 'Completar o tour de boas-vindas' },
    { points: 10, description: 'Por cada curso concluído' },
    { points: 50, description: 'Por cada trilha concluída' },
    { points: 500, description: 'Bônus por concluir um módulo inteiro' },
    { points: 25, description: 'Por responder um questionário na primeira tentativa' },
    { points: 30, description: 'Por passar em um questionário (nota >= 90%)' },
    { points: 40, description: 'Bônus por melhorar a nota em um questionário já aprovado' },
    { points: 75, description: 'Bônus de excelência por nota entre 95-99%' },
    { points: 150, description: 'Bônus de perfeição por nota 100%' },
    { points: 2000, description: 'Por ter um projeto Extra Classe aprovado' },
];


export default async function GamificationPage() {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return <UserNotFound />;
  }

  const allModules = await getLearningModules();
  const levelInfo = await calculateUserLevel(currentUser, allModules);

  const currentLevelStyle = levelInfoMap[levelInfo.level as keyof typeof levelInfoMap] || levelInfoMap[0];
  const isMaxLevel = levelInfo.level >= 9;

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
              <span className="text-sm font-medium">Experiência para o próximo nível</span>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Level List Card */}
        <Card>
          <CardHeader>
            <CardTitle>Como Funcionam os Níveis?</CardTitle>
            <CardDescription>
              Seu nível é definido pela quantidade de XP que você acumula.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.values(levelInfoMap).map((levelStyle, index) => (
                      <div key={index} className={cn("flex items-center gap-4 p-3 rounded-lg bg-muted/50", levelStyle.color.replace('text-', 'border-')/30 )}>
                          <div className="pt-1">
                              <Trophy className={cn("h-6 w-6", levelStyle.color)} />
                          </div>
                          <div>
                              <h4 className={cn("font-semibold", levelStyle.color)}>{levelStyle.name} <span className="text-xs font-normal text-muted-foreground">({levelStyle.xp})</span></h4>
                              {levelStyle.description && <p className="text-xs text-muted-foreground italic">{levelStyle.description}</p>}
                          </div>
                      </div>
                  ))}
              </div>
          </CardContent>
        </Card>

        {/* XP Logic Card */}
        <Card>
          <CardHeader>
            <CardTitle>Como o XP é Calculado?</CardTitle>
            <CardDescription>
              Cada ação na plataforma contribui para o seu progresso.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-3">
              {xpLogic.map((item, index) => (
                <li key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <span className="text-sm text-muted-foreground">{item.description}</span>
                  <Badge variant="secondary" className="font-bold text-base shrink-0">+{item.points} XP</Badge>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
