import type { BibleEvent, Corpus, Family, Person, RoleTag } from '../types';
import { dataset } from '../data/repository';
import { roleGroups, type RoleGroupId } from './labels';

/** האם שני טווחים על הסרגל הסכמטי חופפים */
export function overlaps(a: { from: number; to: number }, b: { from: number; to: number }): boolean {
  return a.from <= b.to && b.from <= a.to;
}

/** מידת החפיפה בין שתי דמויות (0–1 ביחס לטווח הקצר מביניהן) */
export function overlapRatio(a: Person, b: Person): number {
  const start = Math.max(a.span.from, b.span.from);
  const end = Math.min(a.span.to, b.span.to);
  if (end <= start) return 0;
  const shortest = Math.min(a.span.to - a.span.from, b.span.to - b.span.from) || 1;
  return Math.min(1, (end - start) / shortest);
}

/** רמת הוודאות של החפיפה בין שתי דמויות */
export function overlapCertainty(a: Person, b: Person): 'certain' | 'estimated' | 'unknown' {
  if (a.certainty === 'unknown' || b.certainty === 'unknown') return 'unknown';
  if (a.certainty === 'certain' && b.certainty === 'certain') return 'certain';
  return 'estimated';
}

/** כל הדמויות שחיו בתקופתו של אדם מסוים, ממוינות לפי מידת החפיפה */
export function contemporariesOf(person: Person, all: Person[] = dataset.people): Person[] {
  return all
    .filter((other) => other.id !== person.id && overlaps(person.span, other.span))
    .sort((x, y) => overlapRatio(person, y) - overlapRatio(person, x) || x.name.localeCompare(y.name, 'he'));
}

export function peopleInPeriod(periodId: string, all: Person[] = dataset.people): Person[] {
  const period = dataset.periodById.get(periodId);
  return all
    .filter((p) => p.periodIds.includes(periodId) || (period ? overlaps(p.span, period) : false))
    .sort((a, b) => a.span.from - b.span.from);
}

export function peopleInBook(bookId: string, all: Person[] = dataset.people): Person[] {
  return all.filter((p) => p.bookIds.includes(bookId)).sort((a, b) => a.span.from - b.span.from);
}

export function peopleInEvent(event: BibleEvent): Person[] {
  return event.personIds.map((id) => dataset.peopleById.get(id)).filter((p): p is Person => Boolean(p));
}

export function familiesOfPerson(person: Person): Family[] {
  return dataset.families.filter((f) => f.personIds.includes(person.id));
}

export function eventsOfPerson(person: Person): BibleEvent[] {
  return dataset.events.filter((e) => person.eventIds.includes(e.id) || e.personIds.includes(person.id));
}

/** שם תצוגה חד־משמעי — חשוב לדמויות שונות בעלות אותו שם */
export function displayName(person: Person): string {
  return person.fullName ?? person.name;
}

export function matchesRoleGroup(person: Person, groupId: RoleGroupId): boolean {
  if (groupId === 'all') return true;
  if (groupId === 'women') return person.gender === 'female';
  const group = roleGroups.find((g) => g.id === groupId);
  if (!group) return true;
  return person.roles.some((r) => (group.roles as RoleTag[]).includes(r));
}

export type CorpusFilter = Corpus | 'all';

/**
 * המדורים שבהם הדמות מופיעה — תורה / נביאים / כתובים, או סדר במשנה ובתלמוד.
 * נגזר מן הספרים שבהם היא נזכרת, ולכן דמות אחת יכולה להשתייך לכמה מדורים:
 * דוד מופיע בשמואל (נביאים), בתהילים ובדברי הימים (כתובים).
 */
export function sectionsOfPerson(person: Person): string[] {
  const sections = person.bookIds
    .map((id) => dataset.bookById.get(id)?.section)
    .filter((section): section is string => Boolean(section));
  return Array.from(new Set(sections));
}

/** מסנן פריטים לפי הקורפוס הנבחר. "all" מחזיר את הכול. */
export function filterByCorpus<T extends { corpus: Corpus }>(items: T[], corpus: CorpusFilter): T[] {
  return corpus === 'all' ? items : items.filter((item) => item.corpus === corpus);
}

/** קשרי לימוד — רב, תלמיד, חבר ובר פלוגתא */
export function studyRelations(person: Person) {
  return person.relations.filter(
    (r) => r.kind === 'teacher' || r.kind === 'student' || r.kind === 'colleague' || r.kind === 'disputant',
  );
}

/** מיון יציב לפי מיקום על הציר ואז לפי שם */
export function byTimeline(a: Person, b: Person): number {
  return a.span.from - b.span.from || a.name.localeCompare(b.name, 'he');
}
