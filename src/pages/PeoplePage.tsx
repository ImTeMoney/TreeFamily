import { useMemo, useState } from 'react';
import { dataset } from '../data/repository';
import { PersonCard } from '../components/PersonCard';
import { applyFilters, emptyFilters, FilterBar, type TimelineFilters } from '../components/FilterBar';
import { byTimeline, filterByCorpus } from '../utils/people';
import { useAppState } from '../hooks/useAppState';

export function PeoplePage() {
  const { corpus } = useAppState();
  const [filters, setFilters] = useState<TimelineFilters>(emptyFilters);
  const [query, setQuery] = useState('');

  const scoped = useMemo(() => filterByCorpus(dataset.people, corpus), [corpus]);

  const people = useMemo(() => {
    const base = applyFilters(scoped, filters).sort(byTimeline);
    const q = query.trim();
    if (!q) return base;
    return base.filter(
      (p) =>
        p.name.includes(q) ||
        (p.fullName ?? '').includes(q) ||
        (p.disambiguation ?? '').includes(q) ||
        p.summary.includes(q),
    );
  }, [scoped, filters, query]);

  return (
    <div className="space-y-5">
      <header>
        <h1 className="section-title">דמויות</h1>
        <p className="text-sm text-ink-600">
          {scoped.length} דמויות בתצוגה הנוכחית — מלכים, נביאים וחכמים, וגם דמויות שנזכרות פעם אחת בלבד.
        </p>
      </header>

      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="סינון מהיר לפי שם..."
        aria-label="סינון דמויות לפי שם"
        className="w-full rounded-xl border border-parchment-300 bg-white/90 px-4 py-2.5 text-sm text-ink-900 placeholder:text-ink-400 focus:border-gold-500 focus:outline-none"
      />

      <FilterBar value={filters} onChange={setFilters} />

      <p className="text-sm text-ink-400">נמצאו {people.length} דמויות.</p>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {people.map((person) => (
          <PersonCard key={person.id} person={person} />
        ))}
      </div>

      {people.length === 0 && (
        <p className="card p-8 text-center text-sm text-ink-400">לא נמצאו דמויות התואמות את הסינון.</p>
      )}
    </div>
  );
}
