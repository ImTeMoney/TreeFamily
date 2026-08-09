import type { Book } from '../types';

export const books: Book[] = [
  { id: 'bereshit', name: 'בראשית', corpus: 'tanach', section: 'torah', order: 1, description: 'בריאת העולם, הדורות הראשונים והאבות.' },
  { id: 'shemot', name: 'שמות', corpus: 'tanach', section: 'torah', order: 2, description: 'השעבוד במצרים, היציאה, מתן תורה והמשכן.' },
  { id: 'vayikra', name: 'ויקרא', corpus: 'tanach', section: 'torah', order: 3, description: 'תורת הכהנים, הקרבנות והקדושה.' },
  { id: 'bamidbar', name: 'במדבר', corpus: 'tanach', section: 'torah', order: 4, description: 'המסעות במדבר, המפקדים ודור באי הארץ.' },
  { id: 'devarim', name: 'דברים', corpus: 'tanach', section: 'torah', order: 5, description: 'נאומי משה בערבות מואב לפני הכניסה לארץ.' },

  { id: 'yehoshua', name: 'יהושע', corpus: 'tanach', section: 'neviim', order: 6, description: 'כיבוש הארץ וחלוקתה לשבטים.' },
  { id: 'shoftim', name: 'שופטים', corpus: 'tanach', section: 'neviim', order: 7, description: 'דורות השופטים בין יהושע לשמואל.' },
  { id: 'shmuel-a', name: 'שמואל א׳', corpus: 'tanach', section: 'neviim', order: 8, description: 'שמואל, שאול ותחילת דרכו של דוד.' },
  { id: 'shmuel-b', name: 'שמואל ב׳', corpus: 'tanach', section: 'neviim', order: 9, description: 'מלכות דוד על יהודה ועל כל ישראל.' },
  { id: 'melachim-a', name: 'מלכים א׳', corpus: 'tanach', section: 'neviim', order: 10, description: 'שלמה, בניין המקדש, פילוג הממלכה ואליהו.' },
  { id: 'melachim-b', name: 'מלכים ב׳', corpus: 'tanach', section: 'neviim', order: 11, description: 'אלישע, מלכי ישראל ויהודה, וחורבן ירושלים.' },
  { id: 'yeshayahu', name: 'ישעיהו', corpus: 'tanach', section: 'neviim', order: 12, description: 'נבואות ישעיהו בימי מלכי יהודה.' },
  { id: 'yirmiyahu', name: 'ירמיהו', corpus: 'tanach', section: 'neviim', order: 13, description: 'נבואות ימי החורבן והגלות.' },
  { id: 'yechezkel', name: 'יחזקאל', corpus: 'tanach', section: 'neviim', order: 14, description: 'נבואות הגולה על נהר כבר.' },
  { id: 'hoshea', name: 'הושע', corpus: 'tanach', section: 'neviim', order: 15, description: 'נבואה לממלכת ישראל בימי ירבעם בן יואש.' },
  { id: 'yoel', name: 'יואל', corpus: 'tanach', section: 'neviim', order: 16, description: 'נבואת הארבה ויום ה׳.' },
  { id: 'amos', name: 'עמוס', corpus: 'tanach', section: 'neviim', order: 17, description: 'נביא מתקוע שניבא בבית אל.' },
  { id: 'ovadia', name: 'עובדיה', corpus: 'tanach', section: 'neviim', order: 18, description: 'נבואה קצרה על אדום.' },
  { id: 'yona', name: 'יונה', corpus: 'tanach', section: 'neviim', order: 19, description: 'שליחות יונה בן אמתי לנינוה.' },
  { id: 'micha', name: 'מיכה', corpus: 'tanach', section: 'neviim', order: 20, description: 'נבואה בימי יותם, אחז ויחזקיהו.' },
  { id: 'nachum', name: 'נחום', corpus: 'tanach', section: 'neviim', order: 21, description: 'משא נינוה.' },
  { id: 'chavakuk', name: 'חבקוק', corpus: 'tanach', section: 'neviim', order: 22, description: 'שאלת צדיק ורע לו ועליית הכשדים.' },
  { id: 'tzefania', name: 'צפניה', corpus: 'tanach', section: 'neviim', order: 23, description: 'נבואה בימי יאשיהו.' },
  { id: 'chagai', name: 'חגי', corpus: 'tanach', section: 'neviim', order: 24, description: 'עידוד בוני בית המקדש השני.' },
  { id: 'zecharia', name: 'זכריה', corpus: 'tanach', section: 'neviim', order: 25, description: 'חזונות ימי שיבת ציון.' },
  { id: 'malachi', name: 'מלאכי', corpus: 'tanach', section: 'neviim', order: 26, description: 'הנביא האחרון שבתרי עשר.' },

  { id: 'tehilim', name: 'תהילים', corpus: 'tanach', section: 'ketuvim', order: 27, description: 'מזמורי דוד, בני קרח, אסף ואחרים.' },
  { id: 'mishlei', name: 'משלי', corpus: 'tanach', section: 'ketuvim', order: 28, description: 'משלי שלמה בן דוד מלך ישראל.' },
  { id: 'iyov', name: 'איוב', corpus: 'tanach', section: 'ketuvim', order: 29, description: 'איוב ורעיו — ספר החכמה על הייסורים.' },
  { id: 'shir-hashirim', name: 'שיר השירים', corpus: 'tanach', section: 'ketuvim', order: 30, description: 'שיר השירים אשר לשלמה.' },
  { id: 'rut', name: 'רות', corpus: 'tanach', section: 'ketuvim', order: 31, description: 'מגילת רות בימי שפוט השופטים, ויוחסין דוד.' },
  { id: 'eicha', name: 'איכה', corpus: 'tanach', section: 'ketuvim', order: 32, description: 'קינות על חורבן ירושלים.' },
  { id: 'kohelet', name: 'קהלת', corpus: 'tanach', section: 'ketuvim', order: 33, description: 'דברי קהלת בן דוד מלך בירושלים.' },
  { id: 'esther', name: 'אסתר', corpus: 'tanach', section: 'ketuvim', order: 34, description: 'מגילת אסתר בימי אחשוורוש.' },
  { id: 'daniel', name: 'דניאל', corpus: 'tanach', section: 'ketuvim', order: 35, description: 'דניאל וחבריו בגלות בבל ובימי פרס.' },
  { id: 'ezra', name: 'עזרא', corpus: 'tanach', section: 'ketuvim', order: 36, description: 'שיבת ציון ובניין הבית השני.' },
  { id: 'nechemia', name: 'נחמיה', corpus: 'tanach', section: 'ketuvim', order: 37, description: 'בניין החומה ותיקוני נחמיה.' },
  { id: 'divrei-hayamim-a', name: 'דברי הימים א׳', corpus: 'tanach', section: 'ketuvim', order: 38, description: 'רשימות יוחסין ומלכות דוד.' },
  { id: 'divrei-hayamim-b', name: 'דברי הימים ב׳', corpus: 'tanach', section: 'ketuvim', order: 39, description: 'משלמה ועד הצהרת כורש.' },
];

