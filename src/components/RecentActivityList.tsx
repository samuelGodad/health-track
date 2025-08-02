import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { 
  FlaskConicalIcon, 
  ActivityIcon, 
  CalendarIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  MinusIcon
} from 'lucide-react';
import { RecentActivity } from '@/services/dashboardService';

interface RecentActivityListProps {
  activities: RecentActivity[];
  maxItems?: number;
}

export function RecentActivityList({ activities, maxItems = 6 }: RecentActivityListProps) {
  const getActivityIcon = (type: RecentActivity['type']) => {
    switch (type) {
      case 'blood_test':
        return <FlaskConicalIcon className="h-4 w-4" />;
      case 'daily_metric':
        return <ActivityIcon className="h-4 w-4" />;
      case 'cycle_update':
        return <CalendarIcon className="h-4 w-4" />;
      default:
        return <ActivityIcon className="h-4 w-4" />;
    }
  };

  const getStatusIcon = (value?: string) => {
    if (!value) return <MinusIcon className="h-3 w-3" />;
    
    switch (value.toLowerCase()) {
      case 'high':
        return <TrendingUpIcon className="h-3 w-3 text-rose-500" />;
      case 'low':
        return <TrendingDownIcon className="h-3 w-3 text-amber-500" />;
      case 'normal':
        return <MinusIcon className="h-3 w-3 text-emerald-500" />;
      default:
        return <MinusIcon className="h-3 w-3" />;
    }
  };

  const getStatusColor = (value?: string) => {
    if (!value) return 'bg-gray-100 text-gray-600';
    
    switch (value.toLowerCase()) {
      case 'high':
        return 'bg-rose-100 text-rose-700';
      case 'low':
        return 'bg-amber-100 text-amber-700';
      case 'normal':
        return 'bg-emerald-100 text-emerald-700';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const displayedActivities = activities.slice(0, maxItems);

  if (displayedActivities.length === 0) {
    return (
      <Card className="border border-border/50 bg-card/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] flex items-center justify-center text-muted-foreground">
            No recent activity
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-border/50 bg-card/90 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {displayedActivities.map((activity, index) => (
            <div key={index} className="flex items-start space-x-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
              <div className="flex-shrink-0 mt-1">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  {getActivityIcon(activity.type)}
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-foreground truncate">
                    {activity.title}
                  </p>
                  <div className="flex items-center space-x-2">
                    {activity.value && (
                      <Badge variant="secondary" className={getStatusColor(activity.value)}>
                        <div className="flex items-center space-x-1">
                          {getStatusIcon(activity.value)}
                          <span className="text-xs">{activity.value}</span>
                        </div>
                      </Badge>
                    )}
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(activity.date), 'MMM dd')}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {activity.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default RecentActivityList; 