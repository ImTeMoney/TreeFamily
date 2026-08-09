import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CalendarClock, Network, ScrollText, Users, X } from 'lucide-react';
import { dataset } from '../data/repository';
import { useAppState } from '../hooks/useAppState';
import { useIsMobile } from '../hooks/useMediaQuery';
import { displayName, eventsOfPerson, familiesOfPerson } from '../utils/people';
import { relationLabels, roleEmoji, roleLabels } from '../utils/labels';
import { cn } from '../utils/cn';
import { CertaintyBadge } from './CertaintyBadge';
import { SourceList } from './SourceList';
import { ContemporariesList } from './ContemporariesList';

type Tab = 'details' | 'contemporaries' | 'family';

const tabs: Array<{ id: Tab; label: string; icon: typeof Users }> = [
  { id: 'details', label: 'פרטים', icon: ScrollText },
  { id: 'contemporaries', label: 'מי חי בתקופתו?', icon: Users },
  { id: 'family', label: 'משפחה', icon: Network },
];

/** כרטיס הדמות — Side Panel במחשב, Bottom Sheet במובייל */
export function PersonDrawer() {
  const { activePersonId, closePerson, goBack, history, openPerson } = useAppState();
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('details');

  const person = activePersonId ? dataset.peopleById.get(activePersonId) : undefined;

  useEffect(() => {
    setTab('details');
  }, [activePersonId]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closePerson();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [closePerson]);

  if (!person) return null;

  const periods = person.periodIds.map((id) => dataset.periodById.get(id)).filter(Boolean);
  const events = eventsOfPerson(person);
  const familyGroups = familiesOfPerson(person);

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-ink-900/25 backdrop-blur-[2px] animate-fade-in"
        onClick={closePerson}
        aria-hidden
      />
      <aside
        role="dialog"
        aria-label={`כרטיס הדמות ${displayName(person)}`}
        className={cn(
          'fixed z-50 flex flex-col bg-parchment-50 shadow-pop',
          isMobile
            ? 'inset-x-0 bottom-0 max-h-[88vh] rounded-t-3xl animate-slide-up'
            : 'inset-y-0 left-0 w-full max-w-md animate-slide-in-right border-l border-parchment-200',
        )}
      >
        {isMobile && <div className="mx-auto mt-2 h-1.5 w-12 rounded-full bg-parchment-300" aria-hidden />}

        <header className="flex items-start gap-2 border-b border-parchment-200 px-5 py-4">
          {history.length > 0 && (
            <button type="button" onClick={goBack} className="btn-ghost px-2 py-1" aria-label="חזרה לדמות הקודמת">
              <ArrowRight className="h-4 w-4" />
            </button>
          )}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-xl" aria-hidden>
                {roleEmoji[person.roles[0] ?? 'other']}
              </span>
              <h2 className="truncate font-display text-2xl font-bold text-ink-900">{person.name}</h2>
            </div>
            {person.fullName && person.fullName !== person.name && (
              <p className="mt-0.5 text-sm text-ink-600">{person.fullName}</p>
            )}
            {person.disambiguation && <p className="mt-0.5 text-xs text-gold-600">{person.disambiguation}</p>}
          </div>
          <button type="button" onClick={closePerson} className="btn-ghost px-2 py-1" aria-label="סגירה">
            <X className="h-4 w-4" />
          </button>
        </header>

        <nav className="flex gap-1 border-b border-parchment-200 px-3 py-2">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={cn(
                'flex flex-1 items-center justify-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-medium transition-colors',
                tab === id ? 'bg-ink-800 text-parchment-50' : 'text-ink-600 hover:bg-parchment-100',
              )}
            >
              <Icon className="h-3.5 w-3.5" aria-hidden />
              {label}
            </button>
          ))}
        </nav>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {tab === 'details' && (
            <div className="space-y-5">
              <p className="font-display text-[15px] leading-relaxed text-ink-800">{person.summary}</p>

              <div className="flex flex-wrap items-center gap-2">
                <CertaintyBadge certainty={person.certainty} withExplain />
                {person.tribe && (
                  <span className="chip">שבט {person.tribe}</span>
                )}
              </div>

              <Section title="תקופה">
                <div className="flex flex-wrap gap-1.5">
                  {periods.map(
                    (period) =>
                      period && (
                        <button
                          key={period.id}
                          type="button"
                          onClick={() => {
                            closePerson();
                            navigate(`/periods/${period.id}`);
                          }}
                          className="chip"
                        >
                          {period.name}
                        </button>
                      ),
                  )}
                  {periods.length === 0 && <span className="text-sm text-ink-400">לא צוינה תקופה.</span>}
                </div>
                {person.span.label && <p className="mt-1.5 text-xs text-ink-400">{person.span.label}</p>}
              </Section>

              {person.titles.length > 0 && (
                <Section title="תפקידים">
                  <ul className="list-inside list-disc space-y-0.5 text-sm text-ink-700">
                    {person.titles.map((title) => (
                      <li key={title}>{title}</li>
                    ))}
                  </ul>
                </Section>
              )}

              <Section title="קטגוריות">
                <div className="flex flex-wrap gap-1.5">
                  {person.roles.map((role) => (
                    <span key={role} className="chip">
                      {roleEmoji[role]} {roleLabels[role]}
                    </span>
                  ))}
                </div>
              </Section>

              {person.relations.length > 0 && (
                <Section title="משפחה">
                  <ul className="space-y-1">
                    {person.relations.map((relation) => {
                      const related = dataset.peopleById.get(relation.personId);
                      if (!related) return null;
                      return (
                        <li key={`${relation.personId}-${relation.kind}`}>
                          <button
                            type="button"
                            onClick={() => openPerson(related.id)}
                            className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-right text-sm transition-colors hover:bg-parchment-100"
                          >
                            <span className="w-14 shrink-0 text-xs text-ink-400">
                              {relation.note ?? relationLabels[relation.kind]}
                            </span>
                            <span className="truncate font-medium text-ink-800">{displayName(related)}</span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </Section>
              )}

              <Section title="מופיע בספרים">
                <div className="flex flex-wrap gap-1.5">
                  {person.bookIds.map((bookId) => {
                    const book = dataset.bookById.get(bookId);
                    if (!book) return null;
                    return (
                      <button
                        key={bookId}
                        type="button"
                        onClick={() => {
                          closePerson();
                          navigate(`/books/${book.id}`);
                        }}
                        className="chip"
                      >
                        {book.name}
                      </button>
                    );
                  })}
                  {person.bookIds.length === 0 && <span className="text-sm text-ink-400">לא צוינו ספרים.</span>}
                </div>
              </Section>

              {events.length > 0 && (
                <Section title="אירועים">
                  <ul className="space-y-1">
                    {events.map((event) => (
                      <li key={event.id}>
                        <button
                          type="button"
                          onClick={() => {
                            closePerson();
                            navigate(`/events/${event.id}`);
                          }}
                          className="w-full rounded-lg px-2 py-1.5 text-right text-sm text-ink-800 transition-colors hover:bg-parchment-100"
                        >
                          {event.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                </Section>
              )}

              <Section title="מקורות">
                <SourceList sources={person.sources} />
              </Section>
            </div>
          )}

          {tab === 'contemporaries' && <ContemporariesList person={person} />}

          {tab === 'family' && (
            <div className="space-y-4">
              {familyGroups.length === 0 && (
                <p className="text-sm text-ink-400">הדמות אינה משויכת לאשכול משפחתי במאגר הנוכחי.</p>
              )}
              {familyGroups.map((family) => (
                <div key={family.id} className="card p-4">
                  <h3 className="font-display text-base font-bold text-ink-900">{family.name}</h3>
                  <p className="mt-1 text-sm text-ink-600">{family.description}</p>
                  <button
                    type="button"
                    onClick={() => {
                      closePerson();
                      navigate(`/families/${family.id}?focus=${person.id}`);
                    }}
                    className="btn-secondary mt-3 w-full"
                  >
                    <Network className="h-4 w-4" />
                    פתיחת עץ המשפחה
                  </button>
                </div>
              ))}
              <div className="rounded-xl border border-parchment-200 bg-white/70 p-4">
                <h3 className="text-sm font-semibold text-ink-800">קשרים ישירים</h3>
                <ul className="mt-2 space-y-1">
                  {person.relations.map((relation) => {
                    const related = dataset.peopleById.get(relation.personId);
                    if (!related) return null;
                    return (
                      <li key={`${relation.personId}-${relation.kind}-tree`}>
                        <button
                          type="button"
                          onClick={() => openPerson(related.id)}
                          className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-right text-sm transition-colors hover:bg-parchment-100"
                        >
                          <span className="w-14 shrink-0 text-xs text-ink-400">
                            {relation.note ?? relationLabels[relation.kind]}
                          </span>
                          <span className="truncate font-medium text-ink-800">{displayName(related)}</span>
                        </button>
                      </li>
                    );
                  })}
                  {person.relations.length === 0 && (
                    <li className="px-2 py-1.5 text-sm text-ink-400">לא נזכרו קרובי משפחה בכתוב.</li>
                  )}
                </ul>
              </div>
            </div>
          )}
        </div>

        <footer className="border-t border-parchment-200 bg-white/70 p-4">
          <button
            type="button"
            onClick={() => {
              closePerson();
              navigate(`/timeline?person=${person.id}${person.periodIds[0] ? `&period=${person.periodIds[0]}` : ''}`);
            }}
            className="btn-primary w-full"
          >
            <CalendarClock className="h-4 w-4" />
            פתח בתקופת הזמן
          </button>
        </footer>
      </aside>
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h3 className="mb-1.5 text-xs font-bold uppercase tracking-wide text-ink-400">{title}</h3>
      {children}
    </section>
  );
}
