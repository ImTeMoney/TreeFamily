import type { BookSection, Corpus } from './common';

export interface Book {
  id: string;
  name: string;
  corpus: Corpus;
  /** מדור בתוך הקורפוס — "torah" / "neviim" / "ketuvim", או סדר במשנה */
  section: BookSection;
  order: number;
  /** תיאור קצר בעברית */
  description: string;
}
