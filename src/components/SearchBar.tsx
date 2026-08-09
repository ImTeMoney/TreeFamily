import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { search, searchKindLabels, type SearchResult } from '../utils/search';
import { useAppState } from '../hooks/useAppState';
import { cn } from '../utils/cn';

const examples = ['אחיתופל', 'בנות צלפחד', 'מי חי בתקופת משה?', 'מי היה אבא של מפיבושת?', 'מי חי בתקופת אליהו?'];

interface Props {
  variant?: 'inline' | 'hero';
  className?: string;
  autoFocus?: boolean;
}

export function SearchBar({ variant = 'inline', className, autoFocus }: Props) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { openPerson, corpus } = useAppState();

  const results = useMemo(
    () => (query.trim().length > 1 ? search(query, 12, corpus) : []),
    [query, corpus],
  );

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const go = (result: SearchResult) => {
    setOpen(false);
    setQuery('');
    switch (result.kind) {
      case 'person':
        openPerson(result.id);
        break;
      case 'period':
        navigate(`/periods/${result.id}`);
        break;
      case 'event':
        navigate(`/events/${result.id}`);
        break;
      case 'family':
        navigate(`/families/${result.id}`);
        break;
      case 'book':
        navigate(`/books/${result.id}`);
        break;
    }
  };

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (results[0]) go(results[0]);
          else if (query.trim()) navigate(`/search?q=${encodeURIComponent(query.trim())}`);
        }}
        className="relative"
      >
        <Search
          className={cn(
            'pointer-events-none absolute top-1/2 -translate-y-1/2 text-ink-400',
            variant === 'hero' ? 'right-5 h-5 w-5' : 'right-3 h-4 w-4',
          )}
          aria-hidden
        />
        <input
          type="search"
          value={query}
          autoFocus={autoFocus}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="חפש אדם, תקופה, אירוע או ספר..."
          aria-label="חיפוש"
          className={cn(
            'w-full rounded-full border border-parchment-300 bg-white/90 text-ink-900 shadow-sm transition-all',
            'placeholder:text-ink-400 focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/25',
            variant === 'hero' ? 'py-4 pr-14 pl-5 text-base' : 'py-2 pr-9 pl-3 text-sm',
          )}
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setOpen(false);
            }}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-800"
            aria-label="ניקוי החיפוש"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </form>

      {open && (query.trim().length > 1 || variant === 'hero') && (
        <div className="absolute inset-x-0 top-full z-50 mt-2 max-h-[60vh] overflow-y-auto rounded-2xl border border-parchment-200 bg-white p-2 shadow-pop animate-fade-in">
          {results.length === 0 && query.trim().length > 1 && (
            <p className="p-3 text-sm text-ink-400">לא נמצאו תוצאות עבור „{query}”.</p>
          )}

          {results.length === 0 && query.trim().length <= 1 && (
            <div className="p-2">
              <p className="mb-2 px-1 text-xs font-semibold text-ink-400">דוגמאות לחיפוש</p>
              <div className="flex flex-wrap gap-1.5">
                {examples.map((example) => (
                  <button key={example} type="button" onClick={() => setQuery(example)} className="chip">
                    {example}
                  </button>
                ))}
              </div>
            </div>
          )}

          <ul>
            {results.map((result) => (
              <li key={`${result.kind}-${result.id}`}>
                <button
                  type="button"
                  onClick={() => go(result)}
                  className="flex w-full items-start gap-2 rounded-xl px-3 py-2 text-right transition-colors hover:bg-parchment-100"
                >
                  <span className="mt-0.5 shrink-0 rounded-full bg-parchment-100 px-2 py-0.5 text-[10px] font-semibold text-ink-600">
                    {searchKindLabels[result.kind]}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium text-ink-900">{result.title}</span>
                    <span className="block truncate text-xs text-ink-400">{result.subtitle}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>

          {results.length > 0 && (
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                navigate(`/search?q=${encodeURIComponent(query.trim())}`);
              }}
              className="mt-1 w-full rounded-xl px-3 py-2 text-center text-xs font-medium text-ink-600 hover:bg-parchment-100"
            >
              הצגת כל התוצאות
            </button>
          )}
        </div>
      )}
    </div>
  );
}
