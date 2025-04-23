
import { useMemo } from 'react';
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  TooltipProps
} from 'recharts';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DataPoint {
  date: string;
  value: number;
  [key: string]: any;
}

interface LineChartProps {
  title: string;
  data: DataPoint[];
  dataKey: string;
  color?: string;
  valueFormatter?: (value: number) => string;
  className?: string;
  yAxisWidth?: number;
  showGrid?: boolean;
  showXAxis?: boolean;
  showYAxis?: boolean;
  tooltipLabel?: string;
}

export function LineChart({
  title,
  data,
  dataKey,
  color = "hsl(var(--primary))",
  valueFormatter = (value: number) => `${value}`,
  className,
  yAxisWidth = 40,
  showGrid = true,
  showXAxis = true,
  showYAxis = true,
  tooltipLabel = "Value",
}: LineChartProps) {
  const sortedData = useMemo(() => 
    [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()), 
    [data]
  );

  const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background/95 border border-border p-3 rounded-lg shadow-lg backdrop-blur-sm">
          <p className="text-sm font-medium mb-1">{label}</p>
          <p className="text-sm text-primary font-semibold">
            {tooltipLabel}: {valueFormatter(payload[0].value as number)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className={cn(
      "overflow-hidden transition-all duration-300 hover:shadow-md",
      "border border-border/50 bg-card/90 backdrop-blur-sm",
      className
    )}>
      <CardHeader className="pb-2 pt-4 px-6">
        <CardTitle className="text-base font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent className="px-2 pb-4 pt-0">
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsLineChart data={sortedData} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
              {showGrid && (
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  vertical={false} 
                  stroke="hsl(var(--border))" 
                  opacity={0.3} 
                />
              )}
              <XAxis 
                dataKey="date" 
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} 
                tickLine={false}
                axisLine={{ stroke: 'hsl(var(--border))', opacity: 0.3 }}
                hide={!showXAxis}
              />
              <YAxis 
                width={yAxisWidth}
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} 
                tickLine={false}
                axisLine={{ stroke: 'hsl(var(--border))', opacity: 0.3 }}
                tickFormatter={valueFormatter}
                hide={!showYAxis}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'hsl(var(--muted))', strokeWidth: 1 }} />
              <Line
                type="monotone"
                dataKey={dataKey}
                stroke={color}
                strokeWidth={2}
                dot={{ fill: color, r: 4, strokeWidth: 0 }}
                activeDot={{ fill: color, r: 6, strokeWidth: 0 }}
                animationDuration={1500}
                animationEasing="ease-in-out"
              />
            </RechartsLineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
