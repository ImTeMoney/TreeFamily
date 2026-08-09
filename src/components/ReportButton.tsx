import { useState } from 'react';
import { MessageSquareWarning } from 'lucide-react';
import type { ReportTargetType } from '../utils/report';
import { ReportDialog } from './ReportDialog';
import { cn } from '../utils/cn';

interface Props {
  targetType: ReportTargetType;
  targetId: string;
  targetName: string;
  /** "icon" — אייקון בלבד לצד כותרת, "button" — כפתור עם טקסט */
  variant?: 'icon' | 'button';
  className?: string;
}

/** כפתור "דיווח על טעות" — פותח טופס שנשלח ברקע */
export function ReportButton({ targetType, targetId, targetName, variant = 'icon', className }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        title={`דיווח על טעות ב${targetName}`}
        aria-label={`דיווח על טעות ב${targetName}`}
        className={cn(
          variant === 'icon'
            ? 'btn-ghost shrink-0 px-2 py-1 text-ink-400 hover:text-ink-800'
            : 'btn-secondary text-sm',
          className,
        )}
      >
        <MessageSquareWarning className="h-4 w-4" aria-hidden />
        {variant === 'button' && 'דיווח על טעות'}
      </button>

      {open && (
        <ReportDialog
          targetType={targetType}
          targetId={targetId}
          targetName={targetName}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
