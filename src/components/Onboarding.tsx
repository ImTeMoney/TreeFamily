import { useState } from 'react';
import { ArrowLeft, ArrowRight, Hourglass, Users, X } from 'lucide-react';
import { CertaintyBadge } from './CertaintyBadge';
import { cn } from '../utils/cn';

const steps = [
  {
    icon: Hourglass,
    title: 'ציר זמן אחד לכל המקורות',
    body: 'מאדם הראשון ועד חתימת התלמוד. כל רצועה על הציר היא אדם, ואורכה מייצג את התקופה שבה חי. הציר סכמטי — הוא מראה סדר וחפיפה, ולא שנים היסטוריות.',
  },
  {
    icon: Users,
    title: 'מי חי בתקופה של מי',
    body: 'כששתי רצועות חופפות, השניים חיו באותו זמן. לחיצה על כל דמות פותחת כרטיס, ובו כפתור "מי חי בתקופתו?" עם רשימה מסוננת לפי מלכים, נביאים, כהנים, נשים ועוד.',
  },
  {
    icon: null,
    title: 'לא ממציאים תאריכים',
    body: 'למקורות אין ציר תאריכים אחיד, ולכן לכל דמות מצוינת מידת הוודאות של מיקומה בזמן. הצבע על הציר מספר את זה מיד.',
    legend: true,
  },
] as const;

interface Props {
  onClose: () => void;
}

/** מסך פתיחה קצר — מוצג בכניסה הראשונה, וניתן לפתיחה חוזרת מכפתור העזרה */
export function Onboarding({ onClose }: Props) {
  const [step, setStep] = useState(0);
  const current = steps[step];
  const Icon = current.icon;
  const isLast = step === steps.length - 1;

  return (
    <>
      <div className="fixed inset-0 z-[70] bg-ink-900/45 backdrop-blur-sm animate-fade-in" aria-hidden />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="הסבר קצר"
        className="fixed inset-x-0 bottom-0 z-[71] rounded-t-3xl bg-parchment-50 p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] shadow-pop animate-slide-up sm:inset-0 sm:m-auto sm:h-fit sm:max-w-md sm:rounded-3xl sm:pb-6"
      >
        <button
          type="button"
          onClick={onClose}
          className="btn-ghost absolute left-3 top-3 px-2 py-1"
          aria-label="דילוג על ההסבר"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="text-center">
          {Icon && (
            <span className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-ink-800 text-parchment-50">
              <Icon className="h-6 w-6" aria-hidden />
            </span>
          )}
          <h2 className="font-display text-2xl font-bold text-ink-900">{current.title}</h2>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-ink-600">{current.body}</p>

          {'legend' in current && current.legend && (
            <div className="mt-4 flex flex-wrap justify-center gap-1.5">
              <CertaintyBadge certainty="certain" />
              <CertaintyBadge certainty="estimated" />
              <CertaintyBadge certainty="unknown" />
            </div>
          )}
        </div>

        <div className="mt-7 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setStep((s) => s - 1)}
            disabled={step === 0}
            className="btn-ghost text-sm"
          >
            <ArrowRight className="h-4 w-4" />
            הקודם
          </button>

          <div className="flex gap-1.5" aria-hidden>
            {steps.map((_, index) => (
              <span
                key={index}
                className={cn('h-1.5 rounded-full transition-all', index === step ? 'w-5 bg-ink-800' : 'w-1.5 bg-parchment-300')}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => (isLast ? onClose() : setStep((s) => s + 1))}
            className="btn-primary text-sm"
          >
            {isLast ? 'מתחילים' : 'הבא'}
            {!isLast && <ArrowLeft className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </>
  );
}
