import type { BibleEvent, Book, Family, Period, Person } from '../types';
import { dataset } from '../data/repository';
import { displayName } from './people';

export type SearchResult =
  | { kind: 'person'; id: string; title: string; subtitle: string; person: Person }
  | { kind: 'period'; id: string; title: string; subtitle: string; period: Period }
  | { kind: 'event'; id: string; title: string; subtitle: string; event: BibleEvent }
  | { kind: 'family'; id: string; title: string; subtitle: string; family: Family }
  | { kind: 'book'; id: string; title: string; subtitle: string; book: Book };

export const searchKindLabels: Record<SearchResult['kind'], string> = {
  person: 'דמות',
  period: 'תקופה',
  event: 'אירוע',
  family: 'משפחה',
  book: 'ספר',
};

function normalize(value: string): string {
  return value
    .replace(/[״"׳']/g, '')
    .replace(/[֑-ׇ]/g, '')
    .trim()
    .toLowerCase();
}

/** מילות שאלה נפוצות מנוקות מן החיפוש, כדי ש"מי חי בתקופת משה?" ימצא את משה */
const stopWords = [
  'מי', 'חי', 'חיה', 'חיו', 'היה', 'הייתה', 'היו', 'את', 'של', 'עם', 'בתקופת', 'בתקופה',
  'בימי', 'בזמן', 'איפה', 'מתי', 'מה', 'אבא', 'אבי', 'אביו', 'אמא', 'אמו', 'בן', 'בת',
  'הבן', 'הבת', 'ה', 'ו', 'א', 'שם', 'היא', 'הוא', 'כל',
];

function tokens(query: string): string[] {
  return normalize(query)
    .split(/[\s,.?!־-]+/)
    .filter((t) => t.length > 1 && !stopWords.includes(t));
}

function score(haystacks: string[], terms: string[]): number {
  if (terms.length === 0) return 0;
  let total = 0;
  for (const term of terms) {
    let best = 0;
    haystacks.forEach((raw, index) => {
      const hay = normalize(raw);
      if (!hay) return;
      const weight = index === 0 ? 3 : 1;
      if (hay === term) best = Math.max(best, 10 * weight);
      else if (hay.startsWith(term)) best = Math.max(best, 7 * weight);
      else if (hay.includes(term)) best = Math.max(best, 4 * weight);
    });
    total += best;
  }
  return total;
}

export function search(query: string, limit = 30): SearchResult[] {
  const terms = tokens(query);
  if (terms.length === 0) return [];

  const results: Array<{ result: SearchResult; score: number }> = [];

  for (const person of dataset.people) {
    const s = score(
      [person.name, person.fullName ?? '', person.disambiguation ?? '', person.tribe ?? '', ...person.titles, person.summary],
      terms,
    );
    if (s > 0) {
      const period = person.periodIds[0] ? dataset.periodById.get(person.periodIds[0]) : undefined;
      results.push({
        score: s + 1,
        result: {
          kind: 'person',
          id: person.id,
          title: displayName(person),
          subtitle: [period?.name, person.titles[0]].filter(Boolean).join(' · ') || 'דמות בתנ״ך',
          person,
        },
      });
    }
  }

  for (const period of dataset.periods) {
    const s = score([period.name, period.description], terms);
    if (s > 0) {
      results.push({
        score: s,
        result: { kind: 'period', id: period.id, title: period.name, subtitle: period.description, period },
      });
    }
  }

  for (const event of dataset.events) {
    const s = score([event.name, event.description], terms);
    if (s > 0) {
      results.push({
        score: s,
        result: { kind: 'event', id: event.id, title: event.name, subtitle: event.description, event },
      });
    }
  }

  for (const family of dataset.families) {
    const s = score([family.name, ...family.aliases, family.description], terms);
    if (s > 0) {
      results.push({
        score: s + 2,
        result: { kind: 'family', id: family.id, title: family.name, subtitle: family.description, family },
      });
    }
  }

  for (const book of dataset.books) {
    const s = score([book.name, book.description], terms);
    if (s > 0) {
      results.push({
        score: s,
        result: { kind: 'book', id: book.id, title: book.name, subtitle: book.description, book },
      });
    }
  }

  return results
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((r) => r.result);
}
