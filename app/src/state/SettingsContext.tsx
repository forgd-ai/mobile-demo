// Description: App-wide user preferences held in React context.
// Description: One source of truth; screens read from here and refetch when it changes.

import React, { createContext, useContext, useMemo, useState } from 'react';
import { DEFAULT_USER_ID, Units } from '../api/client';

interface Settings {
  units: Units;
  setUnits: (units: Units) => void;
  userId: number;
  setUserId: (userId: number) => void;
}

const SettingsContext = createContext<Settings | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [units, setUnits] = useState<Units>('metric');
  const [userId, setUserId] = useState<number>(DEFAULT_USER_ID);

  const value = useMemo(() => ({ units, setUnits, userId, setUserId }), [units, userId]);

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings(): Settings {
  const value = useContext(SettingsContext);
  if (!value) {
    throw new Error('useSettings must be used inside SettingsProvider');
  }
  return value;
}
