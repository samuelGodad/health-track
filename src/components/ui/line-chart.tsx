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
  const [screenSize, setScreenSize] = React.useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1920,
    height: typeof window !== 'undefined' ? window.innerHeight : 1080
  });

  // Listen for window resize events
  React.useEffect(() => {
    const handleResize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  if (!data || data.length === 0) {
    return (
      <div className="h-full w-full flex items-center justify-center border border-dashed rounded-lg">
        <p className="text-muted-foreground text-sm">No data available</p>
      </div>
    );
  }

  // --- Responsive Margins for Large Screens ---
  const getResponsiveMargins = () => {
    const isLargeScreen = screenSize.width >= 1920; // 4K and large desktop
    const isExtraLargeScreen = screenSize.width >= 2560; // Ultra-wide
    
    if (isExtraLargeScreen) {
      return { top: 30, right: 50, left: 80, bottom: 250 };
    } else if (isLargeScreen) {
      return { top: 25, right: 40, left: 70, bottom: 220 };
    }
    
    // Default margins for standard screens
    return { top: 20, right: 30, left: 60, bottom: 200 };
  };

  // --- Dynamic X-Axis Configuration for Large Screens ---
  const getXAxisConfig = () => {
    const isLargeScreen = screenSize.width >= 1920;
    const isExtraLargeScreen = screenSize.width >= 2560;
    
    if (isExtraLargeScreen) {
      return {
        angle: -30, // Less aggressive angle for ultra-wide
        height: 160,
        dy: 40,
        fontSize: 12,
        interval: 0
      };
    } else if (isLargeScreen) {
      return {
        angle: -35, // Moderate angle for large screens
        height: 150,
        dy: 35,
        fontSize: 11,
        interval: 0
      };
    }
    
    // Default configuration for standard screens
    return {
      angle: -45,
      height: 140,
      dy: 30,
      fontSize: 10,
      interval: 0
    };
  };

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

  // Get responsive configurations
  const margins = getResponsiveMargins();
  const xAxisConfig = getXAxisConfig();

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
          margin={margins}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
          <XAxis
            dataKey="date"
            stroke="hsl(var(--muted-foreground))"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: xAxisConfig.fontSize }}
            angle={xAxisConfig.angle}
            textAnchor="end"
            height={xAxisConfig.height}
            interval={xAxisConfig.interval}
            dy={xAxisConfig.dy}
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
