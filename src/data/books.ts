import type { Book } from '../types';

export const books: Book[] = [
  { id: 'bereshit', name: 'בראשית', section: 'torah', order: 1, description: 'בריאת העולם, הדורות הראשונים והאבות.' },
  { id: 'shemot', name: 'שמות', section: 'torah', order: 2, description: 'השעבוד במצרים, היציאה, מתן תורה והמשכן.' },
  { id: 'vayikra', name: 'ויקרא', section: 'torah', order: 3, description: 'תורת הכהנים, הקרבנות והקדושה.' },
  { id: 'bamidbar', name: 'במדבר', section: 'torah', order: 4, description: 'המסעות במדבר, המפקדים ודור באי הארץ.' },
  { id: 'devarim', name: 'דברים', section: 'torah', order: 5, description: 'נאומי משה בערבות מואב לפני הכניסה לארץ.' },

  { id: 'yehoshua', name: 'יהושע', section: 'neviim', order: 6, description: 'כיבוש הארץ וחלוקתה לשבטים.' },
  { id: 'shoftim', name: 'שופטים', section: 'neviim', order: 7, description: 'דורות השופטים בין יהושע לשמואל.' },
  { id: 'shmuel-a', name: 'שמואל א׳', section: 'neviim', order: 8, description: 'שמואל, שאול ותחילת דרכו של דוד.' },
  { id: 'shmuel-b', name: 'שמואל ב׳', section: 'neviim', order: 9, description: 'מלכות דוד על יהודה ועל כל ישראל.' },
  { id: 'melachim-a', name: 'מלכים א׳', section: 'neviim', order: 10, description: 'שלמה, בניין המקדש, פילוג הממלכה ואליהו.' },
  { id: 'melachim-b', name: 'מלכים ב׳', section: 'neviim', order: 11, description: 'אלישע, מלכי ישראל ויהודה, וחורבן ירושלים.' },
  { id: 'yeshayahu', name: 'ישעיהו', section: 'neviim', order: 12, description: 'נבואות ישעיהו בימי מלכי יהודה.' },
  { id: 'yirmiyahu', name: 'ירמיהו', section: 'neviim', order: 13, description: 'נבואות ימי החורבן והגלות.' },
  { id: 'yechezkel', name: 'יחזקאל', section: 'neviim', order: 14, description: 'נבואות הגולה על נהר כבר.' },
  { id: 'hoshea', name: 'הושע', section: 'neviim', order: 15, description: 'נבואה לממלכת ישראל בימי ירבעם בן יואש.' },
  { id: 'yoel', name: 'יואל', section: 'neviim', order: 16, description: 'נבואת הארבה ויום ה׳.' },
  { id: 'amos', name: 'עמוס', section: 'neviim', order: 17, description: 'נביא מתקוע שניבא בבית אל.' },
  { id: 'ovadia', name: 'עובדיה', section: 'neviim', order: 18, description: 'נבואה קצרה על אדום.' },
  { id: 'yona', name: 'יונה', section: 'neviim', order: 19, description: 'שליחות יונה בן אמתי לנינוה.' },
  { id: 'micha', name: 'מיכה', section: 'neviim', order: 20, description: 'נבואה בימי יותם, אחז ויחזקיהו.' },
  { id: 'nachum', name: 'נחום', section: 'neviim', order: 21, description: 'משא נינוה.' },
  { id: 'chavakuk', name: 'חבקוק', section: 'neviim', order: 22, description: 'שאלת צדיק ורע לו ועליית הכשדים.' },
  { id: 'tzefania', name: 'צפניה', section: 'neviim', order: 23, description: 'נבואה בימי יאשיהו.' },
  { id: 'chagai', name: 'חגי', section: 'neviim', order: 24, description: 'עידוד בוני בית המקדש השני.' },
  { id: 'zecharia', name: 'זכריה', section: 'neviim', order: 25, description: 'חזונות ימי שיבת ציון.' },
  { id: 'malachi', name: 'מלאכי', section: 'neviim', order: 26, description: 'הנביא האחרון שבתרי עשר.' },

  { id: 'tehilim', name: 'תהילים', section: 'ketuvim', order: 27, description: 'מזמורי דוד, בני קרח, אסף ואחרים.' },
  { id: 'mishlei', name: 'משלי', section: 'ketuvim', order: 28, description: 'משלי שלמה בן דוד מלך ישראל.' },
  { id: 'iyov', name: 'איוב', section: 'ketuvim', order: 29, description: 'איוב ורעיו — ספר החכמה על הייסורים.' },
  { id: 'shir-hashirim', name: 'שיר השירים', section: 'ketuvim', order: 30, description: 'שיר השירים אשר לשלמה.' },
  { id: 'rut', name: 'רות', section: 'ketuvim', order: 31, description: 'מגילת רות בימי שפוט השופטים, ויוחסין דוד.' },
  { id: 'eicha', name: 'איכה', section: 'ketuvim', order: 32, description: 'קינות על חורבן ירושלים.' },
  { id: 'kohelet', name: 'קהלת', section: 'ketuvim', order: 33, description: 'דברי קהלת בן דוד מלך בירושלים.' },
  { id: 'esther', name: 'אסתר', section: 'ketuvim', order: 34, description: 'מגילת אסתר בימי אחשוורוש.' },
  { id: 'daniel', name: 'דניאל', section: 'ketuvim', order: 35, description: 'דניאל וחבריו בגלות בבל ובימי פרס.' },
  { id: 'ezra', name: 'עזרא', section: 'ketuvim', order: 36, description: 'שיבת ציון ובניין הבית השני.' },
  { id: 'nechemia', name: 'נחמיה', section: 'ketuvim', order: 37, description: 'בניין החומה ותיקוני נחמיה.' },
  { id: 'divrei-hayamim-a', name: 'דברי הימים א׳', section: 'ketuvim', order: 38, description: 'רשימות יוחסין ומלכות דוד.' },
  { id: 'divrei-hayamim-b', name: 'דברי הימים ב׳', section: 'ketuvim', order: 39, description: 'משלמה ועד הצהרת כורש.' },
];

export const bookById = new Map(books.map((b) => [b.id, b]));

export const sectionLabels: Record<Book['section'], string> = {
  torah: 'תורה',
  neviim: 'נביאים',
  ketuvim: 'כתובים',
};
