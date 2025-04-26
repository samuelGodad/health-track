
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

// In a real implementation, this data would come from the cycle planner
// and would be calculated based on the weekly doses and frequencies
const injectionsData = [
  {
    id: 1,
    compound: "Testosterone Enanthate",
    dose: 250,
    unit: "mg",
    frequency: "Monday, Thursday",
    status: "upcoming", // upcoming, completed, missed
  },
  {
    id: 2,
    compound: "Nandrolone Decanoate",
    dose: 150,
    unit: "mg",
    frequency: "Monday, Thursday",
    status: "completed",
  },
  {
    id: 3,
    compound: "Trenbolone Acetate",
    dose: 75,
    unit: "mg",
    frequency: "Monday, Wednesday, Friday",
    status: "missed",
  },
];

type InjectionStatus = "upcoming" | "completed" | "missed";

const InjectionPlanner: React.FC = () => {
  const [injections, setInjections] = useState(injectionsData);

  const updateInjectionStatus = (id: number, status: InjectionStatus) => {
    setInjections(
      injections.map((injection) =>
        injection.id === id ? { ...injection, status } : injection
      )
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-500">Completed</Badge>;
      case "missed":
        return <Badge variant="destructive">Missed</Badge>;
      default:
        return <Badge variant="outline">Upcoming</Badge>;
    }
  };

  return (
    <div className="w-full">
      <div className="mb-4">
        <h2 className="text-xl font-bold">Your Injection Schedule</h2>
        <p className="text-muted-foreground">
          Track and manage your injections for optimal results
        </p>
      </div>

      <Table>
        <TableCaption>Injections calculated from your cycle plan</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Compound</TableHead>
            <TableHead>Dose</TableHead>
            <TableHead>Schedule</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {injections.map((injection) => (
            <TableRow key={injection.id}>
              <TableCell className="font-medium">{injection.compound}</TableCell>
              <TableCell>
                {injection.dose} {injection.unit}
              </TableCell>
              <TableCell>{injection.frequency}</TableCell>
              <TableCell>{getStatusBadge(injection.status)}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className={cn(
                      injection.status === "completed" && "bg-green-500/10"
                    )}
                    onClick={() => updateInjectionStatus(injection.id, "completed")}
                  >
                    Done
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className={cn(
                      injection.status === "missed" && "bg-red-500/10"
                    )}
                    onClick={() => updateInjectionStatus(injection.id, "missed")}
                  >
                    Missed
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      <div className="mt-6 text-center">
        <p className="text-sm text-muted-foreground">
          Your injection schedule is based on your cycle plan.
          <br />
          Update your cycle in the Cycle Planner to modify your injection schedule.
        </p>
      </div>
    </div>
  );
};

export default InjectionPlanner;
