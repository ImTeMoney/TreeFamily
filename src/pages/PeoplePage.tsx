import { useMemo, useState } from 'react';
import { dataset } from '../data/repository';
import { PersonCard } from '../components/PersonCard';
import { applyFilters, emptyFilters, FilterBar, type TimelineFilters } from '../components/FilterBar';
import { byTimeline } from '../utils/people';

export function PeoplePage() {
  const [filters, setFilters] = useState<TimelineFilters>(emptyFilters);
  const [query, setQuery] = useState('');

  const people = useMemo(() => {
    const base = applyFilters(dataset.people, filters).sort(byTimeline);
    const q = query.trim();
    if (!q) return base;
    return base.filter(
      (p) =>
        p.name.includes(q) ||
        (p.fullName ?? '').includes(q) ||
        (p.disambiguation ?? '').includes(q) ||
        p.summary.includes(q),
    );
  }, [filters, query]);

  return (
    <div className="space-y-5">
      <header>
        <h1 className="section-title">דמויות</h1>
        <p className="text-sm text-ink-600">
          {dataset.people.length} דמויות במאגר — מלכים ונביאים, וגם דמויות שנזכרות פעם אחת בלבד.
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
