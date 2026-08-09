import { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { CheckCircle2, Loader2, Send, X } from 'lucide-react';
import {
  isReportConfigured,
  REPORT_EMAIL,
  reportKinds,
  reportTargetLabels,
  submitReport,
  type ReportKind,
  type ReportTargetType,
} from '../utils/report';
import { cn } from '../utils/cn';

interface Props {
  targetType: ReportTargetType;
  targetId: string;
  targetName: string;
  onClose: () => void;
}

/** טופס דיווח על טעות — נשלח ברקע, בלי לצאת מהאתר */
export function ReportDialog({ targetType, targetId, targetName, onClose }: Props) {
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const [kind, setKind] = useState<ReportKind>('name');
  const [message, setMessage] = useState('');
  const [source, setSource] = useState('');
  const [replyTo, setReplyTo] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');
  const [error, setError] = useState('');

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    dialogRef.current?.querySelector<HTMLElement>('textarea')?.focus();
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    if (honeypot) return; // מלכודת לבוטים
    if (message.trim().length < 3) {
      setError('נא לכתוב מה בדיוק לא תקין.');
      setStatus('error');
      return;
    }

    setStatus('sending');
    setError('');
    try {
      await submitReport({ targetType, targetId, targetName, kind, message: message.trim(), source, replyTo });
      setStatus('done');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'שליחת ההערה נכשלה. אפשר לנסות שוב.');
      setStatus('error');
    }
  };

  /**
   * הטופס נשלח ל-body דרך Portal: הוא נפתח גם מתוך כרטיס הדמות, ולכרטיס יש
   * אנימציית transform שהופכת אותו ל-containing block ומזיזה כל מיקום fixed שבתוכו.
   */
  return createPortal(
    <>
      <div className="fixed inset-0 z-[60] bg-ink-900/35 backdrop-blur-[2px] animate-fade-in" onClick={onClose} aria-hidden />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={cn(
          'fixed inset-x-0 bottom-0 z-[61] max-h-[92vh] overflow-y-auto rounded-t-3xl bg-parchment-50 p-5 shadow-pop animate-slide-up',
          'pb-[calc(1.25rem+env(safe-area-inset-bottom))]',
          'sm:inset-0 sm:m-auto sm:h-fit sm:max-w-lg sm:rounded-3xl sm:pb-5',
        )}
      >
        <header className="mb-4 flex items-start gap-2">
          <div className="min-w-0 flex-1">
            <h2 id={titleId} className="font-display text-xl font-bold text-ink-900">
              דיווח על טעות
            </h2>
            <p className="mt-0.5 truncate text-sm text-ink-600">
              {reportTargetLabels[targetType]}: {targetName}
            </p>
          </div>
          <button type="button" onClick={onClose} className="btn-ghost px-2 py-1" aria-label="סגירה">
            <X className="h-4 w-4" />
          </button>
        </header>

        {status === 'done' ? (
          <div className="py-6 text-center">
            <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-600" aria-hidden />
            <p className="mt-3 font-display text-lg font-bold text-ink-900">תודה, ההערה נשלחה</p>
            <p className="mt-1 text-sm text-ink-600">
              {isReportConfigured()
                ? 'נעבור עליה ונתקן את המאגר במידת הצורך.'
                : `אם תוכנת הדואר לא נפתחה, אפשר לכתוב ישירות אל ${REPORT_EMAIL}.`}
            </p>
            <button type="button" onClick={onClose} className="btn-primary mt-5 w-full sm:w-auto sm:px-8">
              סגירה
            </button>
          </div>
        ) : (
          <form onSubmit={send} className="space-y-4">
            <fieldset>
              <legend className="mb-1.5 text-xs font-bold uppercase tracking-wide text-ink-400">מה לא תקין?</legend>
              <div className="flex flex-wrap gap-1.5">
                {reportKinds.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setKind(option.id)}
                    className={cn('chip', kind === option.id && 'chip-active')}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </fieldset>

            <label className="block">
              <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-ink-400">
                מה צריך לתקן? <span className="text-rose-600">*</span>
              </span>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                aria-required="true"
                placeholder="למשל: השם צריך להיות כתוב אחרת, או שהמקור המצוין אינו מדויק."
                className="w-full rounded-xl border border-parchment-300 bg-white/90 px-3 py-2 text-sm leading-relaxed text-ink-900 placeholder:text-ink-400 focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/20"
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-ink-400">
                מקור או הפניה (לא חובה)
              </span>
              <input
                type="text"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                placeholder="למשל: שמואל ב׳ ט״ו, י״ב"
                className="w-full rounded-xl border border-parchment-300 bg-white/90 px-3 py-2 text-sm text-ink-900 placeholder:text-ink-400 focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/20"
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-ink-400">
                המייל שלך (לא חובה)
              </span>
              <input
                type="email"
                value={replyTo}
                onChange={(e) => setReplyTo(e.target.value)}
                placeholder="כדי שנוכל לחזור אליך"
                className="w-full rounded-xl border border-parchment-300 bg-white/90 px-3 py-2 text-sm text-ink-900 placeholder:text-ink-400 focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/20"
              />
            </label>

            {/* מלכודת לבוטים — נסתרת ממשתמשים */}
            <input
              type="text"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              className="pointer-events-none absolute h-0 w-0 opacity-0"
            />

            {status === 'error' && (
              <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800">
                {error}
              </p>
            )}

            <button type="submit" disabled={status === 'sending'} className="btn-primary w-full">
              {status === 'sending' ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                  שולח...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" aria-hidden />
                  שליחת ההערה
                </>
              )}
            </button>
            <p className="text-center text-[11px] leading-relaxed text-ink-400">
              ההערה נשלחת לצוות המאגר יחד עם שם הפריט והמזהה שלו. לא נשמר מידע נוסף עליך.
            </p>
          </form>
        )}
      </div>
    </>,
    document.body,
  );
}
