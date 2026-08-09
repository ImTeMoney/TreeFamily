/**
 * טיפוסי בסיס משותפים.
 *
 * הערה מתודולוגית חשובה:
 * התנ״ך אינו מספק ציר תאריכים אחיד ומוסכם. לכן המערכת אינה ממציאה תאריכים.
 * במקום זאת אנו משתמשים ב"סרגל סכמטי" (schematic axis) — ציר יחסי בין 0 ל-100
 * שמייצג *סדר* ו*חפיפה* בין דמויות ותקופות, ולא שנים היסטוריות.
 * לכל ישות יש רמת ודאות (certainty) שמבהירה עד כמה המיקום על הציר מבוסס.
 */

/** רמת הוודאות של המיקום בזמן / של הקשר */
export type Certainty = 'certain' | 'estimated' | 'unknown';

/**
 * מיקום על הסרגל הסכמטי. אינו מייצג שנים.
 * 0–100 — התנ״ך, מאדם הראשון ועד עזרא ונחמיה.
 * 100–200 — ספרות חז״ל, מבית שני ועד חתימת המשנה (והלאה, לכשיתווספו האמוראים).
 */
export interface SchematicSpan {
  /** תחילת הטווח על הסרגל הסכמטי */
  from: number;
  /** סוף הטווח על הסרגל הסכמטי */
  to: number;
  certainty: Certainty;
  /** תיאור מילולי של התקופה, למשל "דור המדבר" */
  label?: string;
}

/** מקור בתנ״ך */
export interface SourceRef {
  /** מזהה הספר, לדוגמה "bamidbar" */
  bookId: string;
  /** הפניה קריאה, לדוגמה "כ״ז, א׳–י״א" */
  ref: string;
  /** ציטוט או תמצית הפסוקים הרלוונטיים (אופציונלי) */
  quote?: string;
}

export type Gender = 'male' | 'female' | 'unknown';

/** קטגוריות תפקיד — משמשות לסינון ולצביעה */
export type RoleTag =
  | 'patriarch'
  | 'matriarch'
  | 'king'
  | 'queen'
  | 'prophet'
  | 'prophetess'
  | 'priest'
  | 'levite'
  | 'judge'
  | 'warrior'
  | 'officer'
  | 'scribe'
  | 'elder'
  | 'servant'
  | 'craftsman'
  | 'family'
  | 'foreigner'
  | 'sage'
  | 'tanna'
  | 'amora'
  | 'nasi'
  | 'zug'
  | 'other';

/**
 * הקורפוס שאליו הדמות או הספר שייכים.
 * מאפשר להציג את התנ״ך ואת ספרות חז״ל על אותו ציר, ולסנן ביניהם.
 */
export type Corpus = 'tanach' | 'mishna' | 'talmud';

/** מדור בתוך קורפוס — תורה/נביאים/כתובים, או סדר במשנה */
export type BookSection = string;
