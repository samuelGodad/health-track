
"use client";

import * as React from "react";
import { Line, LineChart as RechartsLineChart, ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ReferenceLine } from "recharts";
import { ChartContainer, ChartTooltipContent } from "./chart";

export interface LineChartProps {
  data: Array<{
    date: string;
    value: number;
    [key: string]: any;
  }>;
  dataKey: string;
  title?: string;
  tooltipLabel?: string;
  color?: string;
  showLegend?: boolean;
  valueFormatter?: (value: number) => string;
  className?: string;
  referenceMin?: number | null;
  referenceMax?: number | null;
}

export function LineChart({
  data,
  dataKey,
  title,
  tooltipLabel,
  color = "hsl(var(--primary))",
  showLegend = false,
  valueFormatter = (value: number) => `${value}`,
  className,
  referenceMin,
  referenceMax,
}: LineChartProps) {
  return (
    <ChartContainer
      className={className}
      config={{
        [dataKey]: {
          color,
          label: tooltipLabel || dataKey,
        },
      }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLineChart
          data={data}
          margin={{ top: 30, right: 30, left: 30, bottom: 30 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
          <XAxis
            dataKey="date"
            stroke="hsl(var(--muted-foreground))"
            tickLine={false}
            axisLine={false}
            padding={{ left: 20, right: 20 }}
          />
          <YAxis
            stroke="hsl(var(--muted-foreground))"
            tickLine={false}
            axisLine={false}
            tickFormatter={valueFormatter}
            padding={{ top: 20, bottom: 20 }}
          />
          <Tooltip
            content={({
              active,
              payload,
              label,
            }: {
              active?: boolean;
              payload?: Array<{ value: number }>;
              label?: string;
            }) => (
              <ChartTooltipContent
                active={active}
                payload={payload}
                label={label}
                formatter={(value) => valueFormatter(Number(value))}
              />
            )}
          />
          {showLegend && <Legend />}
          {referenceMin !== null && (
            <ReferenceLine
              y={referenceMin}
              label={{ value: 'Min', position: 'right' }}
              stroke="hsl(var(--warning))"
              strokeDasharray="3 3"
              opacity={0.5}
            />
          )}
          {referenceMax !== null && (
            <ReferenceLine
              y={referenceMax}
              label={{ value: 'Max', position: 'right' }}
              stroke="hsl(var(--warning))"
              strokeDasharray="3 3"
              opacity={0.5}
            />
          )}
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            activeDot={{ r: 8, stroke: "hsl(var(--background))", strokeWidth: 2 }}
            strokeWidth={2}
            dot={{ fill: "hsl(var(--background))", stroke: color, strokeWidth: 2, r: 4 }}
          />
        </RechartsLineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
