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

  // --- Responsive Margins for All Screen Sizes ---
  const getResponsiveMargins = () => {
    const isMobile = screenSize.width <= 768;
    const isTablet = screenSize.width <= 1024;
    const isLargeScreen = screenSize.width >= 1920;
    const isExtraLargeScreen = screenSize.width >= 2560;
    
    if (isMobile) {
      return { top: 15, right: 20, left: 40, bottom: 80 };
    } else if (isTablet) {
      return { top: 20, right: 25, left: 50, bottom: 120 };
    } else if (isExtraLargeScreen) {
      return { top: 30, right: 50, left: 80, bottom: 250 };
    } else if (isLargeScreen) {
      return { top: 25, right: 40, left: 70, bottom: 220 };
    }
    
    // Default margins for standard screens
    return { top: 20, right: 30, left: 60, bottom: 200 };
  };

  // --- Dynamic X-Axis Configuration for All Screen Sizes ---
  const getXAxisConfig = () => {
    const isMobile = screenSize.width <= 768;
    const isTablet = screenSize.width <= 1024;
    const isLargeScreen = screenSize.width >= 1920;
    const isExtraLargeScreen = screenSize.width >= 2560;
    
    if (isMobile) {
      return {
        angle: 0, // No angle on mobile for better readability
        height: 60,
        dy: 15,
        fontSize: 10,
        interval: Math.ceil(data.length / 4), // Show fewer labels on mobile
        textAnchor: 'middle' as const
      };
    } else if (isTablet) {
      return {
        angle: -15, // Slight angle on tablet
        height: 80,
        dy: 25,
        fontSize: 10,
        interval: Math.ceil(data.length / 6),
        textAnchor: 'end' as const
      };
    } else if (isExtraLargeScreen) {
      return {
        angle: -30, // Less aggressive angle for ultra-wide
        height: 160,
        dy: 40,
        fontSize: 12,
        interval: 0,
        textAnchor: 'end' as const
      };
    } else if (isLargeScreen) {
      return {
        angle: -35, // Moderate angle for large screens
        height: 150,
        dy: 35,
        fontSize: 11,
        interval: 0,
        textAnchor: 'end' as const
      };
    }
    
    // Default configuration for standard screens
    return {
      angle: -45, // Standard angle for desktop
      height: 120,
      dy: 30,
      fontSize: 10,
      interval: 0,
      textAnchor: 'end' as const
    };
  };

  // --- Dynamic Y-Axis Configuration ---
  const getYAxisConfig = () => {
    const isMobile = screenSize.width <= 768;
    const isTablet = screenSize.width <= 1024;
    
    if (isMobile) {
      return {
        width: 35,
        fontSize: 10,
        tickFormatter: (value: number) => value.toFixed(1)
      };
    } else if (isTablet) {
      return {
        width: 40,
        fontSize: 10,
        tickFormatter: (value: number) => value.toFixed(1)
      };
    }
    
    return {
      width: 60,
      fontSize: 11,
      tickFormatter: (value: number) => value.toFixed(1)
    };
  };

  const margins = getResponsiveMargins();
  const xAxisConfig = getXAxisConfig();
  const yAxisConfig = getYAxisConfig();

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
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="hsl(var(--muted))"
            opacity={0.3}
          />
          
          <XAxis
            dataKey="date"
            stroke="hsl(var(--muted-foreground))"
            fontSize={xAxisConfig.fontSize}
            angle={xAxisConfig.angle}
            height={xAxisConfig.height}
            dy={xAxisConfig.dy}
            interval={xAxisConfig.interval}
            textAnchor={xAxisConfig.textAnchor}
            tickLine={false}
            axisLine={false}
            tick={{ fill: 'hsl(var(--muted-foreground))' }}
          />
          
          <YAxis
            stroke="hsl(var(--muted-foreground))"
            fontSize={yAxisConfig.fontSize}
            width={yAxisConfig.width}
            tickFormatter={yAxisConfig.tickFormatter}
            tickLine={false}
            axisLine={false}
            tick={{ fill: 'hsl(var(--muted-foreground))' }}
          />
          
          <Tooltip
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                return (
                  <ChartTooltipContent
                    active={active}
                    payload={payload}
                    label={label}
                    formatter={(value) => valueFormatter(Number(value))}
                  />
                );
              }
              return null;
            }}
          />
          
          {showLegend && (
            <Legend 
              verticalAlign="top" 
              height={36}
              iconType="circle"
              iconSize={8}
            />
          )}
          
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            strokeWidth={2}
            dot={{ fill: color, strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, strokeWidth: 2 }}
            connectNulls={false}
          />
          
          {/* Reference Lines */}
          {referenceMin !== null && (
            <ReferenceLine
              y={referenceMin}
              stroke="hsl(var(--warning))"
              strokeDasharray="3 3"
              strokeWidth={1}
              label={{
                value: `Min: ${referenceMin}`,
                position: 'insideBottomLeft',
                fontSize: 10,
                fill: 'hsl(var(--warning))'
              }}
            />
          )}
          
          {referenceMax !== null && (
            <ReferenceLine
              y={referenceMax}
              stroke="hsl(var(--destructive))"
              strokeDasharray="3 3"
              strokeWidth={1}
              label={{
                value: `Max: ${referenceMax}`,
                position: 'insideTopLeft',
                fontSize: 10,
                fill: 'hsl(var(--destructive))'
              }}
            />
          )}
        </RechartsLineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
