
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// Define proper types for row data
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
  const [weeklyInjections, setWeeklyInjections] = useState<number>(3);

  // Add a row at the end (optionally)
  const handleAddRow = () => {
    setRows([...rows, { ped: "", dosing: 0, weeklyDose: 0 }]);
  };

  // Update a field in a row
  const handleRowChange = (index: number, field: keyof InjectionRow, value: string) => {
    const newRows = [...rows];
    if (field === 'ped') {
      newRows[index][field] = value;
    } else {
      // Convert to number for dosing and weeklyDose
      newRows[index][field] = parseFloat(value) || 0;
    }
    setRows(newRows);
  };

  // Compute ML per injection
  function computeMlPerInjection(row: InjectionRow): string {
    const dosing = row.dosing || 0;
    const weeklyDose = row.weeklyDose || 0;
    const injections = weeklyInjections || 0;
    if (dosing > 0 && injections > 0) {
      return weeklyDose ? (weeklyDose / (dosing * injections)).toFixed(2) : "";
    }
    return "";
  }

  // Row for weekly injections (bottom row)
  const weeklyInjectionRow = (
    <tr>
      <td className="font-medium bg-white">Weekly Injections</td>
      <td colSpan={2} />
      <td>
        <Input
          type="number"
          min={1}
          value={weeklyInjections}
          onChange={e => setWeeklyInjections(Number(e.target.value))}
          className="bg-[#E5F9ED] font-semibold text-center"
        />
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
                    className="bg-[#E5F9ED] font-semibold"
                  />
                </td>
                <td>
                  <Input
                    type="number"
                    min={0}
                    value={row.dosing}
                    onChange={e => handleRowChange(idx, "dosing", e.target.value)}
                    placeholder="mg/ml"
                    className="bg-[#E5F9ED] text-center"
                  />
                </td>
                <td>
                  <Input
                    type="number"
                    min={0}
                    value={row.weeklyDose}
                    onChange={e => handleRowChange(idx, "weeklyDose", e.target.value)}
                    placeholder="mg"
                    className="bg-[#E5F9ED] text-center"
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
        className="mt-4 bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded shadow transition-colors"
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
