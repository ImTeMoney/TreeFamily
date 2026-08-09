import type { BibleEvent, Book, Family, Period, Person } from '../types';
import { people, peopleById } from './people';
import { periods, periodById } from './periods';
import { events, eventById } from './events';
import { families, familyById } from './families';
import { books, bookById, sectionsByCorpus } from './books';

/**
 * שכבת גישה לנתונים.
 *
 * כל ה-UI ניגש לנתונים דרך המודול הזה בלבד. כאשר יתווסף Backend,
 * די יהיה להחליף את המימוש כאן (למשל ב-fetch) מבלי לגעת ברכיבים.
 * כל הפונקציות מחזירות Promise כדי שהמעבר ל-API יהיה שקוף.
 */
export interface BibleRepository {
  getPeople(): Promise<Person[]>;
  getPerson(id: string): Promise<Person | undefined>;
  getPeriods(): Promise<Period[]>;
  getPeriod(id: string): Promise<Period | undefined>;
  getEvents(): Promise<BibleEvent[]>;
  getEvent(id: string): Promise<BibleEvent | undefined>;
  getFamilies(): Promise<Family[]>;
  getFamily(id: string): Promise<Family | undefined>;
  getBooks(): Promise<Book[]>;
  getBook(id: string): Promise<Book | undefined>;
}

export const mockRepository: BibleRepository = {
  getPeople: async () => people,
  getPerson: async (id) => peopleById.get(id),
  getPeriods: async () => periods,
  getPeriod: async (id) => periodById.get(id),
  getEvents: async () => events,
  getEvent: async (id) => eventById.get(id),
  getFamilies: async () => families,
  getFamily: async (id) => familyById.get(id),
  getBooks: async () => books,
  getBook: async (id) => bookById.get(id),
};

export const repository: BibleRepository = mockRepository;

/**
 * גישה סינכרונית לנתונים — בשימוש רכיבי תצוגה שצריכים חיפוש מיידי.
 * בעת מעבר ל-API יש להחליף את השימושים בהוקים אסינכרוניים.
 */
export const dataset = {
  people,
  peopleById,
  periods,
  periodById,
  events,
  eventById,
  families,
  familyById,
  books,
  bookById,
  sectionsByCorpus,
};
