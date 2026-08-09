import type { Period } from '../types';
import { lengthToPercent, toPercent } from '../utils/axis';
import { cn } from '../utils/cn';

interface Props {
  period: Period;
  active?: boolean;
  onSelect?: (period: Period) => void;
}

/** רצועת תקופה ברקע ציר הזמן */
export function TimelinePeriodBand({ period, active, onSelect }: Props) {
  return (
    <button
      type="button"
      onClick={() => onSelect?.(period)}
      style={{ right: `${toPercent(period.from)}%`, width: `${lengthToPercent(period.to - period.from)}%` }}
      className={cn(
        'group absolute top-0 h-full overflow-hidden border-r border-parchment-200/80 transition-colors',
        active ? 'bg-gold-100/60' : 'hover:bg-parchment-100/70',
      )}
    >
      <span
        className={cn(
          'absolute right-2 top-2 max-w-[calc(100%-1rem)] truncate rounded-full px-2 py-0.5 text-[11px] font-semibold transition-colors',
          active ? 'bg-ink-800 text-parchment-50' : 'bg-white/80 text-ink-600 group-hover:bg-white',
        )}
        style={active ? undefined : { color: period.color }}
      >
        {period.name}
      </span>
    </button>
  );
}
