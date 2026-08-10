import { useMemo, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { dataset } from '../data/repository';
import { Timeline } from '../components/Timeline';
import { applyFilters, emptyFilters, FilterBar, type TimelineFilters } from '../components/FilterBar';
import { HelpPopover } from '../components/HelpPopover';
import { useAppState } from '../hooks/useAppState';
import { filterByCorpus } from '../utils/people';

export function TimelinePage() {
  const { corpus, openTour } = useAppState();
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const focusPeriodId = params.get('period');
  const highlightPersonId = params.get('person');

  const [filters, setFilters] = useState<TimelineFilters>(() => ({
    ...emptyFilters,
    periodId: params.get('filterPeriod'),
  }));

  const people = useMemo(
    () => applyFilters(filterByCorpus(dataset.people, corpus), filters),
    [filters, corpus],
  );

  return (
    <div className="space-y-5">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="section-title">ציר הזמן</h1>
          <p className="text-sm text-ink-600">
            כל רצועה היא אדם, ואורכה מייצג את התקופה שבה חי. רצועות חופפות = אנשים שחיו יחד.
          </p>
        </div>
        <HelpPopover onOpenTour={openTour} />
      </header>

      {highlightPersonId && dataset.peopleById.get(highlightPersonId) && (
        <div className="flex items-center gap-2 rounded-xl border border-gold-500/40 bg-gold-100/50 px-4 py-2 text-sm text-ink-800">
          <span>
            מוקד בדמות: <strong>{dataset.peopleById.get(highlightPersonId)?.name}</strong>
          </span>
          <button
            type="button"
            onClick={() => {
              setParams((prev) => {
                const next = new URLSearchParams(prev);
                next.delete('person');
                return next;
              });
            }}
            className="btn-ghost mr-auto text-xs"
          >
            ביטול המיקוד
          </button>
        </div>
      )}

      <FilterBar value={filters} onChange={setFilters} />

      <Timeline
        people={people}
        progressive
        focusPeriodId={focusPeriodId}
        highlightPersonId={highlightPersonId}
        onSelectPeriod={(period) => {
          setParams((prev) => {
            const next = new URLSearchParams(prev);
            next.set('period', period.id);
            return next;
          });
        }}
      />

      <section className="card p-4">
        <h2 className="mb-2 font-display text-lg font-bold text-ink-900">מעבר מהיר לתקופה</h2>
        <div className="flex flex-wrap gap-1.5">
          {filterByCorpus(dataset.periods, corpus).map((period) => (
            <button
              key={period.id}
              type="button"
              onClick={() => {
                setParams((prev) => {
                  const next = new URLSearchParams(prev);
                  next.set('period', period.id);
                  next.delete('person');
                  return next;
                });
              }}
              className={`chip ${focusPeriodId === period.id ? 'chip-active' : ''}`}
            >
              {period.name}
            </button>
          ))}
        </div>
        {focusPeriodId && (
          <button
            type="button"
            onClick={() => navigate(`/periods/${focusPeriodId}`)}
            className="btn-secondary mt-3 text-sm"
          >
            למסך התקופה המלא
          </button>
        )}
      </section>
    </div>
  );
}
