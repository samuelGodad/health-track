
import { useState } from 'react';
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format, addWeeks, startOfWeek } from "date-fns";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';

const trendData = [
  { weekStart: startOfWeek(addWeeks(new Date(), -7), { weekStartsOn: 1 }), weight: 76.5, steps: 7500, systolic: 125, diastolic: 80, totalSleep: 6.7, restingHeartRate: 56 },
  { weekStart: startOfWeek(addWeeks(new Date(), -6), { weekStartsOn: 1 }), weight: 76.1, steps: 8200, systolic: 123, diastolic: 79, totalSleep: 7.0, restingHeartRate: 55 },
  { weekStart: startOfWeek(addWeeks(new Date(), -5), { weekStartsOn: 1 }), weight: 75.8, steps: 8100, systolic: 124, diastolic: 81, totalSleep: 7.1, restingHeartRate: 57 },
  { weekStart: startOfWeek(addWeeks(new Date(), -4), { weekStartsOn: 1 }), weight: 75.5, steps: 8300, systolic: 122, diastolic: 78, totalSleep: 6.8, restingHeartRate: 58 },
  { weekStart: startOfWeek(addWeeks(new Date(), -3), { weekStartsOn: 1 }), weight: 75.3, steps: 8600, systolic: 121, diastolic: 77, totalSleep: 7.3, restingHeartRate: 54 },
  { weekStart: startOfWeek(addWeeks(new Date(), -2), { weekStartsOn: 1 }), weight: 75.1, steps: 8400, systolic: 123, diastolic: 79, totalSleep: 7.0, restingHeartRate: 55 },
  { weekStart: startOfWeek(addWeeks(new Date(), -1), { weekStartsOn: 1 }), weight: 75.0, steps: 8500, systolic: 122, diastolic: 78, totalSleep: 7.2, restingHeartRate: 56 },
  { weekStart: startOfWeek(new Date(), { weekStartsOn: 1 }), weight: 75.2, steps: 8547, systolic: 122, diastolic: 78, totalSleep: 7.4, restingHeartRate: 55 }
];
// Format for recharts, with week: "MMM d"
const chartData = trendData.map(d => ({
  ...d,
  week: format(d.weekStart, 'MMM d')
}));

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border border-border p-3 rounded-lg shadow-lg">
        <p className="font-medium">{`Start: ${label}`}</p>
        {payload.map((entry: any, idx: number) => (
          <p key={idx} style={{ color: entry.color }}>
            {`${entry.dataKey}: ${entry.value}${entry.dataKey === 'weight' ? 'kg' : entry.dataKey === 'steps' ? ' steps' : entry.dataKey === 'systolic' || entry.dataKey === 'diastolic' ? ' mmHg' : entry.dataKey === 'totalSleep' ? ' h' : entry.dataKey === 'restingHeartRate' ? ' bpm' : ''}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const trends = [
  {
    key: 'weight',
    title: 'Weight Trend',
    subtitle: 'Weekly average weight',
    stroke: '#3b82f6',
    unit: 'kg'
  },
  {
    key: 'steps',
    title: 'Steps Trend',
    subtitle: 'Average steps per day',
    stroke: '#10b981',
    unit: 'steps'
  },
  {
    key: 'systolic',
    title: 'Systolic BP',
    subtitle: 'Weekly average systolic BP',
    stroke: '#f59e0b',
    unit: 'mmHg'
  },
  {
    key: 'diastolic',
    title: 'Diastolic BP',
    subtitle: 'Weekly average diastolic BP',
    stroke: '#ef4444',
    unit: 'mmHg'
  },
  {
    key: 'totalSleep',
    title: 'Total Sleep',
    subtitle: 'Weekly avg. hours per night',
    stroke: '#6366f1',
    unit: 'h'
  },
  {
    key: 'restingHeartRate',
    title: 'Resting Heart Rate',
    subtitle: 'Weekly avg. bpm',
    stroke: '#d946ef',
    unit: 'bpm'
  }
];

const Trends = () => {
  return (
    <DashboardLayout>
      <div>
        <h2 className="text-2xl font-bold tracking-tight mb-1">Health Trends</h2>
        <p className="text-muted-foreground mb-4">Week-over-week averages for all tracked metrics.</p>
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
          {trends.map((t) => (
            <Card key={t.key}>
              <CardHeader>
                <CardTitle>{t.title}</CardTitle>
                <p className="text-sm text-muted-foreground">{t.subtitle}</p>
              </CardHeader>
              <CardContent>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="week" stroke="hsl(var(--muted-foreground))" />
                      <YAxis stroke="hsl(var(--muted-foreground))" domain={['auto', 'auto']} unit={t.unit}/>
                      <Tooltip content={<CustomTooltip />} />
                      <Line type="monotone" dataKey={t.key} stroke={t.stroke} strokeWidth={2} dot={{ fill: t.stroke }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Trends;
