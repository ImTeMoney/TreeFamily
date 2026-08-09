import type { Person, Relation, SourceRef } from '../../types';

type PersonInput = Pick<Person, 'id' | 'name' | 'gender' | 'span' | 'summary'> &
  Partial<Omit<Person, 'id' | 'name' | 'gender' | 'span' | 'summary'>>;

/** בונה דמות עם ברירות מחדל, כדי לשמור על קבצי הדאטה קריאים. */
export function person(input: PersonInput): Person {
  return {
    corpus: 'tanach',
    roles: ['other'],
    titles: [],
    periodIds: [],
    bookIds: [],
    eventIds: [],
    relations: [],
    sources: [],
    certainty: input.span.certainty,
    ...input,
  };
}

/** קיצור ליצירת קשר משפחתי */
export function rel(personId: string, kind: Relation['kind'], certainty: Relation['certainty'] = 'certain', note?: string): Relation {
  return { personId, kind, certainty, note };
}

/** קיצור ליצירת מקור */
export function src(bookId: string, ref: string, quote?: string): SourceRef {
  return { bookId, ref, quote };
}
