import type { Certainty, Corpus, Gender, RoleTag, SchematicSpan, SourceRef } from './common';

/** קשר משפחתי בין שתי דמויות */
export interface Relation {
  personId: string;
  kind:
    | 'father'
    | 'mother'
    | 'son'
    | 'daughter'
    | 'brother'
    | 'sister'
    | 'husband'
    | 'wife'
    | 'ancestor'
    | 'descendant'
    | 'teacher'
    | 'student'
    | 'colleague'
    | 'disputant'
    | 'other';
  certainty: Certainty;
  note?: string;
}

export interface Person {
  /** מזהה ייחודי ויציב. דמויות שונות עם אותו שם מקבלות מזהים שונים. */
  id: string;
  /** השם כפי שהוא מופיע בתנ״ך */
  name: string;
  /**
   * שם מלא לזיהוי חד־משמעי, למשל "יוחנן בן קרח".
   * חובה כאשר קיימות כמה דמויות באותו שם.
   */
  fullName?: string;
  /** הבחנה קצרה בין דמויות בעלות אותו שם, למשל "שר צבא בימי גדליה" */
  disambiguation?: string;
  gender: Gender;
  /** הקורפוס שבו הדמות מופיעה. ברירת המחדל בבניית דמות היא "tanach". */
  corpus: Corpus;
  roles: RoleTag[];
  /** תיאור התפקידים במילים, לדוגמה ["יועץ דוד", "יועץ אבשלום"] */
  titles: string[];
  /** התקופות שאליהן הדמות משויכת */
  periodIds: string[];
  /** מיקום סכמטי על הציר — לא תאריכים היסטוריים */
  span: SchematicSpan;
  /** ודאות הזיהוי והמיקום הכרונולוגי */
  certainty: Certainty;
  /** שבט, אם ידוע */
  tribe?: string;
  /** ספרים שבהם הדמות מופיעה */
  bookIds: string[];
  /** אירועים שהדמות מעורבת בהם */
  eventIds: string[];
  relations: Relation[];
  sources: SourceRef[];
  /** תקציר קצר בעברית. אין להוסיף מידע שאינו מן הכתוב. */
  summary: string;
}
