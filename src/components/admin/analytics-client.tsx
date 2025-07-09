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
import { Clock, Users, AreaChart, AlertCircle } from "lucide-react";
import Link from 'next/link';

interface AnalyticsClientProps {
  data: AnalyticsData;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm max-w-sm">
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col space-y-1">
            <span className="text-[0.70rem] uppercase text-muted-foreground">
              Curso
            </span>
            <Link href={`/courses/${data.courseId}`} className="font-bold text-primary hover:underline">
              {data.courseTitle}
            </Link>
          </div>
          <div className="flex flex-col space-y-1">
            <span className="text-[0.70rem] uppercase text-muted-foreground">
              Taxa de Erro
            </span>
            <span className="font-bold text-destructive">{`${data.errorRate}%`}</span>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-2">{data.fullQuestion}</p>
      </div>
    );
  }

  return null;
};

export function AnalyticsClient({ data }: AnalyticsClientProps) {
  const { engagementStats, questionProficiency, totalUsers } = data;

  const chartData = questionProficiency.map(q => ({
    name: q.questionText.length > 50 ? `${q.questionText.substring(0, 50)}...` : q.questionText,
    fullQuestion: q.questionText,
    errorRate: q.errorRate,
    courseTitle: q.courseTitle,
    courseId: q.courseId,
  })).reverse(); // Reverse to have highest error rate at the top

  return (
    <div className="space-y-6">
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
                <XAxis type="number" dataKey="errorRate" unit="%" />
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
                <Bar dataKey="errorRate" layout="vertical" fill="hsl(var(--destructive))" radius={[0, 4, 4, 0]} />
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
