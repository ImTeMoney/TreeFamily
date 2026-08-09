import type { Certainty } from '../types';
import { certaintyClasses, certaintyDots, certaintyExplain, certaintyLabels } from '../utils/labels';
import { cn } from '../utils/cn';

interface Props {
  certainty: Certainty;
  className?: string;
  withExplain?: boolean;
}

export function CertaintyBadge({ certainty, className, withExplain }: Props) {
  return (
    <span
      title={certaintyExplain[certainty]}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium',
        certaintyClasses[certainty],
        className,
      )}
    >
      <span aria-hidden>{certaintyDots[certainty]}</span>
      {certaintyLabels[certainty]}
      {withExplain && <span className="hidden font-normal opacity-80 sm:inline">— {certaintyExplain[certainty]}</span>}
    </span>
  );
}
