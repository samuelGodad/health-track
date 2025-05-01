
import React, { createContext, useContext, useState } from 'react';

// Enum for cycle types
export enum CycleType {
  TRT = "TRT",
  BLAST = "BLAST",
  CRUISE = "CRUISE",
  OFF = "OFF"
}

// Interface for a cycle period (spans multiple weeks)
export interface CyclePeriod {
  id: string;
  type: CycleType;
  startWeek: number;
  endWeek: number;
  name: string;
  notes?: string;
}

// Entry for a specific compound within a cycle
export interface CyclePlanEntry {
  id: string;
  compound: string;
  weeklyDose: number;
  dosingPer1ML: number;
  unit: string;
  frequency: number;
  weekNumber: number;
}

// Combined context for all cycle-related state
interface CycleContextType {
  // Individual compound entries
  cyclePlans: CyclePlanEntry[];
  setCyclePlans: React.Dispatch<React.SetStateAction<CyclePlanEntry[]>>;
  
  // Cycle periods (TRT, Blast, Cruise)
  cyclePeriods: CyclePeriod[];
  setCyclePeriods: React.Dispatch<React.SetStateAction<CyclePeriod[]>>;
  
  // Current selected week
  currentWeek: number;
  setCurrentWeek: React.Dispatch<React.SetStateAction<number>>;
}

const CycleContext = createContext<CycleContextType | undefined>(undefined);

export function CycleProvider({ children }: { children: React.ReactNode }) {
  const [cyclePlans, setCyclePlans] = useState<CyclePlanEntry[]>([]);
  const [cyclePeriods, setCyclePeriods] = useState<CyclePeriod[]>([]);
  const [currentWeek, setCurrentWeek] = useState<number>(1);

  return (
    <CycleContext.Provider value={{ 
      cyclePlans, 
      setCyclePlans, 
      cyclePeriods, 
      setCyclePeriods,
      currentWeek,
      setCurrentWeek
    }}>
      {children}
    </CycleContext.Provider>
  );
}

export function useCycle() {
  const context = useContext(CycleContext);
  if (context === undefined) {
    throw new Error('useCycle must be used within a CycleProvider');
  }
  return context;
}
