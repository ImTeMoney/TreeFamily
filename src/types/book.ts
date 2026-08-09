import type { BookSection } from './common';

export interface Book {
  id: string;
  name: string;
  section: BookSection;
  order: number;
  /** תיאור קצר בעברית */
  description: string;
}
