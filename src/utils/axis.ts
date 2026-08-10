/**
 * הסרגל הסכמטי — מקור האמת היחיד להמרת ערך על הציר לאחוזים בתצוגה.
 *
 * הערכים אינם שנים. הם מייצגים סדר וחפיפה בלבד:
 *   0–100   התנ״ך, מאדם הראשון ועד עזרא ונחמיה
 *   100–170 ספרות חז״ל, מבית שני ועד חתימת המשנה
 *   170–200 שמור להרחבה עתידית (אמוראים)
 *
 * הרחבת הציר בעתיד דורשת שינוי של AXIS_MAX בלבד — שאר הקוד ממיר דרך toPercent.
 */
export const AXIS_MIN = 0;
export const AXIS_MAX = 200;

const AXIS_RANGE = AXIS_MAX - AXIS_MIN;

/** ממיר ערך על הציר לאחוז מרוחב התצוגה */
export function toPercent(value: number): number {
  return ((value - AXIS_MIN) / AXIS_RANGE) * 100;
}

/** ממיר אורך טווח (ולא נקודה) לאחוז מרוחב התצוגה */
export function lengthToPercent(length: number): number {
  return (length / AXIS_RANGE) * 100;
}

export interface AxisScale {
  min: number;
  max: number;
  toPercent: (value: number) => number;
  lengthToPercent: (length: number) => number;
}

/**
 * סקאלה לחלון חלקי של הציר.
 * כשהציר נפתח בהדרגה, הטווח הנראה קצר מהטווח המלא — ואותו רוחב מסך מתחלק בין
 * פחות שנים, ולכן הרצועות והכיתובים גדולים וברורים יותר.
 */
export function createAxisScale(min: number, max: number): AxisScale {
  const range = Math.max(max - min, 1);
  return {
    min,
    max,
    toPercent: (value) => ((value - min) / range) * 100,
    lengthToPercent: (length) => (length / range) * 100,
  };
}

/** הסקאלה המלאה — ברירת המחדל כשאין חשיפה הדרגתית */
export const fullAxisScale = createAxisScale(AXIS_MIN, AXIS_MAX);
