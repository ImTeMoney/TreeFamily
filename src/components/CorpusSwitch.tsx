import type { Corpus } from '../types';
import { useAppState } from '../hooks/useAppState';
import { corpusDescriptions, corpusLabels } from '../utils/labels';
import type { CorpusFilter } from '../utils/people';
import { cn } from '../utils/cn';

const options: Array<{ id: CorpusFilter; label: string; title: string }> = [
  { id: 'all', label: 'הכול', title: 'כל המקורות יחד, על ציר אחד' },
  ...(['tanach', 'bayit-sheni', 'mishna', 'talmud'] as Corpus[]).map((corpus) => ({
    id: corpus as CorpusFilter,
    label: corpusLabels[corpus],
    title: corpusDescriptions[corpus],
  })),
];

/** מתג הקורפוס — מסנן את ציר הזמן, הדמויות, התקופות, האירועים והחיפוש */
export function CorpusSwitch({ className }: { className?: string }) {
  const { corpus, setCorpus } = useAppState();

  return (
    <div
      role="group"
      aria-label="בחירת מקור"
      className={cn(
        'no-scrollbar flex max-w-full items-center gap-0.5 overflow-x-auto rounded-full border border-parchment-300 bg-white/70 p-0.5',
        className,
      )}
    >
      {/* התווית מבהירה שהבחירה היא בספרות שבה הדמות מתועדת, ולא בתקופה שבה חיה */}
      <span aria-hidden className="shrink-0 pr-2.5 pl-1 text-[11px] font-semibold text-ink-400">
        מקור:
      </span>
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          title={option.title}
          aria-pressed={corpus === option.id}
          onClick={() => setCorpus(option.id)}
          className={cn(
            'shrink-0 whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium transition-colors',
            'coarse:min-h-[2.5rem] coarse:px-4',
            corpus === option.id ? 'bg-ink-800 text-parchment-50' : 'text-ink-600 hover:bg-parchment-100',
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
