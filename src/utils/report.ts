/**
 * שליחת הערות מהמשתמשים.
 *
 * ההערה נשלחת ברקע ל-Web3Forms, שמעביר אותה בדואר אלקטרוני. המשתמש נשאר באתר
 * ואינו עובר לשום מקום אחר. אם מפתח הגישה אינו מוגדר, נפתחת תוכנת המייל כגיבוי,
 * כדי שהיכולת לא תישבר לפני שההגדרה הושלמה.
 *
 * החלפת הערוץ (למשל לפונקציית שרת משלנו) היא שינוי במודול הזה בלבד.
 */

export const REPORT_EMAIL = 'temoneydev@gmail.com';

const ACCESS_KEY = import.meta.env.VITE_WEB3FORMS_KEY as string | undefined;
const ENDPOINT = 'https://api.web3forms.com/submit';

export type ReportTargetType = 'person' | 'period' | 'event' | 'family' | 'book';

export const reportTargetLabels: Record<ReportTargetType, string> = {
  person: 'דמות',
  period: 'תקופה',
  event: 'אירוע',
  family: 'משפחה',
  book: 'ספר',
};

/** סוגי הבעיות שהמשתמש יכול לדווח עליהן */
export const reportKinds = [
  { id: 'name', label: 'שם או כתיב' },
  { id: 'source', label: 'מקור או הפניה' },
  { id: 'period', label: 'תקופה או תאריך' },
  { id: 'relation', label: 'קשר משפחתי או קשר לימוד' },
  { id: 'missing', label: 'חסר מידע' },
  { id: 'other', label: 'אחר' },
] as const;

export type ReportKind = (typeof reportKinds)[number]['id'];

export interface Report {
  targetType: ReportTargetType;
  /** המזהה הפנימי, כדי שאפשר יהיה לאתר את הרשומה מיד בקבצי הדאטה */
  targetId: string;
  targetName: string;
  kind: ReportKind;
  message: string;
  /** מקור או הפניה שהמשתמש מציע */
  source?: string;
  /** כתובת לחזרה, אם המשתמש רוצה מענה */
  replyTo?: string;
}

export type ReportResult = 'sent' | 'fallback';

function kindLabel(kind: ReportKind): string {
  return reportKinds.find((k) => k.id === kind)?.label ?? kind;
}

function buildSubject(report: Report): string {
  return `הערה על ${reportTargetLabels[report.targetType]}: ${report.targetName}`;
}

function buildBody(report: Report): string {
  return [
    `סוג הבעיה: ${kindLabel(report.kind)}`,
    `${reportTargetLabels[report.targetType]}: ${report.targetName}`,
    `מזהה במאגר: ${report.targetId}`,
    '',
    'תיאור:',
    report.message,
    '',
    report.source ? `מקור שהוצע: ${report.source}` : 'לא צוין מקור.',
    report.replyTo ? `כתובת לחזרה: ${report.replyTo}` : 'לא נמסרה כתובת לחזרה.',
    '',
    `נשלח מהעמוד: ${typeof window === 'undefined' ? '' : window.location.href}`,
  ].join('\n');
}

/** האם ערוץ השליחה השקט מוגדר */
export function isReportConfigured(): boolean {
  return Boolean(ACCESS_KEY);
}

export async function submitReport(report: Report): Promise<ReportResult> {
  if (!ACCESS_KEY) {
    const href = `mailto:${REPORT_EMAIL}?subject=${encodeURIComponent(buildSubject(report))}&body=${encodeURIComponent(
      buildBody(report),
    )}`;
    window.open(href, '_blank', 'noopener');
    return 'fallback';
  }

  const response = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      access_key: ACCESS_KEY,
      subject: buildSubject(report),
      from_name: 'מפת המקורות',
      replyto: report.replyTo || undefined,
      message: buildBody(report),
      // שדות מפורטים, לנוחות הקריאה בתיבת הדואר
      target_type: reportTargetLabels[report.targetType],
      target_name: report.targetName,
      target_id: report.targetId,
      kind: kindLabel(report.kind),
      source: report.source || '',
      page: typeof window === 'undefined' ? '' : window.location.href,
    }),
  });

  if (!response.ok) {
    throw new Error(`שליחת ההערה נכשלה (${response.status})`);
  }

  const data = (await response.json()) as { success?: boolean; message?: string };
  if (!data.success) {
    throw new Error(data.message ?? 'שליחת ההערה נכשלה');
  }

  return 'sent';
}
