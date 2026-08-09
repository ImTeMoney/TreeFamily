import type { Corpus } from '../types';
import { useAppState } from '../hooks/useAppState';
import { corpusDescriptions, corpusLabels } from '../utils/labels';
import type { CorpusFilter } from '../utils/people';
import { cn } from '../utils/cn';

const options: Array<{ id: CorpusFilter; label: string; title: string }> = [
  { id: 'all', label: 'הכול', title: 'כל המקורות יחד, על ציר אחד' },
  ...(['tanach', 'mishna'] as Corpus[]).map((corpus) => ({
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
      aria-label="בחירת קורפוס"
      className={cn('flex items-center gap-0.5 rounded-full border border-parchment-300 bg-white/70 p-0.5', className)}
    >
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          title={option.title}
          aria-pressed={corpus === option.id}
          onClick={() => setCorpus(option.id)}
          className={cn(
            'rounded-full px-3 py-1 text-xs font-medium transition-colors',
            corpus === option.id ? 'bg-ink-800 text-parchment-50' : 'text-ink-600 hover:bg-parchment-100',
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
