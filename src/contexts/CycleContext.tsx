
import React, { createContext, useContext, useState } from 'react';

interface CyclePlanEntry {
  id: string;
  compound: string;
  weeklyDose: number;
  dosingPer1ML: number;
  unit: string;
  frequency: number;
  weekNumber: number;
}

interface CycleContextType {
  cyclePlans: CyclePlanEntry[];
  setCyclePlans: React.Dispatch<React.SetStateAction<CyclePlanEntry[]>>;
}

const CycleContext = createContext<CycleContextType | undefined>(undefined);

export function CycleProvider({ children }: { children: React.ReactNode }) {
  const [cyclePlans, setCyclePlans] = useState<CyclePlanEntry[]>([]);

  return (
    <CycleContext.Provider value={{ cyclePlans, setCyclePlans }}>
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
