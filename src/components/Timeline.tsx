import { useEffect, useMemo, useRef, useState } from 'react';
import { Crosshair, Maximize2, Minus, Plus, RotateCcw } from 'lucide-react';
import type { Period, Person } from '../types';
import { dataset } from '../data/repository';
import { useAppState } from '../hooks/useAppState';
import { useIsMobile } from '../hooks/useMediaQuery';
import { byTimeline } from '../utils/people';
import { AXIS_MAX, AXIS_MIN, toPercent } from '../utils/axis';
import { cn } from '../utils/cn';
import { TimelinePeriodBand } from './TimelinePeriod';
import { TimelinePersonBar } from './TimelinePerson';
import { PersonCard } from './PersonCard';

const LANE_HEIGHT = 30;
const MIN_ZOOM = 1;
const MAX_ZOOM = 8;

interface Props {
  people: Person[];
  /** תקופה שאליה הציר ממוקד */
  focusPeriodId?: string | null;
  /** דמות המודגשת על הציר */
  highlightPersonId?: string | null;
  onSelectPeriod?: (period: Period) => void;
  className?: string;
}

/** מסדר את הדמויות במסלולים כך ששני Bars לא ייחפפו באותה שורה */
function assignLanes(people: Person[], minGap: number): Map<string, number> {
  const lanes: number[] = [];
  const result = new Map<string, number>();
  for (const person of [...people].sort(byTimeline)) {
    const start = person.span.from;
    const end = Math.max(person.span.to, start + 0.8);
    let lane = lanes.findIndex((laneEnd) => start > laneEnd + minGap);
    if (lane === -1) {
      lane = lanes.length;
      lanes.push(end);
    } else {
      lanes[lane] = end;
    }
    result.set(person.id, lane);
  }
  return result;
}

export function Timeline({ people, focusPeriodId, highlightPersonId, onSelectPeriod, className }: Props) {
  const isMobile = useIsMobile();
  const { openPerson } = useAppState();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1.6);
  const dragState = useRef<{ x: number; scroll: number } | null>(null);
  const [dragging, setDragging] = useState(false);

  /**
   * רוחב "רעש" למניעת נגיעה בין תוויות — קטן ככל שמתקרבים.
   * מחושב כשיעור מאורך הציר, כדי שהצפיפות תישאר זהה גם כשהציר מתארך.
   */
  const minGap = ((AXIS_MAX - AXIS_MIN) * 0.06) / zoom;
  const lanes = useMemo(() => assignLanes(people, minGap), [people, minGap]);
  const laneCount = useMemo(() => Math.max(...[...lanes.values()], 0) + 1, [lanes]);

  /** ממרכז את התצוגה על ערך מסוים בציר (ולא על אחוז) */
  const scrollToAxis = (value: number) => {
    const el = scrollRef.current;
    if (!el) return;
    const inner = el.scrollWidth;
    // בכיוון RTL הגלילה נמדדת כערך שלילי מהקצה הימני
    const targetFromRight = (toPercent(value) / 100) * inner;
    el.scrollTo({ left: -(targetFromRight - el.clientWidth / 2), behavior: 'smooth' });
  };

  useEffect(() => {
    if (!focusPeriodId) return;
    const period = dataset.periodById.get(focusPeriodId);
    if (!period) return;
    setZoom((z) => Math.max(z, 2.4));
    const timer = window.setTimeout(() => scrollToAxis((period.from + period.to) / 2), 60);
    return () => window.clearTimeout(timer);
  }, [focusPeriodId]);

  useEffect(() => {
    if (!highlightPersonId) return;
    const person = dataset.peopleById.get(highlightPersonId);
    if (!person) return;
    const timer = window.setTimeout(() => scrollToAxis((person.span.from + person.span.to) / 2), 80);
    return () => window.clearTimeout(timer);
  }, [highlightPersonId]);

  if (isMobile) {
    return <VerticalTimeline people={people} focusPeriodId={focusPeriodId} className={className} />;
  }

  return (
    <div className={cn('card overflow-hidden', className)}>
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-parchment-200 bg-white/70 px-4 py-2">
        <div className="flex items-center gap-2 text-sm text-ink-600">
          <span className="font-display font-bold text-ink-900">ציר הזמן</span>
          <span className="text-ink-400">· {people.length} דמויות</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setZoom((z) => Math.max(MIN_ZOOM, +(z - 0.4).toFixed(2)))}
            className="btn-ghost px-2 py-1"
            aria-label="הרחקה"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-12 text-center text-xs tabular-nums text-ink-400">×{zoom.toFixed(1)}</span>
          <button
            type="button"
            onClick={() => setZoom((z) => Math.min(MAX_ZOOM, +(z + 0.4).toFixed(2)))}
            className="btn-ghost px-2 py-1"
            aria-label="הגדלה"
          >
            <Plus className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => {
              setZoom(1.6);
              scrollRef.current?.scrollTo({ left: 0, behavior: 'smooth' });
            }}
            className="btn-ghost px-2 py-1"
            aria-label="איפוס"
            title="איפוס תצוגה"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setZoom(MAX_ZOOM)}
            className="btn-ghost px-2 py-1"
            aria-label="זום מרבי"
            title="זום מרבי"
          >
            <Maximize2 className="h-4 w-4" />
          </button>
          {highlightPersonId && (
            <button
              type="button"
              onClick={() => {
                const person = dataset.peopleById.get(highlightPersonId);
                if (person) scrollToAxis((person.span.from + person.span.to) / 2);
              }}
              className="btn-ghost px-2 py-1"
              title="מיקוד בדמות הנבחרת"
              aria-label="מיקוד בדמות הנבחרת"
            >
              <Crosshair className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <div
        ref={scrollRef}
        onPointerDown={(e) => {
          if ((e.target as HTMLElement).closest('button')) return;
          dragState.current = { x: e.clientX, scroll: e.currentTarget.scrollLeft };
          setDragging(true);
        }}
        onPointerMove={(e) => {
          if (!dragState.current) return;
          e.currentTarget.scrollLeft = dragState.current.scroll + (e.clientX - dragState.current.x);
        }}
        onPointerUp={() => {
          dragState.current = null;
          setDragging(false);
        }}
        onPointerLeave={() => {
          dragState.current = null;
          setDragging(false);
        }}
        className={cn('no-scrollbar overflow-x-auto overflow-y-hidden', dragging ? 'cursor-grabbing' : 'cursor-grab')}
      >
        <div className="relative" style={{ width: `${zoom * 100}%`, minWidth: '100%' }}>
          {/* רצועות התקופות */}
          <div className="relative h-9 border-b border-parchment-200 bg-parchment-50/60">
            {dataset.periods.map((period) => (
              <TimelinePeriodBand
                key={period.id}
                period={period}
                active={period.id === focusPeriodId}
                onSelect={onSelectPeriod}
              />
            ))}
          </div>

          {/* הדמויות */}
          <div
            className="relative bg-[linear-gradient(90deg,rgba(207,185,143,.18)_1px,transparent_1px)] bg-[length:5%_100%] px-0 py-3"
            style={{ height: laneCount * LANE_HEIGHT + 24 }}
          >
            {people.map((person) => (
              <TimelinePersonBar
                key={person.id}
                person={person}
                lane={lanes.get(person.id) ?? 0}
                laneHeight={LANE_HEIGHT}
                highlighted={person.id === highlightPersonId}
                dimmed={Boolean(highlightPersonId) && person.id !== highlightPersonId}
                onSelect={(p) => openPerson(p.id)}
              />
            ))}
            {people.length === 0 && (
              <p className="p-8 text-center text-sm text-ink-400">אין דמויות התואמות את הסינון הנוכחי.</p>
            )}
          </div>
        </div>
      </div>

      <p className="border-t border-parchment-200 bg-white/60 px-4 py-2 text-[11px] leading-relaxed text-ink-400">
        הציר סכמטי: הוא מציג סדר וחפיפה בין דמויות, ולא שנים היסטוריות. גררו לצדדים, והשתמשו בזום להתמקדות.
        עובי מלא = תקופה ודאית, פסים = תקופה משוערת, מסגרת מקווקוות = לא ניתן לקבוע.
      </p>
    </div>
  );
}

