import { useState } from 'react';
import type { Person } from '../types';
import { dataset } from '../data/repository';
import { certaintyLabels, roleEmoji, roleLabels } from '../utils/labels';
import { displayName } from '../utils/people';
import { lengthToPercent, toPercent } from '../utils/axis';
import { cn } from '../utils/cn';

interface Props {
  person: Person;
  lane: number;
  laneHeight: number;
  /** רוחב הרצועה בפיקסלים בזום הנוכחי — קובע אם השם נכנס בתוכה */
  barPixels: number;
  highlighted?: boolean;
  dimmed?: boolean;
  onSelect: (person: Person) => void;
}

/** אומדן הרוחב שהשם צורך: אות ≈ 7px, ועוד אימוג׳י וריווח פנימי */
export function labelPixels(name: string): number {
  return name.length * 7 + 30;
}

const certaintyBarStyles: Record<Person['certainty'], string> = {
  certain: 'bg-ink-800 text-parchment-50',
  estimated: 'bg-gold-500/85 text-ink-900 [background-image:repeating-linear-gradient(45deg,transparent,transparent_5px,rgba(255,255,255,.28)_5px,rgba(255,255,255,.28)_10px)]',
  unknown: 'bg-rose-300/80 text-ink-900 border border-dashed border-rose-500',
};

/** Bar של דמות על ציר הזמן, עם Tooltip בריחוף */
export function TimelinePersonBar({ person, lane, laneHeight, barPixels, highlighted, dimmed, onSelect }: Props) {
  const [hovered, setHovered] = useState(false);
  const width = lengthToPercent(Math.max(person.span.to - person.span.from, 0.8));
  /**
   * כשהרצועה צרה מכדי להכיל את השם, השם יוצא אל מחוץ לרצועה במקום להיחתך.
   * כך רוחב הרצועה נשאר נאמן לטווח האמיתי, והכיתוב תמיד קריא במלואו.
   */
  const labelInside = barPixels >= labelPixels(person.name);
  const period = person.periodIds[0] ? dataset.periodById.get(person.periodIds[0]) : undefined;
  const family = person.relations.find((r) => r.kind === 'father' || r.kind === 'mother');
  const familyPerson = family ? dataset.peopleById.get(family.personId) : undefined;

  return (
    <div
      className="absolute"
      style={{ right: `${toPercent(person.span.from)}%`, width: `${width}%`, top: lane * laneHeight }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <button
        type="button"
        onClick={() => onSelect(person)}
        title={`${displayName(person)} — ${period?.name ?? ''}`}
        className={cn(
          'flex h-6 w-full items-center gap-1 rounded-full px-1.5 text-[11px] font-medium shadow-sm transition-all duration-200',
          certaintyBarStyles[person.certainty],
          'hover:shadow-pop focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-500',
          labelInside ? 'overflow-hidden px-2' : 'justify-center',
          highlighted && 'ring-2 ring-gold-500 ring-offset-1',
          dimmed && 'opacity-50 saturate-50',
        )}
      >
        <span aria-hidden className="shrink-0 text-[10px]">
          {roleEmoji[person.roles[0] ?? 'other']}
        </span>
        {labelInside && <span className="whitespace-nowrap">{person.name}</span>}

        {/* השם נכתב במלואו לצד הרצועה כשאין בה מקום */}
        {!labelInside && (
          <span
            className={cn(
              'absolute right-full top-0 z-10 mr-1 flex h-6 items-center whitespace-nowrap rounded px-1',
              'bg-parchment-50/85 text-[11px] font-medium text-ink-800',
              hovered && 'bg-white text-ink-900 shadow-sm',
            )}
          >
            {person.name}
          </span>
        )}
      </button>

      {hovered && (
        <div className="pointer-events-none absolute right-0 top-7 z-30 w-60 animate-fade-in rounded-xl border border-parchment-300 bg-white p-3 text-right shadow-pop">
          <p className="font-display text-sm font-bold text-ink-900">{displayName(person)}</p>
          {person.disambiguation && <p className="mt-0.5 text-[11px] text-gold-600">{person.disambiguation}</p>}
          <dl className="mt-2 space-y-1 text-xs text-ink-600">
            <div className="flex gap-1">
              <dt className="font-semibold text-ink-700">תפקיד:</dt>
              <dd className="truncate">{person.titles[0] ?? person.roles.map((r) => roleLabels[r]).join(', ')}</dd>
            </div>
            <div className="flex gap-1">
              <dt className="font-semibold text-ink-700">משפחה:</dt>
              <dd className="truncate">
                {familyPerson ? `${family?.kind === 'mother' ? 'אם' : 'אב'}: ${familyPerson.name}` : person.tribe ? `שבט ${person.tribe}` : 'לא צוין'}
              </dd>
            </div>
            <div className="flex gap-1">
              <dt className="font-semibold text-ink-700">תקופה:</dt>
              <dd className="truncate">{person.span.label ?? period?.name ?? 'לא ידועה'} ({certaintyLabels[person.certainty]})</dd>
            </div>
            <div className="flex gap-1">
              <dt className="font-semibold text-ink-700">מקור:</dt>
              <dd className="truncate">
                {person.sources[0]
                  ? `${dataset.bookById.get(person.sources[0].bookId)?.name ?? ''} ${person.sources[0].ref}`
                  : 'לא צוין'}
              </dd>
            </div>
          </dl>
          <p className="mt-2 text-[11px] text-ink-400">לחצו לפתיחת כרטיס הדמות</p>
        </div>
      )}
    </div>
  );
}
