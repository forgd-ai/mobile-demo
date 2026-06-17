// Description: App-wide user preferences held in React context.
// Description: One source of truth; screens read from here and refetch when it changes.

import React, { createContext, useContext, useMemo, useState } from 'react';
import { Units } from '../api/client';

interface Settings {
  units: Units;
  setUnits: (units: Units) => void;
}

const SettingsContext = createContext<Settings | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [units, setUnits] = useState<Units>('metric');

  const value = useMemo(() => ({ units, setUnits }), [units]);

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings(): Settings {
  const value = useContext(SettingsContext);
  if (!value) {
    throw new Error('useSettings must be used inside SettingsProvider');
  }
  return value;
}
