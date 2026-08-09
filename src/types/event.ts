import type { Certainty, SourceRef } from './common';

export interface BibleEvent {
  id: string;
  name: string;
  /** מה קרה — בעברית, על פי הכתוב בלבד */
  description: string;
  periodId: string;
  /** נקודה על הסרגל הסכמטי (0–100) */
  at: number;
  /** משך סכמטי, לאירועים שנמשכו זמן רב (אופציונלי) */
  until?: number;
  certainty: Certainty;
  /** דמויות מרכזיות המעורבות באירוע */
  personIds: string[];
  bookIds: string[];
  sources: SourceRef[];
}