/** שישה סדרי משנה — 63 מסכתות */
const mishnaTractates: Array<[section: string, id: string, name: string, description: string]> = [
  ['zeraim', 'brachot', 'ברכות', 'קריאת שמע, תפילה וברכות הנהנין.'],
  ['zeraim', 'peah', 'פאה', 'פאה, לקט, שכחה ומתנות עניים.'],
  ['zeraim', 'demai', 'דמאי', 'פירות שיש ספק אם הופרשו מהם מעשרות.'],
  ['zeraim', 'kilaim', 'כלאים', 'איסורי הרכבה וערבוב במיני זרעים, בהמה ובגדים.'],
  ['zeraim', 'shviit', 'שביעית', 'דיני שנת השמיטה בקרקע ובפירות.'],
  ['zeraim', 'trumot', 'תרומות', 'הפרשת תרומה לכהן ודיניה.'],
  ['zeraim', 'maasrot', 'מעשרות', 'מעשר ראשון וחיוב הפירות במעשר.'],
  ['zeraim', 'maaser-sheni', 'מעשר שני', 'מעשר שני, פדיונו ונטע רבעי.'],
  ['zeraim', 'chala', 'חלה', 'הפרשת חלה מן העיסה.'],
  ['zeraim', 'orla', 'ערלה', 'איסור פירות שלוש השנים הראשונות.'],
  ['zeraim', 'bikurim', 'ביכורים', 'הבאת ביכורים למקדש ומקרא ביכורים.'],

  ['moed', 'shabbat', 'שבת', 'שלושים ותשע מלאכות ודיני השבת.'],
  ['moed', 'eruvin', 'עירובין', 'עירובי חצרות ותחומין.'],
  ['moed', 'psachim', 'פסחים', 'ביעור חמץ, קרבן פסח וליל הסדר.'],
  ['moed', 'shkalim', 'שקלים', 'מחצית השקל וניהול המקדש.'],
  ['moed', 'yoma', 'יומא', 'עבודת הכהן הגדול ביום הכיפורים.'],
  ['moed', 'suka', 'סוכה', 'סוכה, ארבעת המינים ושמחת בית השואבה.'],
  ['moed', 'beitza', 'ביצה', 'מלאכות המותרות והאסורות ביום טוב.'],
  ['moed', 'rosh-hashana', 'ראש השנה', 'קידוש החודש, העדים והשופר.'],
  ['moed', 'taanit', 'תענית', 'תעניות הציבור ותפילה על הגשמים.'],
  ['moed', 'megila', 'מגילה', 'קריאת המגילה וקריאת התורה.'],
  ['moed', 'moed-katan', 'מועד קטן', 'מלאכה בחול המועד ודיני אבלות.'],
  ['moed', 'chagiga', 'חגיגה', 'קרבן חגיגה, ראייה, ומסירת התורה בזוגות.'],

  ['nashim', 'yevamot', 'יבמות', 'ייבום וחליצה ואיסורי עריות.'],
  ['nashim', 'ktubot', 'כתובות', 'הכתובה וחיובי הבעל והאישה.'],
  ['nashim', 'nedarim', 'נדרים', 'נדרים והתרתם.'],
  ['nashim', 'nazir', 'נזיר', 'נזירות ודיניה.'],
  ['nashim', 'sota', 'סוטה', 'דין הסוטה, ופרשיות הנאמרות בלשון הקודש.'],
  ['nashim', 'gitin', 'גיטין', 'כתיבת הגט ונתינתו, ותקנות העולם.'],
  ['nashim', 'kidushin', 'קידושין', 'דרכי הקידושין ודיני יוחסין.'],

  ['nezikin', 'bava-kama', 'בבא קמא', 'נזקי ממון, גניבה וחבלות.'],
  ['nezikin', 'bava-metzia', 'בבא מציעא', 'אבידה ומציאה, פיקדון, שכירות וריבית.'],
  ['nezikin', 'bava-batra', 'בבא בתרא', 'שותפות בקרקע, חזקה, מכר וירושה.'],
  ['nezikin', 'sanhedrin', 'סנהדרין', 'בתי הדין, דיני נפשות ואגדות הדין.'],
  ['nezikin', 'makot', 'מכות', 'עדים זוממים, גלות ומלקות.'],
  ['nezikin', 'shvuot', 'שבועות', 'סוגי השבועות ודיניהן.'],
  ['nezikin', 'eduyot', 'עדויות', 'עדויות חכמים זה על זה, ורוב מחלוקות בית שמאי ובית הלל.'],
  ['nezikin', 'avoda-zara', 'עבודה זרה', 'הרחקה מעבודה זרה ומיין נסך.'],
  ['nezikin', 'avot', 'אבות', 'שרשרת מסירת התורה ומוסר החכמים, מסיני ועד רבי.'],
  ['nezikin', 'horayot', 'הוריות', 'הוראת בית דין שטעה, ודיני כהן משיח ונשיא.'],

  ['kodashim', 'zvachim', 'זבחים', 'סדר הקרבנות ומקום שחיטתם.'],
  ['kodashim', 'menachot', 'מנחות', 'קרבנות המנחה, תפילין וציצית.'],
  ['kodashim', 'chulin', 'חולין', 'שחיטה, טרפות ואיסור בשר בחלב.'],
  ['kodashim', 'bchorot', 'בכורות', 'בכור בהמה ובכור אדם ומומי הקרבנות.'],
  ['kodashim', 'arachin', 'ערכין', 'ערכין והקדשות, ושדה אחוזה.'],
  ['kodashim', 'tmura', 'תמורה', 'המרת קרבן בבהמה אחרת.'],
  ['kodashim', 'kritot', 'כריתות', 'חיובי כרת וקרבן חטאת.'],
  ['kodashim', 'meila', 'מעילה', 'מעילה בקודשים.'],
  ['kodashim', 'tamid', 'תמיד', 'סדר עבודת הבוקר במקדש.'],
  ['kodashim', 'midot', 'מידות', 'מבנה בית המקדש ומידותיו.'],
  ['kodashim', 'kinim', 'קינים', 'קרבנות העוף ותערובותיהם.'],

  ['taharot', 'kelim', 'כלים', 'טומאת כלים על סוגיהם.'],
  ['taharot', 'ohalot', 'אהלות', 'טומאת מת ואוהל המת.'],
  ['taharot', 'negaim', 'נגעים', 'נגעי אדם, בגד ובית.'],
  ['taharot', 'para', 'פרה', 'פרה אדומה ומי חטאת.'],
  ['taharot', 'taharot', 'טהרות', 'טומאות קלות וספקותיהן.'],
  ['taharot', 'mikvaot', 'מקוואות', 'שיעור המקווה וכשרות המים.'],
  ['taharot', 'nida', 'נידה', 'דיני נידה וטהרת המשפחה.'],
  ['taharot', 'machshirin', 'מכשירין', 'שבעה משקים המכשירים אוכל לקבל טומאה.'],
  ['taharot', 'zavim', 'זבים', 'טומאת זב וזבה.'],
  ['taharot', 'tvul-yom', 'טבול יום', 'מי שטבל וטרם העריב שמשו.'],
  ['taharot', 'yadaim', 'ידיים', 'נטילת ידיים וטומאת הידיים.'],
  ['taharot', 'uktzin', 'עוקצין', 'עוקצי הפירות וחיבורם לעניין טומאה.'],
];

/** המסכתות מתווספות למאגר הספרים באותו מבנה בדיוק — מקור הוא מסכת, פרק ומשנה */
books.push(
  ...mishnaTractates.map(([section, id, name, description], index) => ({
    id,
    name,
    corpus: 'mishna' as const,
    section,
    order: 100 + index,
    description,
  })),
);

export const bookById = new Map(books.map((b) => [b.id, b]));

/** תוויות המדורים בתוך כל קורפוס */
export const sectionLabels: Record<string, string> = {
  torah: 'תורה',
  neviim: 'נביאים',
  ketuvim: 'כתובים',
  zeraim: 'סדר זרעים',
  moed: 'סדר מועד',
  nashim: 'סדר נשים',
  nezikin: 'סדר נזיקין',
  kodashim: 'סדר קדשים',
  taharot: 'סדר טהרות',
};

/** סדר המדורים בתצוגה, לפי קורפוס */
export const sectionsByCorpus: Record<string, string[]> = {
  tanach: ['torah', 'neviim', 'ketuvim'],
  mishna: ['zeraim', 'moed', 'nashim', 'nezikin', 'kodashim', 'taharot'],
  talmud: [],
};
