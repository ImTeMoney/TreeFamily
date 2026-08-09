import type { SourceRef } from './common';

/** אשכול משפחתי — משמש לעץ המשפחה ולחיפוש ("בנות צלפחד") */
export interface Family {
  id: string;
  name: string;
  description: string;
  /** הדמות שממנה נוח להתחיל את העץ */
  rootPersonId: string;
  /** כל הדמויות המשתייכות לאשכול */
  personIds: string[];
  /** מונחי חיפוש נוספים, למשל "בנות צלפחד" */
  aliases: string[];
  sources: SourceRef[];
}
