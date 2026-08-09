import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { CorpusFilter } from '../utils/people';

const CORPUS_STORAGE_KEY = 'bible-map:corpus';
const TOUR_STORAGE_KEY = 'bible-map:tour-seen';

function readStoredCorpus(): CorpusFilter {
  if (typeof window === 'undefined') return 'all';
  const stored = window.localStorage.getItem(CORPUS_STORAGE_KEY);
  return stored === 'tanach' || stored === 'mishna' || stored === 'talmud' ? stored : 'all';
}

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
  /** הקורפוס הפעיל — מסנן את כל האתר */
  corpus: CorpusFilter;
  setCorpus: (corpus: CorpusFilter) => void;
  /** מסך הפתיחה — מוצג בכניסה הראשונה, וניתן לפתיחה חוזרת */
  tourOpen: boolean;
  openTour: () => void;
  closeTour: () => void;
}

const AppStateContext = createContext<AppState | null>(null);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [activePersonId, setActivePersonId] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [corpus, setCorpus] = useState<CorpusFilter>(readStoredCorpus);

  const [tourOpen, setTourOpen] = useState(
    () => typeof window !== 'undefined' && !window.localStorage.getItem(TOUR_STORAGE_KEY),
  );

  useEffect(() => {
    window.localStorage.setItem(CORPUS_STORAGE_KEY, corpus);
  }, [corpus]);

  const openTour = useCallback(() => setTourOpen(true), []);
  const closeTour = useCallback(() => {
    window.localStorage.setItem(TOUR_STORAGE_KEY, '1');
    setTourOpen(false);
  }, []);

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
    () => ({
      activePersonId,
      history,
      openPerson,
      closePerson,
      goBack,
      searchOpen,
      setSearchOpen,
      corpus,
      setCorpus,
      tourOpen,
      openTour,
      closeTour,
    }),
    [activePersonId, history, openPerson, closePerson, goBack, searchOpen, corpus, tourOpen, openTour, closeTour],
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState(): AppState {
  const context = useContext(AppStateContext);
  if (!context) throw new Error('useAppState must be used within AppStateProvider');
  return context;
}
