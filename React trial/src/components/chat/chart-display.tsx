"use client"

import { Bar, BarChart, CartesianGrid, Line, LineChart, ReferenceLine, Tooltip, XAxis, YAxis } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { TrendingUp } from 'lucide-react';

interface ChartDisplayProps {
  type: 'line' | 'bar';
  data: any[];
  title: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  refLines?: {
    lsl?: number;
    usl?: number;
    target?: number;
  };
}

const lineChartConfig = {
  value: {
    label: "Value",
    color: "hsl(var(--accent))",
  },
} satisfies ChartConfig;

const barChartConfig = {
    count: {
      label: "Count",
      color: "hsl(var(--primary))",
    },
  } satisfies ChartConfig;

export function ChartDisplay({ type, data, title, xAxisLabel, yAxisLabel, refLines }: ChartDisplayProps) {
  const chartConfig = type === 'line' ? lineChartConfig : barChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{type === 'line' ? 'Time-series view of parameter readings.' : 'Distribution of parameter values.'}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
          {type === 'line' ? (
            <LineChart data={data} margin={{ left: 12, right: 12 }}>
              <CartesianGrid vertical={false} />
              <XAxis 
                dataKey="label" 
                tickLine={false} 
                axisLine={false} 
                tickMargin={8}
                label={xAxisLabel ? { value: xAxisLabel, position: 'insideBottom', offset: -5 } : undefined}
              />
              <YAxis 
                domain={['dataMin - 0.1', 'dataMax + 0.1']}
                label={yAxisLabel ? { value: yAxisLabel, angle: -90, position: 'insideLeft' } : undefined}
              />
              <Tooltip cursor={false} content={<ChartTooltipContent indicator="line" hideLabel />} />
              {refLines?.lsl !== undefined && (
                <ReferenceLine y={refLines.lsl} stroke="red" strokeDasharray="5 5" label="LSL" />
              )}
              {refLines?.usl !== undefined && (
                <ReferenceLine y={refLines.usl} stroke="red" strokeDasharray="5 5" label="USL" />
              )}
              {refLines?.target !== undefined && (
                <ReferenceLine y={refLines.target} stroke="green" strokeDasharray="3 3" label="Target" />
              )}
              <Line dataKey="value" type="monotone" stroke="var(--color-value)" strokeWidth={2} dot={true} />
            </LineChart>
          ) : (
            <BarChart data={data} margin={{ left: 12, right: 12 }}>
                <CartesianGrid vertical={false} />
                <XAxis 
                  dataKey="value" 
                  tickLine={false} 
                  axisLine={false} 
                  tickMargin={8}
                  label={xAxisLabel ? { value: xAxisLabel, position: 'insideBottom', offset: -5 } : undefined}
                />
                <YAxis 
                  label={yAxisLabel ? { value: yAxisLabel, angle: -90, position: 'insideLeft' } : undefined}
                />
                <Tooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                <Bar dataKey="count" fill="var(--color-count)" radius={4} />
            </BarChart>
          )}
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

interface RunChartStatsProps {
    stats: {
        min: string;
        max: string;
        avg: string;
        count: number;
    }
}

export function RunChartStats({ stats }: RunChartStatsProps) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Parameter Analysis</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div>
                        <p className="text-muted-foreground">Average</p>
                        <p className="font-semibold text-lg">{stats.avg}</p>
                    </div>
                    <div>
                        <p className="text-muted-foreground">Min Reading</p>
                        <p className="font-semibold text-lg">{stats.min}</p>
                    </div>
                    <div>
                        <p className="text-muted-foreground">Max Reading</p>
                        <p className="font-semibold text-lg">{stats.max}</p>
                    </div>
                    <div>
                        <p className="text-muted-foreground">Data Points</p>
                        <p className="font-semibold text-lg">{stats.count}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
