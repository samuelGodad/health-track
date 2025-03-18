
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  valueClassName?: string;
  isLoading?: boolean;
}

export function MetricCard({
  title,
  value,
  icon,
  trend,
  className,
  valueClassName,
  isLoading = false
}: MetricCardProps) {
  return (
    <Card className={cn(
      "overflow-hidden transition-all duration-300 hover:shadow-md",
      "border border-border/50 bg-card/90 backdrop-blur-sm",
      className
    )}>
      <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4 px-6">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className="h-8 w-8 text-primary">{icon}</div>
      </CardHeader>
      <CardContent className="px-6 pb-4">
        {isLoading ? (
          <div className="h-9 w-28 bg-muted animate-pulse rounded-md" />
        ) : (
          <div className="flex items-end space-x-2">
            <div className={cn("metric-value", valueClassName)}>
              {value}
            </div>
            {trend && (
              <div className={cn(
                "mb-1 text-xs font-medium",
                trend.isPositive ? "text-emerald-500" : "text-rose-500"
              )}>
                <span>{trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%</span>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
