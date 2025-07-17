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
  if (!data || data.length === 0) {
    return (
      <div className="h-full w-full flex items-center justify-center border border-dashed rounded-lg">
        <p className="text-muted-foreground text-sm">No data available</p>
      </div>
    );
  }

  // --- Y-Axis Domain Calculation ---
  const getYAxisDomain = () => {
    let allValues = data.map((d) => d[dataKey]);
    let min = Math.min(...allValues);
    let max = Math.max(...allValues);

    // Optionally include min/max from reference if present 
    if (referenceMin !== null && referenceMin !== undefined) {
      min = Math.min(min, referenceMin);
    }
    if (referenceMax !== null && referenceMax !== undefined) {
      max = Math.max(max, referenceMax);
    }

    // If there is only 1 data point, pad above/below for visual centering
    if (min === max) {
      if (min === 0) { max = 1; } // guard for 0
      else {
        min = min - Math.abs(min) * 0.1;
        max = max + Math.abs(max) * 0.1;
      }
    } else {
      // pad slightly for multi-point charts
      const range = max - min;
      min = min - range * 0.05;
      max = max + range * 0.05;
    }

    // Prevent min/max being exactly the same (would throw recharts warning)
    if (min === max) {
      max = min + 1;
    }

    return [min, max];
  };

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
          margin={{ top: 20, right: 30, left: 60, bottom: 120 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
          <XAxis
            dataKey="date"
            stroke="hsl(var(--muted-foreground))"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 10 }}
            angle={-45}
            textAnchor="end"
            height={80}
            interval={0}
            dy={10}
          />
          <YAxis
            stroke="hsl(var(--muted-foreground))"
            tickLine={false}
            axisLine={false}
            tickFormatter={valueFormatter}
            tick={{ fontSize: 10 }}
            width={80}
            domain={getYAxisDomain()}
            dx={-10}
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
          {referenceMin !== null && referenceMin !== undefined && (
            <ReferenceLine
              y={referenceMin}
              label={{ 
                value: 'Min', 
                position: 'right', 
                fill: 'hsl(var(--warning))', 
                fontSize: 10
              }}
              stroke="hsl(var(--warning))"
              strokeDasharray="3 3"
              opacity={0.7}
            />
          )}
          {referenceMax !== null && referenceMax !== undefined && (
            <ReferenceLine
              y={referenceMax}
              label={{ 
                value: 'Max', 
                position: 'right', 
                fill: 'hsl(var(--warning))', 
                fontSize: 10
              }}
              stroke="hsl(var(--warning))"
              strokeDasharray="3 3"
              opacity={0.7}
            />
          )}
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            strokeWidth={2}
            dot={{ 
              fill: color, 
              strokeWidth: 2, 
              r: 4 
            }}
            activeDot={{ 
              r: 6, 
              strokeWidth: 2,
              fill: color
            }}
          />
        </RechartsLineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
