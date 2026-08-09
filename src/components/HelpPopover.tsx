import { useEffect, useRef, useState } from 'react';
import { HelpCircle, X } from 'lucide-react';
import { CertaintyBadge } from './CertaintyBadge';
import { cn } from '../utils/cn';

interface Props {
  /** נפתח מבחוץ (למשל מכפתור "איך קוראים את הציר") */
  onOpenTour?: () => void;
  className?: string;
}

/** מקרא והסבר לציר הזמן — בכפתור, במקום להעמיס את ראש המסך */
export function HelpPopover({ onOpenTour, className }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className={cn('relative', className)}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="btn-secondary text-sm"
      >
        <HelpCircle className="h-4 w-4" aria-hidden />
        איך קוראים את זה?
      </button>

      {open && (
        <div className="absolute left-0 top-full z-40 mt-2 w-[min(22rem,calc(100vw-2rem))] rounded-2xl border border-parchment-200 bg-white p-4 text-right shadow-pop animate-fade-in">
          <div className="mb-3 flex items-start justify-between gap-2">
            <h2 className="font-display text-base font-bold text-ink-900">מקרא</h2>
            <button type="button" onClick={() => setOpen(false)} className="btn-ghost px-1.5 py-0.5" aria-label="סגירה">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          <dl className="space-y-3 text-sm leading-relaxed text-ink-600">
            <div>
              <dt className="font-semibold text-ink-800">כל רצועה היא אדם</dt>
              <dd>אורך הרצועה מייצג את התקופה שבה חי. חפיפה בין שתי רצועות = שני אנשים שחיו יחד.</dd>
            </div>
            <div>
              <dt className="font-semibold text-ink-800">שתי שורות התקופות למעלה</dt>
              <dd>
                העליונה — התקופה ההיסטורית (מי שלט ומה קרה). התחתונה — השלב במסירת התורה (מי מסר למי).
                לכן הלל מופיע גם תחת "ימי הורדוס" וגם תחת "הזוגות".
              </dd>
            </div>
            <div>
              <dt className="mb-1.5 font-semibold text-ink-800">צבע הרצועה = מידת הוודאות</dt>
              <dd className="flex flex-wrap gap-1.5">
                <CertaintyBadge certainty="certain" />
                <CertaintyBadge certainty="estimated" />
                <CertaintyBadge certainty="unknown" />
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-ink-800">אין כאן תאריכים</dt>
              <dd>הציר סכמטי: הוא מציג סדר וחפיפה בלבד, ולא שנים היסטוריות.</dd>
            </div>
          </dl>

          {onOpenTour && (
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                onOpenTour();
              }}
              className="btn-secondary mt-4 w-full text-sm"
            >
              להסבר המלא מהתחלה
            </button>
          )}
        </div>
      )}
    </div>
  );
}
