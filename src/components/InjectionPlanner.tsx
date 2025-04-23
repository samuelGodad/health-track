
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const DAYS = [
  { key: "mon", label: "Mon" },
  { key: "tue", label: "Tue" },
  { key: "wed", label: "Wed" },
  { key: "thu", label: "Thu" },
  { key: "fri", label: "Fri" },
  { key: "sat", label: "Sat" },
  { key: "sun", label: "Sun" },
];

interface InjectionRow {
  ped: string;
  dosing: number;
  weeklyDose: number;
}

const initialRows: InjectionRow[] = [
  { ped: "Test", dosing: 300, weeklyDose: 500 },
  { ped: "Mast", dosing: 200, weeklyDose: 400 },
  { ped: "Primo", dosing: 100, weeklyDose: 200 }
];

export default function InjectionPlanner() {
  const [rows, setRows] = useState<InjectionRow[]>(initialRows);
  const [selectedDays, setSelectedDays] = useState<string[]>(["mon", "wed", "fri"]);

  const weeklyInjections = selectedDays.length;

  // Add a row at the end
  const handleAddRow = () => {
    setRows([...rows, { ped: "", dosing: 0, weeklyDose: 0 }]);
  };

  // Update a field in a row
  const handleRowChange = (index: number, field: keyof InjectionRow, value: string) => {
    const newRows = [...rows];
    if (field === "ped") {
      newRows[index][field] = value;
    } else {
      newRows[index][field] = parseFloat(value) || 0;
    }
    setRows(newRows);
  };

  function computeMlPerInjection(row: InjectionRow): string {
    const dosing = row.dosing || 0;
    const weeklyDose = row.weeklyDose || 0;
    const injections = weeklyInjections || 0;
    if (dosing > 0 && injections > 0) {
      return weeklyDose ? (weeklyDose / (dosing * injections)).toFixed(2) : "";
    }
    return "";
  }

  // Toggle week day selection
  const toggleDay = (dayKey: string) => {
    setSelectedDays((prev) =>
      prev.includes(dayKey)
        ? prev.filter((d) => d !== dayKey)
        : [...prev, dayKey]
    );
  };

  // Weekdays selector row for table
  const weeklyInjectionRow = (
    <tr>
      <td className="font-medium bg-white">Weekly Injections</td>
      <td colSpan={2} />
      <td>
        <div className="flex flex-wrap gap-1">
          {DAYS.map((day) => (
            <button
              key={day.key}
              type="button"
              aria-pressed={selectedDays.includes(day.key)}
              onClick={() => toggleDay(day.key)}
              className={cn(
                "transition-colors px-2 py-1 rounded font-medium border",
                selectedDays.includes(day.key)
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-secondary text-secondary-foreground border-border hover:bg-muted"
              )}
            >
              {day.label}
            </button>
          ))}
        </div>
        <div className="mt-2 text-xs text-muted-foreground">
          Choose which days of the week you take your injections ({weeklyInjections} selected)
        </div>
      </td>
    </tr>
  );

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Injection Planner</h2>
      <div className="overflow-x-auto rounded-lg border border-muted">
        <table className="w-full min-w-[600px] table-auto text-sm">
          <thead>
            <tr className="bg-muted/50">
              <th className="px-3 py-2 text-left font-semibold">PED To Inject</th>
              <th className="px-3 py-2 text-left font-semibold">Dosing Per 1ML</th>
              <th className="px-3 py-2 text-left font-semibold">Weekly Dose</th>
              <th className="px-3 py-2 text-left font-semibold">ML Per Injection</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr key={idx}>
                <td>
                  <Input
                    value={row.ped}
                    onChange={e => handleRowChange(idx, "ped", e.target.value)}
                    placeholder="PED name"
                    className="font-semibold"
                  />
                </td>
                <td>
                  <Input
                    type="number"
                    min={0}
                    value={row.dosing}
                    onChange={e => handleRowChange(idx, "dosing", e.target.value)}
                    placeholder="mg/ml"
                    className="text-center"
                  />
                </td>
                <td>
                  <Input
                    type="number"
                    min={0}
                    value={row.weeklyDose}
                    onChange={e => handleRowChange(idx, "weeklyDose", e.target.value)}
                    placeholder="mg"
                    className="text-center"
                  />
                </td>
                <td>
                  <Input
                    value={computeMlPerInjection(row)}
                    disabled
                    className="bg-white text-center font-semibold"
                  />
                </td>
              </tr>
            ))}
            {weeklyInjectionRow}
          </tbody>
        </table>
      </div>
      <button
        type="button"
        className="mt-4 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-4 py-2 rounded shadow transition-colors"
        onClick={handleAddRow}
      >
        + Add Row
      </button>
      <div className="mt-3 text-xs text-muted-foreground">
        <strong>Formula</strong> for "ML Per Injection": <br />
        <span className="bg-gray-100 rounded px-2 py-1">
          ML/inj = Weekly Dose / (Dosing per 1ML × Weekly Injections)
        </span>
      </div>
    </div>
  );
}
