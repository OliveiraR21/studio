
"use client";

import type { LevelInfo } from "@/lib/types";
import { Trophy } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Progress } from "@/components/ui/progress";

interface LevelIndicatorProps {
  levelInfo: LevelInfo;
}

const levelColors = [
    '#a16207', // Nível 1 (Bronze)
    '#d4d4d8', // Nível 2 (Prata)
    '#facc15', // Nível 3 (Ouro)
    '#2dd4bf', // Nível 4 (Diamante)
];

export function LevelIndicator({ levelInfo }: LevelIndicatorProps) {
  const { level, progressPercentage, currentXp, xpForNextLevel, levelName } = levelInfo;
  const trophyColor = levelColors[level - 1] || levelColors[0];
  const isMaxLevel = level === Object.keys(levelColors).length;

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
                <span>XP Atual: {currentXp}</span>
                 {!isMaxLevel && (
                    <span>Próximo Nível: {xpForNextLevel}</span>
                )}
            </div>
            {isMaxLevel && (
                <p className="text-xs text-center text-primary font-semibold pt-1">Você atingiu o nível máximo!</p>
            )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
