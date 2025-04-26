
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
          margin={{ top: 20, right: 40, left: 15, bottom: 35 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
          <XAxis
            dataKey="date"
            stroke="hsl(var(--muted-foreground))"
            tickLine={false}
            axisLine={false}
            padding={{ left: 10, right: 10 }}
            tick={(props) => {
              const { x, y, payload } = props;
              return (
                <g transform={`translate(${x},${y})`}>
                  <text
                    x={0}
                    y={0}
                    dy={10}
                    textAnchor="end"
                    fill="hsl(var(--muted-foreground))"
                    fontSize={11}
                    transform="rotate(-45)"
                  >
                    {payload.value}
                  </text>
                </g>
              );
            }}
            tickMargin={5}
            height={60}
          />
          <YAxis
            stroke="hsl(var(--muted-foreground))"
            tickLine={false}
            axisLine={false}
            tickFormatter={valueFormatter}
            padding={{ top: 10, bottom: 10 }}
            tick={{ fontSize: 11 }}
            tickMargin={10}
            width={60}
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
          {showLegend && <Legend wrapperStyle={{ paddingTop: 10 }} />}
          {referenceMin !== null && referenceMin !== undefined && (
            <ReferenceLine
              y={referenceMin}
              label={{ 
                value: 'Min', 
                position: 'right', 
                fill: 'hsl(var(--warning))', 
                fontSize: 10,
                offset: 5
              }}
              stroke="hsl(var(--warning))"
              strokeDasharray="3 3"
              opacity={0.5}
            />
          )}
          {referenceMax !== null && referenceMax !== undefined && (
            <ReferenceLine
              y={referenceMax}
              label={{ 
                value: 'Max', 
                position: 'right', 
                fill: 'hsl(var(--warning))', 
                fontSize: 10,
                offset: 5
              }}
              stroke="hsl(var(--warning))"
              strokeDasharray="3 3"
              opacity={0.5}
            />
          )}
          <Line
            type="linear"
            dataKey={dataKey}
            stroke={color}
            activeDot={{ r: 6, stroke: "hsl(var(--background))", strokeWidth: 2 }}
            strokeWidth={2}
            dot={{ fill: "hsl(var(--background))", stroke: color, strokeWidth: 2, r: 4 }}
          />
        </RechartsLineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
