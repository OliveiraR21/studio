
"use client";

import type { LevelInfo } from "@/lib/types";
import { Trophy } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Progress } from "@/components/ui/progress";

interface LevelIndicatorProps {
  levelInfo: LevelInfo;
}

const levelColors: Record<number, string> = {
    0: '#a1a1aa', // Ferro (cinza)
    1: '#a16207', // Bronze
    2: '#d4d4d8', // Prata
    3: '#facc15', // Ouro
    4: '#22d3ee', // Platina (cyan)
    5: '#34d399', // Esmeralda
    6: '#2dd4bf', // Diamante (teal)
    7: '#a78bfa', // Mestre (purple)
    8: '#f472b6', // Grão-Mestre (pink)
    9: '#ef4444', // Desafiante (red)
};


export function LevelIndicator({ levelInfo }: LevelIndicatorProps) {
  const { level, progressPercentage, currentXp, xpForNextLevel, levelName } = levelInfo;
  const trophyColor = levelColors[level] || levelColors[0];
  const isMaxLevel = level === 9;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className="flex items-center gap-2 rounded-full border px-3 py-1 h-9 text-sm font-semibold hover:bg-primary/10 hover:border-primary/50 transition-colors"
        >
          <Trophy className="h-[1.2rem] w-[1.2rem]" style={{ color: trophyColor }} />
          <span>{level}</span>
          <div className="w-10">
            <Progress value={progressPercentage} className="h-1" />
          </div>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-64" align="end">
        <div className="space-y-2">
            <div className="flex justify-between items-baseline">
                <h4 className="font-semibold">{levelName}</h4>
                <span className="text-sm font-bold" style={{color: trophyColor}}>Nível {level}</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
                <span>Progresso</span>
                 <span>{isMaxLevel ? 'Máximo' : `${currentXp.toLocaleString()} / ${xpForNextLevel.toLocaleString()}`}</span>
            </div>
            {isMaxLevel && (
                <p className="text-xs text-center text-primary font-semibold pt-1">Você atingiu o nível máximo!</p>
            )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
