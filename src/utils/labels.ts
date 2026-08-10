import type { Certainty, Corpus, Gender, Relation, RoleTag } from '../types';

export const corpusLabels: Record<Corpus, string> = {
  tanach: 'תנ״ך',
  'bayit-sheni': 'בית שני',
  mishna: 'משנה',
  talmud: 'תלמוד',
};

export const corpusDescriptions: Record<Corpus, string> = {
  tanach: 'מאדם הראשון ועד עזרא ונחמיה',
  'bayit-sheni': 'מימי פרס ויוון, דרך החשמונאים ועד הורדוס והחורבן',
  mishna: 'מאנשי כנסת הגדולה ועד חתימת המשנה',
  talmud: 'מרב ושמואל ועד רב אשי ורבינא וחתימת התלמוד',
};

export const roleLabels: Record<RoleTag, string> = {
  patriarch: 'אב האומה',
  matriarch: 'אם האומה',
  king: 'מלך',
  queen: 'מלכה',
  prophet: 'נביא',
  prophetess: 'נביאה',
  priest: 'כהן',
  levite: 'לוי',
  judge: 'שופט',
  warrior: 'לוחם',
  officer: 'שר ויועץ',
  scribe: 'סופר',
  elder: 'זקן ומנהיג',
  servant: 'עבד ושפחה',
  craftsman: 'אומן',
  family: 'בן משפחה',
  foreigner: 'מעמי הסביבה',
  sage: 'חכם',
  tanna: 'תנא',
  amora: 'אמורא',
  nasi: 'נשיא',
  zug: 'מן הזוגות',
  other: 'אחר',
};

/** אימוג׳י מזהה לכל תפקיד — לשימוש ברשימות "מי חי בתקופתו" */
export const roleEmoji: Record<RoleTag, string> = {
  patriarch: '🕊️',
  matriarch: '🕊️',
  king: '👑',
  queen: '👑',
  prophet: '📜',
  prophetess: '📜',
  priest: '🕯️',
  levite: '🎵',
  judge: '⚖️',
  warrior: '⚔️',
  officer: '🛡️',
  scribe: '✒️',
  elder: '🏛️',
  servant: '🏺',
  craftsman: '🔨',
  family: '👤',
  foreigner: '🌍',
  sage: '📚',
  tanna: '📚',
  amora: '📚',
  nasi: '🏛️',
  zug: '⚖️',
  other: '👤',
};

export const certaintyLabels: Record<Certainty, string> = {
  certain: 'ודאי',
  estimated: 'משוער',
  unknown: 'לא ידוע',
};

export const certaintyDots: Record<Certainty, string> = {
  certain: '🟢',
  estimated: '🟡',
  unknown: '🔴',
};

export const certaintyClasses: Record<Certainty, string> = {
  certain: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  estimated: 'bg-amber-50 text-amber-800 border-amber-200',
  unknown: 'bg-rose-50 text-rose-800 border-rose-200',
};

export const certaintyExplain: Record<Certainty, string> = {
  certain: 'התקופה עולה במפורש מן הכתוב',
  estimated: 'התקופה משוערת על פי ההקשר ורצף הדורות',
  unknown: 'לא ניתן לקבוע את התקופה מן הכתוב',
};

export const genderLabels: Record<Gender, string> = {
  male: 'זכר',
  female: 'נקבה',
  unknown: 'לא צוין',
};

export const relationLabels: Record<Relation['kind'], string> = {
  father: 'אב',
  mother: 'אם',
  son: 'בן',
  daughter: 'בת',
  brother: 'אח',
  sister: 'אחות',
  husband: 'בעל',
  wife: 'אישה',
  ancestor: 'אב קדמון',
  descendant: 'צאצא',
  teacher: 'רבו',
  student: 'תלמידו',
  colleague: 'חברו',
  disputant: 'בר פלוגתא',
  other: 'קשר',
};

/** קבוצות הסינון המהיר במסך "מי חי בתקופתו" ובמסך תקופה */
export const roleGroups = [
  { id: 'all', label: 'כולם', roles: [] as RoleTag[] },
  { id: 'kings', label: 'מלכים', roles: ['king', 'queen'] as RoleTag[] },
  { id: 'prophets', label: 'נביאים', roles: ['prophet', 'prophetess'] as RoleTag[] },
  { id: 'priests', label: 'כהנים ולויים', roles: ['priest', 'levite'] as RoleTag[] },
  { id: 'women', label: 'נשים', roles: [] as RoleTag[] },
  { id: 'sages', label: 'חכמים', roles: ['sage', 'tanna', 'amora', 'nasi', 'zug'] as RoleTag[] },
  { id: 'warriors', label: 'לוחמים ושרים', roles: ['warrior', 'officer'] as RoleTag[] },
  { id: 'family', label: 'משפחה', roles: ['family', 'patriarch', 'matriarch'] as RoleTag[] },
  { id: 'other', label: 'אחר', roles: ['servant', 'craftsman', 'scribe', 'elder', 'foreigner', 'judge', 'other'] as RoleTag[] },
] as const;

export type RoleGroupId = (typeof roleGroups)[number]['id'];

/**
 * חלוקה לרצועות אופקיות בציר הזמן.
 * בניגוד ל-roleGroups, כאן כל דמות שייכת לקבוצה אחת בלבד — הראשונה שהיא תואמת —
 * כדי שהציר יהיה מסודר בשורות ולא ערבוב אקראי.
 */
export const timelineGroups = [
  { id: 'rulers', label: 'מלכים ומנהיגים', color: '#274067', roles: ['king', 'queen', 'nasi', 'judge', 'patriarch', 'matriarch'] },
  { id: 'prophets', label: 'נביאים', color: '#7a4f7d', roles: ['prophet', 'prophetess'] },
  { id: 'sages', label: 'חכמים', color: '#2f7d78', roles: ['sage', 'tanna', 'amora', 'zug', 'scribe'] },
  { id: 'priests', label: 'כהנים ולויים', color: '#a37f36', roles: ['priest', 'levite'] },
  { id: 'warriors', label: 'לוחמים ושרים', color: '#8f3a3a', roles: ['warrior', 'officer'] },
  { id: 'others', label: 'משפחה ואחרים', color: '#6b7a8f', roles: [] as RoleTag[] },
] as const satisfies ReadonlyArray<{ id: string; label: string; color: string; roles: readonly RoleTag[] }>;

export type TimelineGroupId = (typeof timelineGroups)[number]['id'];

/** הקבוצה שאליה הדמות משויכת בציר — הראשונה שתפקיד שלה תואם */
export function timelineGroupOf(roles: RoleTag[]): (typeof timelineGroups)[number] {
  return (
    timelineGroups.find((group) => group.roles.length > 0 && roles.some((r) => (group.roles as readonly RoleTag[]).includes(r))) ??
    timelineGroups[timelineGroups.length - 1]
  );
}
