
import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format, addWeeks, startOfWeek, endOfWeek, isWithinInterval, isAfter, isBefore } from "date-fns";
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

const gridCls = "grid gap-6 grid-cols-1 lg:grid-cols-2";

// --- Date Range Picker Logic ---
function WeekRangePicker({
  from,
  to,
  setFrom,
  setTo,
  minDate,
  maxDate,
}: {
  from: Date | null;
  to: Date | null;
  setFrom: (date: Date | null) => void;
  setTo: (date: Date | null) => void;
  minDate: Date;
  maxDate: Date;
}) {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-6 w-fit">
      <div>
        <span className="text-xs font-medium text-muted-foreground">From</span>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-[140px] justify-start text-left font-normal"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {from ? format(from, "MMM d, yyyy") : <span>Pick start</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={from ?? undefined}
              onSelect={date => setFrom(date ? startOfWeek(date, { weekStartsOn: 1 }) : null)}
              disabled={date =>
                (to && isAfter(date, to)) ||
                isBefore(date, minDate) ||
                isAfter(date, maxDate)
              }
              initialFocus
              className="p-3 pointer-events-auto"
              
            />
          </PopoverContent>
        </Popover>
      </div>
      <div>
        <span className="text-xs font-medium text-muted-foreground">To</span>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-[140px] justify-start text-left font-normal"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {to ? format(to, "MMM d, yyyy") : <span>Pick end</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={to ?? undefined}
              onSelect={date => setTo(date ? endOfWeek(date, { weekStartsOn: 1 }) : null)}
              disabled={date =>
                (from && isBefore(date, from)) ||
                isBefore(date, minDate) ||
                isAfter(date, maxDate)
              }
              initialFocus
              className="p-3 pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}

const Trends = () => {
  // Setup for week range by default (all available data)
  const chartMinDate = trendData[0].weekStart;
  const chartMaxDate = endOfWeek(trendData[trendData.length - 1].weekStart, { weekStartsOn: 1 });

  // State for date range
  const [from, setFrom] = useState<Date | null>(chartMinDate);
  const [to, setTo] = useState<Date | null>(chartMaxDate);

  // Filter data based on range
  const filteredChartData = useMemo(() => {
    return trendData
      .filter(d => {
        const weekStartDate = d.weekStart;
        // Show week if its start is within [from, to]
        return (
          (!from || !isBefore(weekStartDate, from)) &&
          (!to || !isAfter(weekStartDate, to))
        );
      })
      .map(d => ({
        ...d,
        week: format(d.weekStart, 'MMM d')
      }));
  }, [from, to]);

  return (
    <div>
      {/* Page content only, NO header/hamburger/sidebar here */}
      {/* Header area */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2 gap-3">
        <div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight mb-1">Health Trends</h2>
          <p className="text-sm md:text-base text-muted-foreground mb-1">Week-over-week averages for all tracked metrics.</p>
        </div>
        <WeekRangePicker
          from={from}
          to={to}
          setFrom={setFrom}
          setTo={setTo}
          minDate={chartMinDate}
          maxDate={chartMaxDate}
        />
      </div>
      {/* The trend charts grid */}
      <div className={gridCls}>
        {trends.map((t) => (
          <Card key={t.key}>
            <CardHeader>
              <CardTitle className="text-base md:text-lg">{t.title}</CardTitle>
              <p className="text-xs md:text-sm text-muted-foreground">{t.subtitle}</p>
            </CardHeader>
            <CardContent>
              <div className="h-[240px] md:h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={filteredChartData}>
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
        <Card key="bp">
          <CardHeader>
            <CardTitle className="text-base md:text-lg">Blood Pressure</CardTitle>
            <p className="text-xs md:text-sm text-muted-foreground">Weekly average systolic / diastolic BP</p>
          </CardHeader>
          <CardContent>
            <div className="h-[240px] md:h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={filteredChartData}>
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
    </div>
  );
};

export default Trends;

