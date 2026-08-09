import { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { dataset } from '../data/repository';
import { SearchBar } from '../components/SearchBar';
import { search, searchKindLabels } from '../utils/search';
import { useAppState } from '../hooks/useAppState';
import { displayName } from '../utils/people';
import { roleEmoji, roleLabels } from '../utils/labels';

const examples = ['אחיתופל', 'בנות צלפחד', 'דוד', 'מי חי בתקופת משה?', 'מי היה אבא של מפיבושת?', 'מי חי בתקופת אליהו?'];

export function SearchPage() {
  const [params, setParams] = useSearchParams();
  const query = params.get('q') ?? '';
  const { openPerson } = useAppState();

  const results = useMemo(() => (query.trim() ? search(query, 60) : []), [query]);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="section-title">חיפוש</h1>
        <p className="text-sm text-ink-600">חפשו דמות, תקופה, אירוע, משפחה או ספר.</p>
      </header>

      <SearchBar variant="hero" autoFocus />

      <div className="flex flex-wrap items-center gap-1.5">
        <span className="text-xs text-ink-400">דוגמאות:</span>
        {examples.map((example) => (
          <button key={example} type="button" onClick={() => setParams({ q: example })} className="chip">
            {example}
          </button>
        ))}
      </div>

      {query && <p className="text-sm text-ink-400">{results.length} תוצאות עבור „{query}”.</p>}

      <ul className="grid gap-3 sm:grid-cols-2">
        {results.map((result) => {
          if (result.kind === 'person') {
            const person = result.person;
            const period = person.periodIds[0] ? dataset.periodById.get(person.periodIds[0]) : undefined;
            return (
              <li key={`person-${person.id}`}>
                <button
                  type="button"
                  onClick={() => openPerson(person.id)}
                  className="card h-full w-full p-5 text-right transition-all hover:-translate-y-0.5 hover:border-gold-500 hover:shadow-pop"
                >
                  <div className="flex items-center gap-2">
                    <span aria-hidden>{roleEmoji[person.roles[0] ?? 'other']}</span>
                    <h2 className="font-display text-lg font-bold text-ink-900">{displayName(person)}</h2>
                  </div>
                  <dl className="mt-2 space-y-1 text-sm text-ink-600">
                    <div className="flex gap-1.5">
                      <dt className="font-semibold text-ink-700">תקופה:</dt>
                      <dd>{period?.name ?? 'לא צוינה'}</dd>
                    </div>
                    <div className="flex gap-1.5">
                      <dt className="font-semibold text-ink-700">תפקיד:</dt>
                      <dd>{person.titles[0] ?? person.roles.map((r) => roleLabels[r]).join(', ')}</dd>
                    </div>
                    <div className="flex gap-1.5">
                      <dt className="font-semibold text-ink-700">משפחה:</dt>
                      <dd className="truncate">
                        {person.relations
                          .slice(0, 2)
                          .map((r) => dataset.peopleById.get(r.personId)?.name)
                          .filter(Boolean)
                          .join(', ') || 'לא צוינה'}
                      </dd>
                    </div>
                    <div className="flex gap-1.5">
                      <dt className="font-semibold text-ink-700">ספרים:</dt>
                      <dd className="truncate">
                        {person.bookIds
                          .map((id) => dataset.bookById.get(id)?.name)
                          .filter(Boolean)
                          .join(', ') || 'לא צוינו'}
                      </dd>
                    </div>
                  </dl>
                </button>
              </li>
            );
          }

          const to =
            result.kind === 'period'
              ? `/periods/${result.id}`
              : result.kind === 'event'
                ? `/events/${result.id}`
                : result.kind === 'family'
                  ? `/families/${result.id}`
                  : `/books/${result.id}`;

          return (
            <li key={`${result.kind}-${result.id}`}>
              <Link
                to={to}
                className="card block h-full p-5 transition-all hover:-translate-y-0.5 hover:border-gold-500 hover:shadow-pop"
              >
                <span className="rounded-full bg-parchment-100 px-2 py-0.5 text-[10px] font-semibold text-ink-600">
                  {searchKindLabels[result.kind]}
                </span>
                <h2 className="mt-2 font-display text-lg font-bold text-ink-900">{result.title}</h2>
                <p className="mt-1 text-sm text-ink-600">{result.subtitle}</p>
              </Link>
            </li>
          );
        })}
      </ul>

      {query && results.length === 0 && (
        <p className="card p-8 text-center text-sm text-ink-400">
          לא נמצאו תוצאות. נסו שם אחר, או חפשו לפי תקופה או אירוע.
        </p>
      )}
    </div>
  );
}
