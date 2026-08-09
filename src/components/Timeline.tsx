import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Crosshair, Maximize2, Minus, Plus, RotateCcw } from 'lucide-react';
import type { Period, PeriodTrack, Person } from '../types';
import { dataset } from '../data/repository';
import { useAppState } from '../hooks/useAppState';
import { useIsMobile } from '../hooks/useMediaQuery';
import { byTimeline, filterByCorpus, type CorpusFilter } from '../utils/people';
import { AXIS_MAX, AXIS_MIN, toPercent } from '../utils/axis';
import { cn } from '../utils/cn';
import { TimelinePeriodBand } from './TimelinePeriod';
import { labelPixels, TimelinePersonBar } from './TimelinePerson';
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

/**
 * מסדר את הדמויות במסלולים כך ששני Bars לא ייחפפו באותה שורה.
 * הרווח הנדרש אחרי כל רצועה מחושב לפי רוחב השם בפיקסלים, כדי שיהיה מקום
 * לכיתוב שיוצא אל מחוץ לרצועה — ולכן ככל שמתקרבים בזום נדרשים פחות מסלולים.
 */
function assignLanes(people: Person[], unitsPerPixel: number): Map<string, number> {
  const lanes: number[] = [];
  const result = new Map<string, number>();
  for (const person of [...people].sort(byTimeline)) {
    const start = person.span.from;
    const end = Math.max(person.span.to, start + 0.8);
    const barPixels = (end - start) / unitsPerPixel;
    /** השטח שהרצועה תופסת בפועל — כולל השם שגולש אחריה, ורווח נשימה קבוע */
    const trailingPixels = (barPixels >= labelPixels(person.name) ? 0 : labelPixels(person.name)) + 10;
    const occupiedUntil = end + trailingPixels * unitsPerPixel;

    let lane = lanes.findIndex((laneEnd) => start > laneEnd);
    if (lane === -1) {
      lane = lanes.length;
      lanes.push(occupiedUntil);
    } else {
      lanes[lane] = occupiedUntil;
    }
    result.set(person.id, lane);
  }
  return result;
}

/**
 * מסדר את שמות התקופות בשתי שורות כך שלא יתנגשו זה בזה.
 * מחזיר 0 לשורה העליונה, 1 לתחתונה, ו-(-1) כשאין מקום — ואז השם מוצג רק בריחוף.
 */
function assignBandLabels(periods: Period[], unitsPerPixel: number): Map<string, number> {
  const slotEnds = [-Infinity, -Infinity];
  const result = new Map<string, number>();

  for (const period of [...periods].sort((a, b) => a.from - b.from)) {
    const startPx = period.from / unitsPerPixel;
    const labelPx = period.name.length * 6.5 + 26;
    const slot = slotEnds.findIndex((end) => startPx > end);
    if (slot === -1) {
      result.set(period.id, -1);
    } else {
      slotEnds[slot] = startPx + labelPx;
      result.set(period.id, slot);
    }
  }
  return result;
}

const trackLabels: Record<PeriodTrack, string> = {
  era: 'תקופה היסטורית',
  chain: 'שלב במסירת התורה',
};

export function Timeline({ people, focusPeriodId, highlightPersonId, onSelectPeriod, className }: Props) {
  const isMobile = useIsMobile();
  const { openPerson, corpus } = useAppState();

  const scrollRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1.6);
  const dragState = useRef<{ x: number; scroll: number } | null>(null);
  const [dragging, setDragging] = useState(false);

  /** רוחב התצוגה בפועל, כדי לחשב את סידור המסלולים ביחידות אמיתיות של פיקסלים */
  const [viewWidth, setViewWidth] = useState(1200);

  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const measure = () => setViewWidth(el.clientWidth || 1200);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  /** כמה יחידות ציר שוות לפיקסל אחד בזום הנוכחי */
  const unitsPerPixel = (AXIS_MAX - AXIS_MIN) / Math.max(viewWidth * zoom, 1);
  const lanes = useMemo(() => assignLanes(people, unitsPerPixel), [people, unitsPerPixel]);

  /** הרצועות מסוננות לפי הקורפוס הפעיל, ומחולקות לשני מסלולים */
  const trackRows = useMemo(
    () =>
      (['era', 'chain'] as PeriodTrack[]).map((track) => {
        const periods = filterByCorpus(dataset.periods, corpus).filter((period) => period.track === track);
        return { track, periods, labelSlots: assignBandLabels(periods, unitsPerPixel) };
      }),
    [corpus, unitsPerPixel],
  );
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
    return (
      <VerticalTimeline people={people} focusPeriodId={focusPeriodId} corpus={corpus} className={className} />
    );
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
          {/* שתי שורות רצועות: תקופה היסטורית, ומתחתיה שלב במסירת התורה */}
          {trackRows.map(({ track, periods, labelSlots }) =>
            periods.length === 0 ? null : (
              <div
                key={track}
                className="relative h-12 border-b border-parchment-200 bg-parchment-50/60"
                title={trackLabels[track]}
              >
                {periods.map((period) => (
                  <TimelinePeriodBand
                    key={period.id}
                    period={period}
                    bandPixels={(period.to - period.from) / unitsPerPixel}
                    labelSlot={labelSlots.get(period.id) ?? 0}
                    active={period.id === focusPeriodId}
                    onSelect={onSelectPeriod}
                  />
                ))}
              </div>
            ),
          )}

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
                barPixels={Math.max(person.span.to - person.span.from, 0.8) / unitsPerPixel}
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
        שתי שורות הרצועות מקבילות: העליונה היא התקופה ההיסטורית, והתחתונה היא השלב במסירת התורה — לכן
        הלל מופיע גם תחת "ימי הורדוס" וגם תחת "הזוגות".
        הציר סכמטי: הוא מציג סדר וחפיפה בין דמויות, ולא שנים היסטוריות. גררו לצדדים, והשתמשו בזום להתמקדות.
        עובי מלא = תקופה ודאית, פסים = תקופה משוערת, מסגרת מקווקוות = לא ניתן לקבוע.
      </p>
    </div>
  );
}

/**
 * גרסת מובייל — ציר אנכי עם כרטיסים לפי תקופות.
 * הקיבוץ הוא לפי המסלול ההיסטורי בלבד, כדי שדמות לא תופיע פעמיים
 * (פעם תחת "ימי הורדוס" ופעם תחת "הזוגות").
 */
function VerticalTimeline({
  people,
  focusPeriodId,
  corpus,
  className,
}: {
  people: Person[];
  focusPeriodId?: string | null;
  corpus: CorpusFilter;
  className?: string;
}) {
  const grouped = useMemo(() => {
    return filterByCorpus(dataset.periods, corpus)
      .filter((period) => period.track === 'era')
      .map((period) => ({
        period,
        members: people
          .filter((p) => p.periodIds.includes(period.id) || (p.span.from <= period.to && period.from <= p.span.to))
          .sort(byTimeline),
      }));
  }, [people, corpus]);

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
