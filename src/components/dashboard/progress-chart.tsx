"use client"

import { PieChart, Pie, Cell, Tooltip } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
    ChartContainer,
    ChartTooltipContent,
  } from "@/components/ui/chart"

interface ProgressChartProps {
  completed: number;
  total: number;
}

export function ProgressChart({ completed, total }: ProgressChartProps) {
  const remaining = total - completed;
  const percentage = total > 0 ? (completed / total) * 100 : 0;
  
  const chartData = [
    { name: 'Concluídos', value: completed, fill: 'hsl(var(--primary))' },
    { name: 'Pendentes', value: remaining, fill: 'hsl(var(--muted))' },
  ];

  const chartConfig = {
    completed: {
      label: "Concluídos",
    },
    pending: {
      label: "Pendentes",
    },
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Evolução</CardTitle>
        <CardDescription>
          Você completou {completed} de {total} cursos.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex items-center justify-center">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square h-[200px]">
          <PieChart>
            <Tooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              strokeWidth={5}
            >
                {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
            </Pie>
             <text
                x="50%"
                y="50%"
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-foreground text-3xl font-bold"
             >
                {`${Math.round(percentage)}%`}
            </text>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
