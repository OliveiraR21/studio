
"use client";

import type { AnalyticsData } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Clock, Users, AreaChart, AlertCircle, Download } from "lucide-react";
import Link from 'next/link';
import { Button } from "../ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AnalyticsClientProps {
  data: AnalyticsData;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm max-w-sm">
        <div className="flex flex-col space-y-1 mb-2">
            <span className="text-[0.70rem] uppercase text-muted-foreground">
                Curso
            </span>
            <Link href={`/courses/${data.courseId}`} className="font-bold text-primary hover:underline">
                {data.courseTitle}
            </Link>
        </div>
        <p className="text-xs text-muted-foreground mb-2">{data.fullQuestion}</p>
        <div className="grid grid-cols-2 gap-2 border-t pt-2">
          <div className="flex flex-col space-y-1">
            <span className="text-[0.70rem] uppercase text-muted-foreground">
              Taxa de Acerto
            </span>
            <span className="font-bold text-green-600">{`${data.successRate}%`}</span>
          </div>
          <div className="flex flex-col space-y-1">
            <span className="text-[0.70rem] uppercase text-muted-foreground">
              Taxa de Erro
            </span>
            <span className="font-bold text-destructive">{`${data.errorRate}%`}</span>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export function AnalyticsClient({ data }: AnalyticsClientProps) {
  const { toast } = useToast();
  const { engagementStats, questionProficiency, totalUsers } = data;

  const chartData = questionProficiency.map(q => ({
    name: q.questionText.length > 50 ? `${q.questionText.substring(0, 50)}...` : q.questionText,
    fullQuestion: q.questionText,
    errorRate: q.errorRate,
    successRate: 100 - q.errorRate,
    courseTitle: q.courseTitle,
    courseId: q.courseId,
  })).sort((a, b) => b.errorRate - a.errorRate);

  const handleDownloadProficiency = () => {
    const headers = ["Questão", "Curso", "Taxa de Erro (%)"];
    const rows = questionProficiency.map(q => [
        `"${q.questionText.replace(/"/g, '""')}"`, // Escape double quotes
        `"${q.courseTitle.replace(/"/g, '""')}"`,
        q.errorRate
    ]);

    let csvContent = "data:text/csv;charset=utf-8," 
        + headers.join(",") + "\n" 
        + rows.map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "relatorio_proficiencia_questoes.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Download Iniciado",
      description: "O relatório de proficiência por questão foi baixado.",
    });
  };
  
  const handleDownloadEngagement = () => {
      toast({
          title: "Funcionalidade em desenvolvimento",
          description: "O download para este relatório ainda não está disponível.",
      });
  };

  return (
    <div className="container mx-auto space-y-6">
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-3xl font-bold">Relatórios e Análises</h1>
                <p className="text-muted-foreground">
                    Insights sobre o engajamento dos usuários e a eficácia do conteúdo.
                </p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button>
                  <Download className="mr-2 h-4 w-4" />
                  Baixar Relatórios
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Escolha um relatório</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleDownloadProficiency}
                  disabled={chartData.length === 0}
                >
                  Proficiência por Questão
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDownloadEngagement}>
                  Engajamento de Usuários
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
        </div>

      {/* Engagement Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuários Ativos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
            <p className="text-xs text-muted-foreground">Total de usuários na plataforma</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Conclusão Média</CardTitle>
            <AreaChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{engagementStats.completionRate}%</div>
            <p className="text-xs text-muted-foreground">Média de cursos concluídos por usuário</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tempo Médio de Sessão</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{engagementStats.avgSessionTime}</div>
            <p className="text-xs text-muted-foreground">Dados simulados</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Horário de Pico</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{engagementStats.peakTime}</div>
            <p className="text-xs text-muted-foreground">Dados simulados</p>
          </CardContent>
        </Card>
      </div>

      {/* Question Proficiency Report */}
      <Card>
        <CardHeader>
          <CardTitle>Proficiência por Questão</CardTitle>
          <CardDescription>
            As 10 perguntas de quiz com a maior taxa de erro simulada. Isso pode indicar conteúdo que precisa de revisão ou perguntas que podem ser melhoradas.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                layout="vertical"
                data={chartData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" domain={[0, 100]} unit="%" />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={250}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  cursor={{ fill: 'hsl(var(--muted))' }}
                  content={<CustomTooltip />}
                />
                <Bar dataKey="successRate" stackId="a" fill="hsla(145, 63%, 42%, 0.2)" stroke="hsl(145, 63%, 42%)" strokeWidth={1} />
                <Bar dataKey="errorRate" stackId="a" fill="hsla(0, 100%, 70%, 0.2)" stroke="hsl(0, 84.2%, 60.2%)" strokeWidth={1} radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
             <div className="flex flex-col items-center justify-center text-center p-6 gap-3 text-muted-foreground">
                <AlertCircle className="h-10 w-10" />
                <p className="font-semibold">Nenhum dado de questionário encontrado</p>
                <p className="text-sm">Crie cursos com questionários para ver este relatório.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
