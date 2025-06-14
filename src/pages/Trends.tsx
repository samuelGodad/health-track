import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format, addWeeks, startOfWeek } from "date-fns";
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';

// --- Mock data (with totalSleep & restingHeartRate included) ---
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
const chartData = trendData.map(d => ({
  ...d,
  week: format(d.weekStart, 'MMM d')
}));

// Small font size config for axes and tooltips
const axisStyle = { fontSize: 11 };
const tooltipStyle = {
  fontSize: '12px',
  borderRadius: '0.5rem',
  boxShadow: '0 4px 20px 0 rgba(0,0,0,0.09)',
  background: 'var(--background, white)',
  padding: '0.7rem 1rem'
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div style={tooltipStyle}>
        <p style={{ marginBottom: 4, fontWeight: 500 }}>{`Start: ${label}`}</p>
        {payload.map((entry: any, idx: number) => (
          <p key={idx} style={{ color: entry.color, fontSize: '11px', margin: 0 }}>
            {entry.name}:{" "}
            {entry.dataKey === "weight"
              ? entry.value + "kg"
              : entry.dataKey === "steps"
              ? entry.value + " steps"
              : entry.dataKey === "systolic" || entry.dataKey === "diastolic"
              ? entry.value + " mmHg"
              : entry.dataKey === "totalSleep"
              ? entry.value + " h"
              : entry.dataKey === "restingHeartRate"
              ? entry.value + " bpm"
              : entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// --- Trend chart definitions ---
const trends = [
  {
    key: "weight",
    title: "Weight Trend",
    subtitle: "Weekly average weight",
    stroke: "#3b82f6",
    unit: "kg",
    yAxisUnit: "kg",
  },
  {
    key: "steps",
    title: "Steps Trend",
    subtitle: "Average steps per day",
    stroke: "#10b981",
    unit: "steps",
    yAxisUnit: "steps"
  },
  {
    key: "totalSleep",
    title: "Total Sleep",
    subtitle: "Weekly avg. hours/night",
    stroke: "#6366f1",
    unit: "h",
    yAxisUnit: "h"
  },
  {
    key: "restingHeartRate",
    title: "Resting Heart Rate",
    subtitle: "Weekly avg. bpm",
    stroke: "#d946ef",
    unit: "bpm",
    yAxisUnit: "bpm"
  }
];

// Responsive grid: 2 cols on lg+; 1 col (full width) on md and below
const gridCls = "grid gap-6 grid-cols-1 lg:grid-cols-2";

const Trends = () => {
  return (
    <DashboardLayout>
      {/* REMOVE the overview section */}
      <div className={gridCls}>
        {/* Standard metric charts */}
        {trends.map((t) => (
          <Card key={t.key}>
            <CardHeader>
              <CardTitle className="text-base md:text-lg">{t.title}</CardTitle>
              <p className="text-xs md:text-sm text-muted-foreground">{t.subtitle}</p>
            </CardHeader>
            <CardContent>
              <div className="h-[240px] md:h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis
                      dataKey="week"
                      stroke="hsl(var(--muted-foreground))"
                      tick={axisStyle}
                      tickLine={false}
                      axisLine={false}
                      interval={0}
                    />
                    <YAxis
                      stroke="hsl(var(--muted-foreground))"
                      domain={['auto', 'auto']}
                      unit={t.yAxisUnit}
                      tick={axisStyle}
                      tickLine={false}
                      axisLine={false}
                      width={40}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                      type="monotone"
                      dataKey={t.key}
                      stroke={t.stroke}
                      strokeWidth={2}
                      dot={{ fill: t.stroke }}
                      activeDot={{ r: 5 }}
                      name={t.title}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        ))}
        {/* Blood pressure combined chart */}
        <Card key="bp">
          <CardHeader>
            <CardTitle className="text-base md:text-lg">Blood Pressure</CardTitle>
            <p className="text-xs md:text-sm text-muted-foreground">Weekly average systolic / diastolic BP</p>
          </CardHeader>
          <CardContent>
            <div className="h-[240px] md:h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis
                    dataKey="week"
                    stroke="hsl(var(--muted-foreground))"
                    tick={axisStyle}
                    tickLine={false}
                    axisLine={false}
                    interval={0}
                  />
                  <YAxis
                    stroke="hsl(var(--muted-foreground))"
                    domain={['auto', 'auto']}
                    unit="mmHg"
                    tick={axisStyle}
                    tickLine={false}
                    axisLine={false}
                    width={43}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    verticalAlign="top"
                    align="right"
                    iconType="line"
                    wrapperStyle={{ fontSize: 11, paddingBottom: '1.5rem' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="systolic"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    dot={{ fill: "#f59e0b" }}
                    activeDot={{ r: 5 }}
                    name="Systolic"
                  />
                  <Line
                    type="monotone"
                    dataKey="diastolic"
                    stroke="#ef4444"
                    strokeWidth={2}
                    dot={{ fill: "#ef4444" }}
                    activeDot={{ r: 5 }}
                    name="Diastolic"
                  />
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
