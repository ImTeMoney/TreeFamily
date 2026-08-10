import type { Certainty, Corpus, SourceRef } from './common';

/**
 * שלושה מסלולים מקבילים של תקופות:
 * "age"   — עידן־על לצורך התמצאות (בית ראשון, גלות בבל, בית שני, אחרי החורבן)
 * "era"   — תקופה היסטורית מפורטת (תקופת דוד, ימי הורדוס)
 * "chain" — שלב במסירת התורה (הזוגות, תנאים, אמוראים)
 *
 * אדם אחד שייך בו־זמנית לכולם: הלל חי בבית שני, בימי הורדוס, והוא מן הזוגות.
 */
export type PeriodTrack = 'age' | 'era' | 'chain';

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
