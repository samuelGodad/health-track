
import { useState } from 'react';
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format, addWeeks, startOfWeek } from "date-fns";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';

const trendData = [
  { weekStart: startOfWeek(addWeeks(new Date(), -7), { weekStartsOn: 1 }), weight: 76.5, steps: 7500, systolic: 125, diastolic: 80 },
  { weekStart: startOfWeek(addWeeks(new Date(), -6), { weekStartsOn: 1 }), weight: 76.1, steps: 8200, systolic: 123, diastolic: 79 },
  { weekStart: startOfWeek(addWeeks(new Date(), -5), { weekStartsOn: 1 }), weight: 75.8, steps: 8100, systolic: 124, diastolic: 81 },
  { weekStart: startOfWeek(addWeeks(new Date(), -4), { weekStartsOn: 1 }), weight: 75.5, steps: 8300, systolic: 122, diastolic: 78 },
  { weekStart: startOfWeek(addWeeks(new Date(), -3), { weekStartsOn: 1 }), weight: 75.3, steps: 8600, systolic: 121, diastolic: 77 },
  { weekStart: startOfWeek(addWeeks(new Date(), -2), { weekStartsOn: 1 }), weight: 75.1, steps: 8400, systolic: 123, diastolic: 79 },
  { weekStart: startOfWeek(addWeeks(new Date(), -1), { weekStartsOn: 1 }), weight: 75.0, steps: 8500, systolic: 122, diastolic: 78 },
  { weekStart: startOfWeek(new Date(), { weekStartsOn: 1 }), weight: 75.2, steps: 8547, systolic: 122, diastolic: 78 }
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
            {`${entry.dataKey}: ${entry.value}${entry.dataKey === 'weight' ? 'kg' : entry.dataKey === 'steps' ? ' steps' : ' mmHg'}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const Trends = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Health Trends</h2>
          <p className="text-muted-foreground mb-4">Monitor your weekly average health metrics over time.</p>
        </div>
        
        {/* Weight Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Weight Trend</CardTitle>
            <p className="text-sm text-muted-foreground">Weekly average weight over time</p>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="week" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" domain={['auto', 'auto']} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line type="monotone" dataKey="weight" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Steps Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Steps Trend</CardTitle>
            <p className="text-sm text-muted-foreground">Daily average steps over time</p>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="week" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" domain={['auto', 'auto']} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line type="monotone" dataKey="steps" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Systolic Blood Pressure */}
        <Card>
          <CardHeader>
            <CardTitle>Systolic Blood Pressure</CardTitle>
            <p className="text-sm text-muted-foreground">Weekly average systolic BP</p>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="week" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" domain={['auto', 'auto']} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line type="monotone" dataKey="systolic" stroke="#f59e0b" strokeWidth={2} dot={{ fill: '#f59e0b' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Diastolic Blood Pressure */}
        <Card>
          <CardHeader>
            <CardTitle>Diastolic Blood Pressure</CardTitle>
            <p className="text-sm text-muted-foreground">Weekly average diastolic BP</p>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="week" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" domain={['auto', 'auto']} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line type="monotone" dataKey="diastolic" stroke="#ef4444" strokeWidth={2} dot={{ fill: '#ef4444' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Trends;
