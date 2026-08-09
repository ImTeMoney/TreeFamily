import { Link, useParams, useNavigate } from 'react-router-dom';
import { ArrowRight, Hourglass } from 'lucide-react';
import { dataset } from '../data/repository';
import { peopleInPeriod } from '../utils/people';
import { PersonCard } from '../components/PersonCard';
import { CertaintyBadge } from '../components/CertaintyBadge';
import { roleGroups } from '../utils/labels';
import { matchesRoleGroup } from '../utils/people';
import { SourceList } from '../components/SourceList';
import { filterByCorpus } from '../utils/people';
import { useAppState } from '../hooks/useAppState';

export function PeriodsPage() {
  const { corpus } = useAppState();

  return (
    <div className="space-y-5">
      <header>
        <h1 className="section-title">תקופות</h1>
        <p className="text-sm text-ink-600">
          מהדורות הראשונים ועד עזרא ונחמיה, ומשם דרך הזוגות והתנאים ועד חתימת המשנה.
        </p>
      </header>

      <ol className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {filterByCorpus(dataset.periods, corpus).map((period) => {
          const count = peopleInPeriod(period.id).length;
          return (
            <li key={period.id}>
              <Link
                to={`/periods/${period.id}`}
                className="card group flex h-full flex-col gap-2 p-5 transition-all hover:-translate-y-0.5 hover:border-gold-500 hover:shadow-pop"
              >
                <span className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: period.color }} aria-hidden />
                  <span className="text-xs font-semibold text-ink-400">תקופה {period.order}</span>
                </span>
                <h2 className="font-display text-xl font-bold text-ink-900 group-hover:text-ink-700">{period.name}</h2>
                <p className="flex-1 text-sm leading-relaxed text-ink-600">{period.description}</p>
                <span className="text-xs text-ink-400">{count} דמויות</span>
              </Link>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export function PeriodDetailPage() {
  const { periodId } = useParams();
  const navigate = useNavigate();
  const period = periodId ? dataset.periodById.get(periodId) : undefined;

  if (!period) {
    return (
      <div className="card p-8 text-center">
        <p className="text-ink-600">התקופה לא נמצאה.</p>
        <Link to="/periods" className="btn-secondary mt-4">
          לרשימת התקופות
        </Link>
      </div>
    );
  }

  const people = peopleInPeriod(period.id);
  const periodEvents = dataset.events
    .filter((e) => e.periodId === period.id || (e.at >= period.from && e.at <= period.to))
    .sort((a, b) => a.at - b.at);

  return (
    <div className="space-y-6">
      <button type="button" onClick={() => navigate('/periods')} className="btn-ghost text-sm">
        <ArrowRight className="h-4 w-4" />
        כל התקופות
      </button>

      <header className="card p-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="h-3 w-3 rounded-full" style={{ backgroundColor: period.color }} aria-hidden />
          <span className="text-xs font-semibold text-ink-400">תקופה {period.order}</span>
          <CertaintyBadge certainty={period.certainty} />
        </div>
        <h1 className="mt-2 font-display text-3xl font-bold text-ink-900">{period.name}</h1>
        <p className="mt-2 max-w-3xl leading-relaxed text-ink-600">{period.description}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link to={`/timeline?period=${period.id}`} className="btn-primary text-sm">
            <Hourglass className="h-4 w-4" />
            הצגה על ציר הזמן
          </Link>
        </div>
        <div className="mt-4">
          <h2 className="mb-1.5 text-xs font-bold uppercase tracking-wide text-ink-400">מקורות</h2>
          <SourceList sources={period.sources} />
        </div>
      </header>

      <section>
        <h2 className="section-title mb-3">אנשים שחיו בתקופה ({people.length})</h2>
        <div className="space-y-6">
          {(() => {
            // כל דמות מוצגת פעם אחת בלבד, תחת הקטגוריה הראשונה שהיא תואמת
            const shown = new Set<string>();
            return roleGroups
              .filter((group) => group.id !== 'all')
              .map((group) => {
                const members = people.filter((p) => !shown.has(p.id) && matchesRoleGroup(p, group.id));
                members.forEach((p) => shown.add(p.id));
                if (members.length === 0) return null;
                return (
                  <div key={group.id}>
                    <h3 className="mb-2 font-display text-lg font-bold text-ink-800">
                      {group.label}
                      <span className="mr-2 text-sm font-normal text-ink-400">{members.length}</span>
                    </h3>
                    <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
                      {members.map((person) => (
                        <PersonCard key={`${group.id}-${person.id}`} person={person} compact />
                      ))}
                    </div>
                  </div>
                );
              });
          })()}
        </div>
      </section>

      <section>
        <h2 className="section-title mb-3">אירועים מרכזיים</h2>
        {periodEvents.length === 0 && <p className="card p-6 text-sm text-ink-400">לא תועדו אירועים בתקופה זו במאגר.</p>}
        <ul className="grid gap-3 sm:grid-cols-2">
          {periodEvents.map((event) => (
            <li key={event.id}>
              <Link
                to={`/events/${event.id}`}
                className="card block h-full p-4 transition-all hover:-translate-y-0.5 hover:border-gold-500 hover:shadow-pop"
              >
                <h3 className="font-display text-base font-bold text-ink-900">{event.name}</h3>
                <p className="mt-1 line-clamp-2 text-sm text-ink-600">{event.description}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
