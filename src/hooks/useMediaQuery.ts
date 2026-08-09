import { useEffect, useState } from 'react';

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() =>
    typeof window === 'undefined' ? false : window.matchMedia(query).matches,
  );

  useEffect(() => {
    const media = window.matchMedia(query);
    const listener = (event: MediaQueryListEvent) => setMatches(event.matches);
    setMatches(media.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [query]);

  return matches;
}

/** נכון במסכי מובייל (עד 767px) */
export function useIsMobile(): boolean {
  return useMediaQuery('(max-width: 767px)');
}

/**
 * נכון בטלפון ובטאבלט בפורטרט (עד 1023px).
 * זו נקודת המעבר לתצוגות המצומצמות — ציר אנכי, סינון במגירה וניווט תחתון.
 */
export function useIsCompact(): boolean {
  return useMediaQuery('(max-width: 1023px)');
}
