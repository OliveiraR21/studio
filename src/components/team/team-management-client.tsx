
"use client";

import type { User, UserRole } from "@/lib/types";
import { useState, useMemo, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Users, GaugeCircle, AreaChart } from "lucide-react";
import { getLearningModules } from "@/lib/data-access";
import type { Module } from "@/lib/types";

interface TeamManagementClientProps {
  teamMembers: User[];
  allCoursesCount: number; // Now passed as a prop
}

const ROLE_ORDER: UserRole[] = ['Assistente', 'Analista', 'Supervisor', 'Coordenador', 'Gerente', 'Diretor', 'Admin'];

export function TeamManagementClient({ teamMembers, allCoursesCount }: TeamManagementClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [managerFilter, setManagerFilter] = useState("all");
  
  const totalCourses = allCoursesCount > 0 ? allCoursesCount : 1; // Avoid division by zero

  // Calculate the average score for a user
  const calculateAverageScore = (user: User): number => {
      const allScores = [...(user.courseScores ?? []).map(s => s.score), ...(user.trackScores ?? []).map(s => s.score)];
      if (allScores.length === 0) return 0;
      return Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length);
  };

  // Calculate course completion percentage
  const calculateCompletionPercentage = (user: User): number => {
      const completedCount = user.completedCourses.length;
      return Math.round((completedCount / totalCourses) * 100);
  };

  const roles = useMemo(() => {
    const uniqueRoles = [...new Set(teamMembers.map((m) => m.role))];
    return uniqueRoles.sort((a, b) => {
        const indexA = ROLE_ORDER.indexOf(a);
        const indexB = ROLE_ORDER.indexOf(b);
        if (indexA === -1) return 1;
        if (indexB === -1) return -1;
        return indexA - indexB;
    });
  }, [teamMembers]);

  const managers = useMemo(
    () => [
      ...new Set(
        teamMembers
          .flatMap((m) => [m.supervisor, m.coordenador, m.gerente, m.diretor])
          .filter((m): m is string => !!m)
          .sort()
      ),
    ],
    [teamMembers]
  );

  const filteredMembers = useMemo(() => {
    let members = teamMembers;

    if (searchQuery) {
      members = members.filter((member) =>
        member.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (roleFilter !== "all") {
      members = members.filter((member) => member.role === roleFilter);
    }
    if (managerFilter !== "all") {
      members = members.filter(
        (member) =>
          member.supervisor === managerFilter ||
          member.coordenador === managerFilter ||
          member.gerente === managerFilter ||
          member.diretor === managerFilter
      );
    }

    return members;
  }, [searchQuery, roleFilter, managerFilter, teamMembers]);
  
  const teamAverageProgress = useMemo(() => {
    if (filteredMembers.length === 0) return 0;
    const totalProgress = filteredMembers.reduce(
      (sum, member) => sum + calculateCompletionPercentage(member),
      0
    );
    return Math.round(totalProgress / filteredMembers.length);
  }, [filteredMembers, calculateCompletionPercentage]);

  const teamAverageScore = useMemo(() => {
    if (filteredMembers.length === 0) return 0;
    const totalScore = filteredMembers.reduce(
      (sum, member) => sum + calculateAverageScore(member),
      0
    );
    return Math.round(totalScore / filteredMembers.length);
  }, [filteredMembers]);

  return (
      <div className="space-y-6">
        {/* Dashboard Section */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Membros Filtrados</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{filteredMembers.length}</div>
                <p className="text-xs text-muted-foreground">de {teamMembers.length} membros no total</p>
            </CardContent>
            </Card>
            <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Progresso Médio</CardTitle>
                <AreaChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{teamAverageProgress}%</div>
                <Progress value={teamAverageProgress} className="h-2 mt-2" />
            </CardContent>
            </Card>
            <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Média das Notas</CardTitle>
                <GaugeCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{teamAverageScore}%</div>
                <p className="text-xs text-muted-foreground">Média das notas da equipe filtrada</p>
            </CardContent>
            </Card>
        </div>

        {/* Table Section */}
        <Card>
            <CardHeader>
                <CardTitle>Visão Detalhada da Equipe</CardTitle>
                <CardDescription>Use os filtros para analisar o progresso de grupos específicos.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex flex-col md:flex-row gap-4 p-4 border rounded-lg bg-muted/50">
                    <div className="grid w-full md:max-w-sm items-center gap-1.5">
                        <Label htmlFor="search-name">Filtrar por nome</Label>
                        <Input
                            id="search-name"
                            placeholder="Digite um nome..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="grid w-full md:max-w-xs items-center gap-1.5">
                        <Label htmlFor="filter-role">Filtrar por Cargo</Label>
                        <Select value={roleFilter} onValueChange={setRoleFilter}>
                            <SelectTrigger id="filter-role" className="w-full">
                                <SelectValue placeholder="Selecione um cargo" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos os Cargos</SelectItem>
                                {roles.map(role => (
                                    <SelectItem key={role} value={role}>{role}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                     <div className="grid w-full md:max-w-xs items-center gap-1.5">
                        <Label htmlFor="filter-manager">Filtrar por Gestor</Label>
                        <Select value={managerFilter} onValueChange={setManagerFilter}>
                            <SelectTrigger id="filter-manager" className="w-full">
                                <SelectValue placeholder="Selecione um gestor" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos os Gestores</SelectItem>
                                {managers.map(manager => (
                                    <SelectItem key={manager} value={manager}>{manager}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
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
      </div>
  );
}
