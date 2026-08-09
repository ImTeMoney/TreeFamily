import type { Period } from '../types';
import { lengthToPercent, toPercent } from '../utils/axis';
import { cn } from '../utils/cn';

interface Props {
  period: Period;
  /** רוחב הרצועה בפיקסלים בזום הנוכחי */
  bandPixels: number;
  /** שורת הכיתוב: 0 עליונה, 1 תחתונה, (-1) אין מקום — השם יוצג בריחוף בלבד */
  labelSlot: number;
  active?: boolean;
  onSelect?: (period: Period) => void;
}

/** אומדן הרוחב שדרוש לשם התקופה */
function periodLabelPixels(name: string): number {
  return name.length * 6.5 + 22;
}

/** רצועת תקופה ברקע ציר הזמן */
export function TimelinePeriodBand({ period, bandPixels, labelSlot, active, onSelect }: Props) {
  /** כשהרצועה צרה מדי, השם נכתב במלואו וגולש החוצה במקום להיחתך */
  const labelInside = bandPixels >= periodLabelPixels(period.name);
  const hiddenLabel = labelSlot < 0;

  return (
    <button
      type="button"
      onClick={() => onSelect?.(period)}
      title={period.name}
      style={{ right: `${toPercent(period.from)}%`, width: `${lengthToPercent(period.to - period.from)}%` }}
      className={cn(
        'group absolute top-0 h-full border-r border-parchment-200/80 transition-colors',
        labelInside && 'overflow-hidden',
        active ? 'bg-gold-100/60' : 'hover:bg-parchment-100/70',
      )}
    >
      <span
        className={cn(
          'absolute whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-semibold transition-all',
          labelSlot === 1 ? 'bottom-1.5' : 'top-1.5',
          labelInside ? 'right-2' : 'right-1 z-10 group-hover:z-30',
          hiddenLabel && 'z-30 opacity-0 group-hover:opacity-100',
          active ? 'bg-ink-800 text-parchment-50' : 'bg-white/90 text-ink-600 group-hover:bg-white group-hover:shadow-sm',
        )}
        style={active ? undefined : { color: period.color }}
      >
        {period.name}
      </span>

      {/* כשאין מקום לשם, סימן קצר מציין שיש כאן תקופה — והשם מופיע בריחוף */}
      {hiddenLabel && (
        <span
          aria-hidden
          className="absolute right-1 top-2 h-2 w-2 rounded-full group-hover:opacity-0"
          style={{ backgroundColor: period.color }}
        />
      )}
    </button>
  );
}
