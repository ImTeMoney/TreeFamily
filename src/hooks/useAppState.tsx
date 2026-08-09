import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

interface AppState {
  /** מזהה הדמות המוצגת בכרטיס הצדדי */
  activePersonId: string | null;
  /** היסטוריית ניווט פנימית בין דמויות, לכפתור "חזרה" בכרטיס */
  history: string[];
  openPerson: (id: string) => void;
  closePerson: () => void;
  goBack: () => void;
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
}

const AppStateContext = createContext<AppState | null>(null);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [activePersonId, setActivePersonId] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [searchOpen, setSearchOpen] = useState(false);

  const openPerson = useCallback((id: string) => {
    setActivePersonId((current) => {
      if (current && current !== id) setHistory((h) => [...h, current]);
      return id;
    });
  }, []);

  const closePerson = useCallback(() => {
    setActivePersonId(null);
    setHistory([]);
  }, []);

  const goBack = useCallback(() => {
    setHistory((h) => {
      if (h.length === 0) {
        setActivePersonId(null);
        return h;
      }
      setActivePersonId(h[h.length - 1]);
      return h.slice(0, -1);
    });
  }, []);

  const value = useMemo(
    () => ({ activePersonId, history, openPerson, closePerson, goBack, searchOpen, setSearchOpen }),
    [activePersonId, history, openPerson, closePerson, goBack, searchOpen],
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState(): AppState {
  const context = useContext(AppStateContext);
  if (!context) throw new Error('useAppState must be used within AppStateProvider');
  return context;
}
