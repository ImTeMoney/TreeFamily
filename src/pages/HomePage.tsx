import { Link } from 'react-router-dom';
import { ArrowLeft, Compass, Hourglass, Search, Sparkles } from 'lucide-react';
import { dataset } from '../data/repository';
import { Timeline } from '../components/Timeline';
import { SearchBar } from '../components/SearchBar';
import { useAppState } from '../hooks/useAppState';
import { filterByCorpus } from '../utils/people';

const highlights = ['משה', 'דוד', 'אחיתופל', 'מחלה', 'דבורה', 'אליהו', 'עזרא', 'הלל', 'רבי עקיבא'];

export function HomePage() {
  const { openPerson, corpus } = useAppState();
  const scopedPeople = filterByCorpus(dataset.people, corpus);
  const scopedPeriods = filterByCorpus(dataset.periods, corpus);
  const previewPeople = scopedPeople.filter((p) => p.certainty === 'certain' || p.corpus !== 'tanach');

  return (
    <div className="space-y-10">
      <section className="card overflow-hidden">
        <div className="relative px-6 py-12 text-center sm:px-10 sm:py-16">
          <div
            className="pointer-events-none absolute inset-0 opacity-70"
            style={{
              backgroundImage:
                'radial-gradient(600px 260px at 70% 0%, rgba(193,154,75,.16), transparent 70%), radial-gradient(500px 220px at 20% 100%, rgba(39,64,103,.12), transparent 70%)',
            }}
            aria-hidden
          />
          <div className="relative mx-auto max-w-3xl">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-parchment-300 bg-white/70 px-3 py-1 text-xs font-medium text-ink-600">
              <Sparkles className="h-3.5 w-3.5 text-gold-600" aria-hidden />
              {scopedPeople.length} דמויות · {scopedPeriods.length} תקופות · {dataset.books.length} ספרים ומסכתות
            </span>
            <h1 className="mt-5 font-display text-4xl font-bold leading-tight text-ink-900 sm:text-6xl">
              מפת התנ״ך
            </h1>
            <p className="mt-3 font-display text-xl text-gold-600 sm:text-2xl">מי חי בתקופה של מי?</p>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-ink-600">
              חקור את האנשים, המשפחות והאירועים של התנ״ך והמשנה על ציר זמן אחד — מאדם הראשון ועד רבי יהודה הנשיא.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link to="/timeline" className="btn-primary px-6 py-3 text-base">
                <Compass className="h-4 w-4" />
                התחל לחקור
              </Link>
              <Link to="/timeline" className="btn-secondary px-6 py-3 text-base">
                <Hourglass className="h-4 w-4" />
                ציר הזמן
              </Link>
              <Link to="/search" className="btn-secondary px-6 py-3 text-base">
                <Search className="h-4 w-4" />
                חפש דמות
              </Link>
            </div>

            <div className="mx-auto mt-8 max-w-xl">
              <SearchBar variant="hero" />
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-1.5">
              <span className="text-xs text-ink-400">נסו:</span>
              {highlights.map((name) => {
                const person = scopedPeople.find((p) => p.name === name);
                if (!person) return null;
                return (
                  <button key={person.id} type="button" onClick={() => openPerson(person.id)} className="chip">
                    {person.name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="section-title mb-3">איך זה עובד</h2>
        <ol className="grid gap-3 sm:grid-cols-3">
          {[
            {
              title: 'בוחרים דמות',
              body: 'מהציר, מרשימת הדמויות או מהחיפוש. נפתח כרטיס עם התפקידים, המשפחה והמקורות בכתוב.',
              action: { label: 'לציר הזמן', to: '/timeline' },
            },
            {
              title: 'רואים מי חי איתה',
              body: 'כפתור "מי חי בתקופתו?" מציג את כל בני התקופה, עם סינון למלכים, נביאים, כהנים, נשים ועוד.',
              action: { label: 'לרשימת הדמויות', to: '/people' },
            },
            {
              title: 'ממשיכים לקשרים',
              body: 'מכל דמות אפשר לעבור לעץ המשפחה, לשרשרת הרב והתלמיד, לתקופה שלה ולאירועים שהשתתפה בהם.',
              action: { label: 'לעצי המשפחה', to: '/families' },
            },
          ].map((step, index) => (
            <li key={step.title} className="card flex h-full flex-col gap-2 p-5">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-ink-800 font-display text-sm font-bold text-parchment-50">
                {index + 1}
              </span>
              <h3 className="font-display text-lg font-bold text-ink-900">{step.title}</h3>
              <p className="flex-1 text-sm leading-relaxed text-ink-600">{step.body}</p>
              <Link to={step.action.to} className="btn-ghost w-fit px-0 text-sm text-ink-700 hover:bg-transparent hover:text-gold-600">
                {step.action.label}
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </li>
          ))}
        </ol>
      </section>

      <section>
        <div className="mb-3 flex items-end justify-between gap-3">
          <div>
            <h2 className="section-title">הצצה לציר הזמן</h2>
            <p className="text-sm text-ink-600">מאדם הראשון ועד חתימת המשנה — בציר אחד רציף.</p>
          </div>
          <Link to="/timeline" className="btn-ghost shrink-0 text-sm">
            לציר המלא
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </div>
        <Timeline people={previewPeople} />
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        {[
          {
            title: 'לא רק הדמויות הראשיות',
            body: 'בנות צלפחד, אחיתופל, ציבא, בבא בן בוטא, ברוריה — גם מי שנזכר פעם אחת מקבל כרטיס משלו.',
          },
          {
            title: 'רמת ודאות לכל פריט',
            body: 'המערכת אינה ממציאה תאריכים. לכל דמות מצוין אם התקופה ודאית, משוערת או שלא ניתן לקבוע.',
          },
          {
            title: 'משפחה ומסורה',
            body: 'עצי משפחה לצד שרשרת הרב והתלמיד — מהלל, דרך רבן יוחנן בן זכאי ורבי עקיבא, ועד רבי.',
          },
        ].map((item) => (
          <article key={item.title} className="card p-5">
            <h3 className="font-display text-lg font-bold text-ink-900">{item.title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-ink-600">{item.body}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
