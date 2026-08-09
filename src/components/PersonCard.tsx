import { dataset } from '../data/repository';
import type { Person } from '../types';
import { useAppState } from '../hooks/useAppState';
import { displayName } from '../utils/people';
import { certaintyDots, roleEmoji, roleLabels } from '../utils/labels';
import { cn } from '../utils/cn';

interface Props {
  person: Person;
  compact?: boolean;
  className?: string;
}

/** כרטיס דמות ברשימות. לחיצה פותחת את כרטיס הדמות המלא. */
export function PersonCard({ person, compact, className }: Props) {
  const { openPerson } = useAppState();
  const period = person.periodIds[0] ? dataset.periodById.get(person.periodIds[0]) : undefined;

  return (
    <button
      type="button"
      onClick={() => openPerson(person.id)}
      className={cn(
        'card group flex w-full flex-col gap-1 p-4 text-right transition-all duration-200',
        'hover:-translate-y-0.5 hover:border-gold-500 hover:shadow-pop',
        compact && 'p-3',
        className,
      )}
    >
      <div className="flex items-start gap-2">
        <span className="text-lg leading-none" aria-hidden>
          {roleEmoji[person.roles[0] ?? 'other']}
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-display text-base font-bold text-ink-900 group-hover:text-ink-700">
            {person.name}
          </h3>
          {person.fullName && person.fullName !== person.name && (
            <p className="truncate text-xs text-ink-400">{displayName(person)}</p>
          )}
        </div>
        <span title={person.certainty} aria-hidden className="text-xs">
          {certaintyDots[person.certainty]}
        </span>
      </div>

      {!compact && (
        <>
          <p className="line-clamp-2 text-sm leading-relaxed text-ink-600">{person.summary}</p>
          <div className="mt-1 flex flex-wrap gap-1.5">
            {period && (
              <span className="rounded-full bg-parchment-100 px-2 py-0.5 text-[11px] font-medium text-ink-700">
                {period.name}
              </span>
            )}
            {person.roles.slice(0, 2).map((role) => (
              <span key={role} className="rounded-full bg-ink-800/5 px-2 py-0.5 text-[11px] text-ink-600">
                {roleLabels[role]}
              </span>
            ))}
          </div>
        </>
      )}
    </button>
  );
}