/** גרסת מובייל — ציר אנכי עם כרטיסים לפי תקופות */
function VerticalTimeline({
  people,
  focusPeriodId,
  className,
}: {
  people: Person[];
  focusPeriodId?: string | null;
  className?: string;
}) {
  const grouped = useMemo(() => {
    return dataset.periods.map((period) => ({
      period,
      members: people
        .filter((p) => p.periodIds.includes(period.id) || (p.span.from <= period.to && period.from <= p.span.to))
        .sort(byTimeline),
    }));
  }, [people]);

  return (
    <div className={cn('space-y-6', className)}>
      {grouped
        .filter((g) => g.members.length > 0)
        .map(({ period, members }) => (
          <section key={period.id} id={`period-${period.id}`} className="relative pr-5">
            <span
              className="absolute right-1.5 top-2 h-full w-0.5 rounded-full"
              style={{ backgroundColor: `${period.color}55` }}
              aria-hidden
            />
            <span
              className="absolute right-0 top-2 h-3.5 w-3.5 rounded-full border-2 border-white shadow"
              style={{ backgroundColor: period.color }}
              aria-hidden
            />
            <header className={cn('mb-3', period.id === focusPeriodId && 'rounded-lg bg-gold-100/60 p-2')}>
              <h3 className="font-display text-lg font-bold text-ink-900">{period.name}</h3>
              <p className="text-xs text-ink-400">{members.length} דמויות</p>
            </header>
            <div className="grid gap-2">
              {members.map((person) => (
                <PersonCard key={person.id} person={person} compact />
              ))}
            </div>
          </section>
        ))}
      {people.length === 0 && (
        <p className="card p-8 text-center text-sm text-ink-400">אין דמויות התואמות את הסינון הנוכחי.</p>
      )}
    </div>
  );
}
