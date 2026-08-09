import { useMemo, useState } from 'react';
import type { Person } from '../types';
import { useAppState } from '../hooks/useAppState';
import { contemporariesOf, displayName, matchesRoleGroup, overlapCertainty } from '../utils/people';
import { certaintyDots, roleEmoji, roleGroups, type RoleGroupId } from '../utils/labels';
import { cn } from '../utils/cn';

interface Props {
  person: Person;
  className?: string;
}

/** "מי חי בתקופתו?" — כל הדמויות שיש להן חפיפה בתקופת החיים */
export function ContemporariesList({ person, className }: Props) {
  const { openPerson } = useAppState();
  const [group, setGroup] = useState<RoleGroupId>('all');
  const all = useMemo(() => contemporariesOf(person), [person]);
  const filtered = useMemo(() => all.filter((p) => matchesRoleGroup(p, group)), [all, group]);

  return (
    <div className={className}>
      <div className="no-scrollbar -mx-1 mb-3 flex gap-1.5 overflow-x-auto px-1 pb-1">
        {roleGroups.map((option) => {
          const count = all.filter((p) => matchesRoleGroup(p, option.id)).length;
          if (count === 0 && option.id !== 'all') return null;
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => setGroup(option.id)}
              className={cn('chip shrink-0', group === option.id && 'chip-active')}
            >
              {option.label}
              <span className={cn('text-[10px]', group === option.id ? 'text-parchment-200' : 'text-ink-400')}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      <ul className="space-y-1">
        {filtered.map((other) => (
          <li key={other.id}>
            <button
              type="button"
              onClick={() => openPerson(other.id)}
              className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-right text-sm transition-colors hover:bg-parchment-100"
            >
              <span aria-hidden>{roleEmoji[other.roles[0] ?? 'other']}</span>
              <span className="truncate font-medium text-ink-800">{other.name}</span>
              {other.disambiguation && (
                <span className="truncate text-[11px] text-ink-400">{other.disambiguation}</span>
              )}
              <span
                className="mr-auto shrink-0 text-[10px]"
                title={`ודאות החפיפה: ${overlapCertainty(person, other)}`}
                aria-hidden
              >
                {certaintyDots[overlapCertainty(person, other)]}
              </span>
            </button>
          </li>
        ))}
        {filtered.length === 0 && <li className="px-2 py-3 text-sm text-ink-400">אין דמויות בקטגוריה זו.</li>}
      </ul>

      <p className="mt-3 rounded-lg bg-parchment-100/70 p-2 text-[11px] leading-relaxed text-ink-600">
        החפיפה מחושבת לפי הטווח הסכמטי של כל דמות. 🟢 חפיפה ודאית · 🟡 חפיפה משוערת · 🔴 לא ניתן לקבוע.
        {' '}נמצאו {all.length} דמויות שחיו בתקופתו של {displayName(person)}.
      </p>
    </div>
  );
}
