
"use client";

import * as React from "react";
import { Line, LineChart as RechartsLineChart, ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from "recharts";
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
          margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis
            dataKey="date"
            stroke="hsl(var(--muted-foreground))"
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="hsl(var(--muted-foreground))"
            tickLine={false}
            axisLine={false}
            tickFormatter={valueFormatter}
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
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            activeDot={{ r: 8 }}
            strokeWidth={2}
            dot={{ strokeWidth: 2 }}
          />
        </RechartsLineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
