import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { ChevronsLeft, Crosshair, Maximize2, Minus, Plus, RotateCcw } from 'lucide-react';
import type { Period, Person } from '../types';
import { dataset } from '../data/repository';
import { useAppState } from '../hooks/useAppState';
import { useIsCompact } from '../hooks/useMediaQuery';
import { byTimeline, filterByCorpus, type CorpusFilter } from '../utils/people';
import { timelineGroupOf, timelineGroups, trackLabels, trackOrder } from '../utils/labels';
import { AXIS_MAX, AXIS_MIN, createAxisScale } from '../utils/axis';
import type { AxisScale } from '../utils/axis';
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
  /**
   * חשיפה הדרגתית: הציר נפתח על העידן הראשון בלבד, וכל לחיצה מוסיפה את הבא.
   * במסכי ספר ותקופה, שבהם ממילא מוצגת קבוצה קטנה, המצב כבוי.
   */
  progressive?: boolean;
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
function assignBandLabels(periods: Period[], unitsPerPixel: number, scale: AxisScale): Map<string, number> {
  const slotEnds = [-Infinity, -Infinity];
  const result = new Map<string, number>();

  for (const period of [...periods].sort((a, b) => a.from - b.from)) {
    const startPx = (period.from - scale.min) / unitsPerPixel;
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

export function Timeline({
  people,
  focusPeriodId,
  highlightPersonId,
  progressive = false,
  onSelectPeriod,
  className,
}: Props) {
  const isCompact = useIsCompact();
  const { openPerson, corpus } = useAppState();

  const scrollRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(progressive ? 1 : 1.6);

  /**
   * יחידת החשיפה ההדרגתית היא התקופה ההיסטורית המפורטת — כך המסך הראשון
   * מציג עשרות בודדות של דמויות ברוחב מלא, ולא מאות רצועות זעירות.
   */
  const ages = useMemo(
    () =>
      filterByCorpus(dataset.periods, corpus)
        .filter((period) => period.track === 'era')
        .sort((a, b) => a.from - b.from),
    [corpus],
  );

  const [revealedAges, setRevealedAges] = useState(1);
  const allRevealed = !progressive || revealedAges >= ages.length;
  /** קצה החלון הנראה: סוף העידן האחרון שנפתח */
  const windowMax = allRevealed ? AXIS_MAX : (ages[revealedAges - 1]?.to ?? AXIS_MAX);
  const nextAge = allRevealed ? undefined : ages[revealedAges];

  const scale = useMemo(() => createAxisScale(AXIS_MIN, windowMax), [windowMax]);

  /** רק דמויות שמתחילות בתוך החלון */
  const visiblePeople = useMemo(
    () => (allRevealed ? people : people.filter((p) => p.span.from < windowMax)),
    [people, allRevealed, windowMax],
  );
  const nextAgeCount = nextAge
    ? people.filter((p) => p.span.from >= windowMax && p.span.from < nextAge.to).length
    : 0;

  // כשמגיעים בקישור עמוק לתקופה או לדמות שמחוץ לחלון, נפתחות התקופות עד אליה
  useEffect(() => {
    if (!progressive) return;
    const target = focusPeriodId
      ? dataset.periodById.get(focusPeriodId)?.to
      : highlightPersonId
        ? dataset.peopleById.get(highlightPersonId)?.span.to
        : undefined;
    if (target === undefined) return;
    const needed = ages.findIndex((age) => age.to >= target) + 1;
    if (needed > 0) setRevealedAges((current) => Math.max(current, needed));
  }, [progressive, focusPeriodId, highlightPersonId, ages]);
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
  const unitsPerPixel = (windowMax - AXIS_MIN) / Math.max(viewWidth * zoom, 1);

  /**
   * הדמויות מחולקות לשורות לפי קטגוריה, וכל קטגוריה מסודרת במסלולים בנפרד.
   * כך הציר נראה כטבלה מסודרת ולא כערבוב של מאות רצועות.
   */
  const groupedPeople = useMemo(() => {
    const byGroup = new Map<string, Person[]>();
    for (const person of visiblePeople) {
      const group = timelineGroupOf(person.roles);
      byGroup.set(group.id, [...(byGroup.get(group.id) ?? []), person]);
    }
    return timelineGroups
      .map((group) => {
        const members = byGroup.get(group.id) ?? [];
        const lanes = assignLanes(members, unitsPerPixel);
        return { group, members, lanes, laneCount: Math.max(...[...lanes.values()], 0) + 1 };
      })
      .filter(({ members }) => members.length > 0);
  }, [visiblePeople, unitsPerPixel]);

  /** הרצועות מסוננות לפי הקורפוס הפעיל, ומחולקות לשני מסלולים */
  const trackRows = useMemo(
    () =>
      trackOrder.map((track) => {
        const periods = filterByCorpus(dataset.periods, corpus).filter(
          (period) => period.track === track && period.from < windowMax,
        );
        return { track, periods, labelSlots: assignBandLabels(periods, unitsPerPixel, scale) };
      }),
    [corpus, unitsPerPixel, windowMax, scale],
  );

  /** ממרכז את התצוגה על ערך מסוים בציר (ולא על אחוז) */
  const scrollToAxis = (value: number) => {
    const el = scrollRef.current;
    if (!el) return;
    const inner = el.scrollWidth;
    // בכיוון RTL הגלילה נמדדת כערך שלילי מהקצה הימני
    const targetFromRight = (scale.toPercent(value) / 100) * inner;
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

  if (isCompact) {
    return (
      <VerticalTimeline
        people={visiblePeople}
        focusPeriodId={focusPeriodId}
        corpus={corpus}
        windowMax={windowMax}
        nextAge={nextAge}
        nextAgeCount={nextAgeCount}
        onReveal={() => setRevealedAges((current) => current + 1)}
        onRevealAll={() => setRevealedAges(ages.length)}
        className={className}
      />
    );
  }

  return (
    <div className={cn('card overflow-hidden', className)}>
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-parchment-200 bg-white/70 px-4 py-2">
        <div className="flex items-center gap-2 text-sm text-ink-600">
          <span className="font-display font-bold text-ink-900">ציר הזמן</span>
          <span className="text-ink-400">
            ·{' '}
            {allRevealed ? `${people.length} דמויות` : `${visiblePeople.length} מתוך ${people.length} דמויות`}
          </span>
        </div>
        {progressive && (
          <div className="order-3 flex w-full flex-wrap items-center gap-2 border-t border-parchment-200 pt-2 lg:order-none lg:w-auto lg:border-0 lg:pt-0">
            {nextAge ? (
              <>
                <button
                  type="button"
                  onClick={() => {
                    const target = nextAge.to;
                    setRevealedAges((current) => current + 1);
                    window.setTimeout(() => scrollToAxis(target), 120);
                  }}
                  className="btn-primary text-sm"
                >
                  <ChevronsLeft className="h-4 w-4" aria-hidden />
                  התקופה הבאה: {nextAge.name}
                  <span className="rounded-full bg-parchment-50/20 px-1.5 text-xs">+{nextAgeCount}</span>
                </button>
                <button type="button" onClick={() => setRevealedAges(ages.length)} className="btn-ghost text-xs">
                  הצג את הכול
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setRevealedAges(1);
                  scrollRef.current?.scrollTo({ left: 0, behavior: 'smooth' });
                }}
                className="btn-ghost text-xs"
              >
                <RotateCcw className="h-3.5 w-3.5" aria-hidden />
                להתחיל מחדש מההתחלה
              </button>
            )}
            <span className="text-[11px] text-ink-400">
              תקופה {Math.min(revealedAges, ages.length)}/{ages.length}
            </span>
          </div>
        )}

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
                className={cn(
                  'relative border-b',
                  track === 'age'
                    ? 'h-9 border-parchment-300 bg-white/70'
                    : 'h-12 border-parchment-200 bg-parchment-50/60',
                )}
                title={trackLabels[track]}
              >
                {periods.map((period) => (
                  <TimelinePeriodBand
                    key={period.id}
                    period={period}
                    bandPixels={(Math.min(period.to, windowMax) - period.from) / unitsPerPixel}
                    scale={scale}
                    labelSlot={track === 'age' ? 0 : (labelSlots.get(period.id) ?? 0)}
                    emphasis={track === 'age'}
                    active={period.id === focusPeriodId}
                    onSelect={onSelectPeriod}
                  />
                ))}
              </div>
            ),
          )}

          {/* הדמויות, מסודרות בשורות לפי קטגוריה */}
          {groupedPeople.map(({ group, members, lanes, laneCount }, index) => (
            <section
              key={group.id}
              className={cn(
                'border-b border-parchment-200/70',
                index % 2 === 1 ? 'bg-parchment-100/40' : 'bg-transparent',
              )}
            >
              {/* כותרת השורה — נשארת צמודה לקצה גם בזמן גלילה לצדדים */}
              <div className="h-6">
                <span
                  className="sticky right-0 float-right flex items-center gap-1.5 rounded-bl-lg bg-parchment-50/95 px-2.5 py-0.5 text-[11px] font-bold shadow-sm backdrop-blur-sm"
                  style={{ color: group.color }}
                >
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: group.color }} aria-hidden />
                  {group.label}
                  <span className="font-normal text-ink-400">{members.length}</span>
                </span>
              </div>

              <div className="relative" style={{ height: laneCount * LANE_HEIGHT + 8 }}>
                {members.map((person) => (
                  <TimelinePersonBar
                    key={person.id}
                    person={person}
                    lane={lanes.get(person.id) ?? 0}
                    laneHeight={LANE_HEIGHT}
                    barPixels={Math.max(Math.min(person.span.to, windowMax) - person.span.from, 0.8) / unitsPerPixel}
                    scale={scale}
                    highlighted={person.id === highlightPersonId}
                    dimmed={Boolean(highlightPersonId) && person.id !== highlightPersonId}
                    onSelect={(p) => openPerson(p.id)}
                  />
                ))}
              </div>
            </section>
          ))}
          {visiblePeople.length === 0 && (
            <p className="p-8 text-center text-sm text-ink-400">אין דמויות התואמות את הסינון הנוכחי.</p>
          )}
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
  windowMax,
  nextAge,
  nextAgeCount,
  onReveal,
  onRevealAll,
  className,
}: {
  people: Person[];
  focusPeriodId?: string | null;
  corpus: CorpusFilter;
  windowMax: number;
  nextAge?: Period;
  nextAgeCount: number;
  onReveal: () => void;
  onRevealAll: () => void;
  className?: string;
}) {
  const grouped = useMemo(() => {
    return filterByCorpus(dataset.periods, corpus)
      .filter((period) => period.track === 'era' && period.from < windowMax)
      .map((period) => ({
        period,
        members: people
          .filter((p) => p.periodIds.includes(period.id) || (p.span.from <= period.to && period.from <= p.span.to))
          .sort(byTimeline),
      }));
  }, [people, corpus, windowMax]);

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

      {nextAge && (
        <div className="card space-y-2 p-4 text-center">
          <p className="text-sm text-ink-600">עד כאן התקופה הזו. אפשר להמשיך הלאה בציר.</p>
          <button type="button" onClick={onReveal} className="btn-primary w-full">
            לפתוח את התקופה הבאה: {nextAge.name}
            <span className="rounded-full bg-parchment-50/20 px-2 text-xs">+{nextAgeCount}</span>
          </button>
          <button type="button" onClick={onRevealAll} className="btn-ghost text-xs">
            הצג את הכול
          </button>
        </div>
      )}
    </div>
  );
}
