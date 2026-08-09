import type { Certainty, Corpus, SourceRef } from './common';

export interface Period {
  id: string;
  name: string;
  corpus: Corpus;
  /** תיאור קצר בעברית */
  description: string;
  /** סדר כרונולוגי (1 = מוקדם ביותר) */
  order: number;
  /** תחילת התקופה על הסרגל הסכמטי (0–100) */
  from: number;
  /** סוף התקופה על הסרגל הסכמטי (0–100) */
  to: number;
  certainty: Certainty;
  /** צבע מזהה (מחלקת Tailwind או ערך HEX) */
  color: string;
  sources: SourceRef[];
}
