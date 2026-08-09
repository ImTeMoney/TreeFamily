import { useState } from 'react';
import { BookOpen, ChevronDown } from 'lucide-react';
import type { SourceRef } from '../types';
import { dataset } from '../data/repository';
import { cn } from '../utils/cn';

/** רשימת מקורות. לחיצה על מקור פותחת את הציטוט, אם קיים במאגר. */
export function SourceList({ sources, className }: { sources: SourceRef[]; className?: string }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (sources.length === 0) {
    return <p className={cn('text-sm text-ink-400', className)}>לא צוין מקור.</p>;
  }

  return (
    <ul className={cn('space-y-1.5', className)}>
      {sources.map((source, index) => {
        const book = dataset.bookById.get(source.bookId);
        const isOpen = openIndex === index;
        return (
          <li key={`${source.bookId}-${source.ref}-${index}`}>
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="flex w-full items-center gap-2 rounded-lg border border-parchment-200 bg-parchment-50/70 px-3 py-2 text-right text-sm text-ink-700 transition-colors hover:border-gold-500 hover:bg-white"
            >
              <BookOpen className="h-4 w-4 shrink-0 text-gold-600" aria-hidden />
              <span className="font-medium">{book?.name ?? source.bookId}</span>
              <span className="text-ink-400">{source.ref}</span>
              {source.quote && (
                <ChevronDown
                  className={cn('mr-auto h-4 w-4 shrink-0 transition-transform', isOpen && 'rotate-180')}
                  aria-hidden
                />
              )}
            </button>
            {isOpen && source.quote && (
              <blockquote className="mt-1.5 rounded-lg border-r-2 border-gold-500 bg-white/80 px-3 py-2 font-display text-sm leading-relaxed text-ink-800 animate-fade-in">
                „{source.quote}”
              </blockquote>
            )}
            {isOpen && !source.quote && (
              <p className="mt-1.5 px-3 text-xs text-ink-400">
                הפסוקים המלאים אינם שמורים במאגר בשלב זה — ההפניה מציינת את מקום העניין בכתוב.
              </p>
            )}
          </li>
        );
      })}
    </ul>
  );
}
