import React, { createContext, useContext, useState } from 'react';
import { getISOWeek, startOfWeek } from 'date-fns';

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
  startDate: Date;
  endDate: Date;
  name: string;
  notes?: string;
  
  // We'll keep these for compatibility with existing code
  startWeek: number;
  endWeek: number;
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

// Helper function to convert a date to a week number
export function dateToWeekNumber(date: Date): number {
  const startOfYear = new Date(date.getFullYear(), 0, 1);
  const firstWeek = getISOWeek(startOfYear);
  const selectedWeek = getISOWeek(date);
  
  // Handle year boundary cases
  const weekDiff = selectedWeek - firstWeek + 1;
  return Math.max(1, weekDiff > 0 ? weekDiff : 52 + weekDiff);
}

// Helper function to ensure a date is the start of a week (Monday)
export function ensureStartOfWeek(date: Date): Date {
  return startOfWeek(date, { weekStartsOn: 1 }); // 1 represents Monday
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
  
  // Current selected date (added for date-based planning)
  selectedDate: Date;
  setSelectedDate: React.Dispatch<React.SetStateAction<Date>>;
}

const CycleContext = createContext<CycleContextType | undefined>(undefined);

export function CycleProvider({ children }: { children: React.ReactNode }) {
  const [cyclePlans, setCyclePlans] = useState<CyclePlanEntry[]>([]);
  const [cyclePeriods, setCyclePeriods] = useState<CyclePeriod[]>([]);
  const [currentWeek, setCurrentWeek] = useState<number>(1);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  return (
    <CycleContext.Provider value={{ 
      cyclePlans, 
      setCyclePlans, 
      cyclePeriods, 
      setCyclePeriods,
      currentWeek,
      setCurrentWeek,
      selectedDate,
      setSelectedDate
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
