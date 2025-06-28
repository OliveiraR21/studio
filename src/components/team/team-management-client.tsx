"use client";

import type { User } from "@/lib/types";
import { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { learningModules } from "@/lib/data";

interface TeamManagementClientProps {
  teamMembers: User[];
}

// Calculate the average score for a user
const calculateAverageScore = (user: User): number => {
    const allScores = [...(user.courseScores ?? []).map(s => s.score), ...(user.trackScores ?? []).map(s => s.score)];
    if (allScores.length === 0) return 0;
    return Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length);
};

// Calculate course completion percentage
const calculateCompletionPercentage = (user: User): number => {
    const totalCourses = learningModules.reduce((sum, module) => sum + module.tracks.reduce((trackSum, track) => trackSum + track.courses.length, 0), 0);
    if (totalCourses === 0) return 0;
    const completedCount = user.completedCourses.length;
    return Math.round((completedCount / totalCourses) * 100);
};

export function TeamManagementClient({ teamMembers }: TeamManagementClientProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredMembers = useMemo(() => {
    if (!searchQuery) return teamMembers;
    return teamMembers.filter(member =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, teamMembers]);

  return (
      <Card>
        <CardContent className="p-4 space-y-4">
            <div>
                <Input
                    placeholder="Filtrar por nome..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="max-w-sm"
                />
            </div>
            <div className="rounded-md border">
                <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Função</TableHead>
                    <TableHead className="w-[250px]">Progresso Geral</TableHead>
                    <TableHead className="text-center">Média das Notas</TableHead>
                    <TableHead className="text-center">Cursos Concluídos</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredMembers.length > 0 ? (
                        filteredMembers.map((user) => {
                            const averageScore = calculateAverageScore(user);
                            const completionPercentage = calculateCompletionPercentage(user);
                            return (
                                <TableRow key={user.id}>
                                    <TableCell className="font-medium">{user.name}</TableCell>
                                    <TableCell>
                                    <Badge variant="secondary">
                                        {user.role}
                                    </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Progress value={completionPercentage} className="h-2 w-[150px]" />
                                            <span className="text-xs text-muted-foreground font-medium">
                                                {completionPercentage}%
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center font-bold text-lg">
                                        <span className={averageScore >= 70 ? 'text-green-500' : 'text-amber-500'}>
                                            {averageScore}%
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-center font-bold text-lg">
                                        {user.completedCourses.length}
                                    </TableCell>
                                </TableRow>
                            )
                        })
                    ) : (
                         <TableRow>
                            <TableCell colSpan={5} className="text-center text-muted-foreground py-10">
                                Nenhum membro da equipe encontrado com os critérios de busca.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
                </Table>
            </div>
        </CardContent>
      </Card>
  );
}
