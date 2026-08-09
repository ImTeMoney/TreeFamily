import { Filter, X } from 'lucide-react';
import type { Gender, RoleTag } from '../types';
import { dataset } from '../data/repository';
import { roleLabels } from '../utils/labels';
import { sectionLabels } from '../data/books';
import { filterByCorpus } from '../utils/people';
import { useAppState } from '../hooks/useAppState';
import { cn } from '../utils/cn';

export interface TimelineFilters {
  periodId: string | null;
  bookId: string | null;
  /** מדור — תורה / נביאים / כתובים, או סדר במשנה ובתלמוד */
  section: string | null;
  tribe: string | null;
  role: RoleTag | null;
  gender: Gender | null;
  familyId: string | null;
  /** להציג רק דמויות שתקופתן ודאית */
  onlyCertain: boolean;
  /** להציג גם דמויות שתקופתן משוערת או לא ידועה */
  includeEstimated: boolean;
}

export const emptyFilters: TimelineFilters = {
  periodId: null,
  bookId: null,
  section: null,
  tribe: null,
  role: null,
  gender: null,
  familyId: null,
  onlyCertain: false,
  includeEstimated: true,
};

const roleOptions: RoleTag[] = [
  'king', 'queen', 'prophet', 'prophetess', 'priest', 'levite', 'judge',
  'warrior', 'officer', 'scribe', 'elder', 'servant', 'craftsman', 'family', 'foreigner',
  'sage', 'tanna', 'nasi', 'zug',
];

const tribes = Array.from(new Set(dataset.people.map((p) => p.tribe).filter(Boolean) as string[])).sort((a, b) =>
  a.localeCompare(b, 'he'),
);

interface Props {
  value: TimelineFilters;
  onChange: (next: TimelineFilters) => void;
  className?: string;
}

function Select<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T | null;
  options: Array<{ value: T; label: string }>;
  onChange: (next: T | null) => void;
}) {
  return (
    <label className="flex flex-col gap-1 text-xs font-medium text-ink-600">
      {label}
      <select
        value={value ?? ''}
        onChange={(e) => onChange((e.target.value || null) as T | null)}
        className="min-w-[8.5rem] rounded-lg border border-parchment-300 bg-white/90 px-2.5 py-1.5 text-sm text-ink-800 transition-colors focus:border-gold-500 focus:outline-none"
      >
        <option value="">הכול</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function FilterBar({ value, onChange, className }: Props) {
  const { corpus } = useAppState();
  const periodOptions = filterByCorpus(dataset.periods, corpus);
  const bookOptions = filterByCorpus(dataset.books, corpus);
  /** המדורים הרלוונטיים לקורפוס הפעיל; ב"הכול" מוצגים כל המדורים לפי סדרם */
  const sectionOptions = Array.from(
    new Set(
      (corpus === 'all'
        ? Object.values(dataset.sectionsByCorpus).flat()
        : (dataset.sectionsByCorpus[corpus] ?? [])),
    ),
  );
  const set = <K extends keyof TimelineFilters>(key: K, next: TimelineFilters[K]) =>
    onChange({ ...value, [key]: next });

  const activeCount =
    [value.periodId, value.bookId, value.section, value.tribe, value.role, value.gender, value.familyId].filter(Boolean)
      .length +
    (value.onlyCertain ? 1 : 0) +
    (value.includeEstimated ? 0 : 1);

  return (
    <div className={cn('card flex flex-wrap items-end gap-3 p-4', className)}>
      <div className="flex items-center gap-1.5 pb-1 text-sm font-semibold text-ink-800">
        <Filter className="h-4 w-4 text-gold-600" aria-hidden />
        סינון
        {activeCount > 0 && (
          <span className="rounded-full bg-ink-800 px-1.5 text-[11px] text-parchment-50">{activeCount}</span>
        )}
      </div>

      <Select
        label="תקופה"
        value={value.periodId}
        onChange={(v) => set('periodId', v)}
        options={periodOptions.map((p) => ({ value: p.id, label: p.name }))}
      />
      <Select
        label="מדור"
        value={value.section}
        onChange={(v) => set('section', v)}
        options={sectionOptions.map((s) => ({ value: s, label: sectionLabels[s] ?? s }))}
      />
      <Select
        label="ספר"
        value={value.bookId}
        onChange={(v) => set('bookId', v)}
        options={bookOptions.map((b) => ({ value: b.id, label: b.name }))}
      />
      <Select
        label="שבט"
        value={value.tribe}
        onChange={(v) => set('tribe', v)}
        options={tribes.map((t) => ({ value: t, label: t }))}
      />
      <Select
        label="תפקיד"
        value={value.role}
        onChange={(v) => set('role', v)}
        options={roleOptions.map((r) => ({ value: r, label: roleLabels[r] }))}
      />
      <Select
        label="מין"
        value={value.gender}
        onChange={(v) => set('gender', v)}
        options={[
          { value: 'male' as const, label: 'גברים' },
          { value: 'female' as const, label: 'נשים' },
        ]}
      />
      <Select
        label="משפחה"
        value={value.familyId}
        onChange={(v) => set('familyId', v)}
        options={dataset.families.map((f) => ({ value: f.id, label: f.name }))}
      />

      <div className="flex flex-col gap-1.5 pb-0.5">
        <label className="flex items-center gap-2 text-xs text-ink-600">
          <input
            type="checkbox"
            checked={value.onlyCertain}
            onChange={(e) => set('onlyCertain', e.target.checked)}
            className="h-4 w-4 rounded border-parchment-300 accent-ink-800"
          />
          רק דמויות בעלות תקופה ודאית
        </label>
        <label className="flex items-center gap-2 text-xs text-ink-600">
          <input
            type="checkbox"
            checked={value.includeEstimated}
            onChange={(e) => set('includeEstimated', e.target.checked)}
            className="h-4 w-4 rounded border-parchment-300 accent-ink-800"
          />
          להציג הערכות
        </label>
      </div>

      {activeCount > 0 && (
        <button type="button" onClick={() => onChange(emptyFilters)} className="btn-ghost mr-auto text-xs">
          <X className="h-3.5 w-3.5" />
          ניקוי
        </button>
      )}
    </div>
  );
}

/** מחיל את הסינון על רשימת הדמויות */
export function applyFilters<T extends { periodIds: string[]; bookIds: string[]; tribe?: string; roles: RoleTag[]; gender: Gender; certainty: string; id: string }>(
  people: T[],
  filters: TimelineFilters,
): T[] {
  const family = filters.familyId ? dataset.familyById.get(filters.familyId) : undefined;
  return people.filter((person) => {
    if (filters.periodId && !person.periodIds.includes(filters.periodId)) return false;
    if (filters.bookId && !person.bookIds.includes(filters.bookId)) return false;
    if (
      filters.section &&
      !person.bookIds.some((bookId) => dataset.bookById.get(bookId)?.section === filters.section)
    ) {
      return false;
    }
    if (filters.tribe && person.tribe !== filters.tribe) return false;
    if (filters.role && !person.roles.includes(filters.role)) return false;
    if (filters.gender && person.gender !== filters.gender) return false;
    if (family && !family.personIds.includes(person.id)) return false;
    if (filters.onlyCertain && person.certainty !== 'certain') return false;
    if (!filters.includeEstimated && person.certainty !== 'certain') return false;
    return true;
  });
}
