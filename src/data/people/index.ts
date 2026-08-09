import type { Person } from '../../types';
import { earlyPeople } from './early';
import { patriarchPeople } from './patriarchs';
import { exodusPeople } from './exodus';
import { judgesPeople } from './judges';
import { monarchyPeople } from './monarchy';
import { exilePeople } from './exile';

/**
 * מאגר הדמויות.
 * המבנה מחולק לפי תקופות כדי לאפשר הרחבה הדרגתית של המאגר —
 * הוספת קובץ חדש כאן אינה דורשת שינוי כלשהו ב-UI.
 */
export const people: Person[] = [
  ...earlyPeople,
  ...patriarchPeople,
  ...exodusPeople,
  ...judgesPeople,
  ...monarchyPeople,
  ...exilePeople,
];

export const peopleById = new Map(people.map((p) => [p.id, p]));
