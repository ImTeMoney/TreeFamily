import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowRight, Hourglass } from 'lucide-react';
import { dataset } from '../data/repository';
import { CertaintyBadge } from '../components/CertaintyBadge';
import { SourceList } from '../components/SourceList';
import { PersonCard } from '../components/PersonCard';
import { contemporariesOf, peopleInEvent } from '../utils/people';
import { useAppState } from '../hooks/useAppState';

export function EventsPage() {
  const { corpus } = useAppState();
  const sorted = [...dataset.events]
    .filter((event) => corpus === 'all' || dataset.periodById.get(event.periodId)?.corpus === corpus)
    .sort((a, b) => a.at - b.at);

  return (
    <div className="space-y-5">
      <header>
        <h1 className="section-title">אירועים</h1>
        <p className="text-sm text-ink-600">רשימה כרונולוגית, מבריאת העולם ועד חתימת המשנה.</p>
      </header>

      <ol className="relative space-y-3 pr-6">
        <span className="absolute right-2 top-2 h-[calc(100%-1rem)] w-0.5 rounded-full bg-parchment-300" aria-hidden />
        {sorted.map((event) => {
          const period = dataset.periodById.get(event.periodId);
          return (
            <li key={event.id} className="relative">
              <span
                className="absolute right-[-1.15rem] top-5 h-3 w-3 rounded-full border-2 border-white shadow"
                style={{ backgroundColor: period?.color ?? '#c19a4b' }}
                aria-hidden
              />
              <Link
                to={`/events/${event.id}`}
                className="card block p-4 transition-all hover:-translate-y-0.5 hover:border-gold-500 hover:shadow-pop"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-display text-lg font-bold text-ink-900">{event.name}</h2>
                  {period && <span className="chip">{period.name}</span>}
                </div>
                <p className="mt-1 text-sm leading-relaxed text-ink-600">{event.description}</p>
              </Link>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export function EventDetailPage() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const event = eventId ? dataset.eventById.get(eventId) : undefined;

  if (!event) {
    return (
      <div className="card p-8 text-center">
        <p className="text-ink-600">האירוע לא נמצא.</p>
        <Link to="/events" className="btn-secondary mt-4">
          לרשימת האירועים
        </Link>
      </div>
    );
  }

  const period = dataset.periodById.get(event.periodId);
  const involved = peopleInEvent(event);
  const contemporaries = involved[0]
    ? contemporariesOf(involved[0]).filter((p) => !event.personIds.includes(p.id)).slice(0, 24)
    : [];

  return (
    <div className="space-y-6">
      <button type="button" onClick={() => navigate('/events')} className="btn-ghost text-sm">
        <ArrowRight className="h-4 w-4" />
        כל האירועים
      </button>

      <header className="card p-6">
        <div className="flex flex-wrap items-center gap-2">
          {period && (
            <Link to={`/periods/${period.id}`} className="chip">
              {period.name}
            </Link>
          )}
          <CertaintyBadge certainty={event.certainty} />
        </div>
        <h1 className="mt-2 font-display text-3xl font-bold text-ink-900">{event.name}</h1>
        <p className="mt-2 max-w-3xl leading-relaxed text-ink-600">{event.description}</p>
        {period && (
          <Link to={`/timeline?period=${period.id}`} className="btn-primary mt-4 text-sm">
            <Hourglass className="h-4 w-4" />
            הצגה על ציר הזמן
          </Link>
        )}
      </header>

      <section>
        <h2 className="section-title mb-3">מי היה מעורב</h2>
        <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
          {involved.map((person) => (
            <PersonCard key={person.id} person={person} compact />
          ))}
        </div>
        {involved.length === 0 && <p className="card p-6 text-sm text-ink-400">לא שויכו דמויות לאירוע זה.</p>}
      </section>

      {contemporaries.length > 0 && (
        <section>
          <h2 className="section-title mb-3">מי עוד חי באותה תקופה</h2>
          <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
            {contemporaries.map((person) => (
              <PersonCard key={person.id} person={person} compact />
            ))}
          </div>
        </section>
      )}

      <section className="card p-6">
        <h2 className="mb-2 font-display text-lg font-bold text-ink-900">מקור בתנ״ך</h2>
        <SourceList sources={event.sources} />
      </section>
    </div>
  );
}
