import type { Certainty, Corpus, SourceRef } from './common';

/**
 * שני מסלולים מקבילים של תקופות:
 * "era"   — תקופה היסטורית (בית ראשון, גלות בבל, ימי הורדוס)
 * "chain" — שלב במסירת התורה (הזוגות, תנאים, אמוראים)
 *
 * אדם אחד שייך בו־זמנית לשניהם: הלל חי בימי הורדוס והוא מן הזוגות.
 */
export type PeriodTrack = 'era' | 'chain';

export interface Period {
  id: string;
  name: string;
  corpus: Corpus;
  track: PeriodTrack;
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
