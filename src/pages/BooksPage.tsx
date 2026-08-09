import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { dataset } from '../data/repository';
import { sectionLabels } from '../data/books';
import { peopleInBook } from '../utils/people';
import { PersonCard } from '../components/PersonCard';
import { Timeline } from '../components/Timeline';
import type { Corpus } from '../types';
import { useAppState } from '../hooks/useAppState';
import { corpusDescriptions, corpusLabels } from '../utils/labels';

const corpora: Corpus[] = ['tanach', 'bayit-sheni', 'mishna', 'talmud'];

export function BooksPage() {
  const { corpus } = useAppState();
  const visibleCorpora = corpus === 'all' ? corpora : corpora.filter((c) => c === corpus);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="section-title">ספרייה</h1>
        <p className="text-sm text-ink-600">
          תורה · נביאים · כתובים · שישה סדרי משנה. בחרו ספר או מסכת כדי לראות את הדמויות שמופיעות בהם על ציר הזמן.
        </p>
      </header>

      {visibleCorpora.map((currentCorpus) => (
        <div key={currentCorpus} className="space-y-5">
          <div className="border-b border-parchment-200 pb-2">
            <h2 className="font-display text-2xl font-bold text-ink-900">{corpusLabels[currentCorpus]}</h2>
            <p className="text-xs text-ink-400">{corpusDescriptions[currentCorpus]}</p>
          </div>

          {(dataset.sectionsByCorpus[currentCorpus] ?? []).map((section) => (
            <section key={section}>
              <h3 className="mb-2 font-display text-lg font-bold text-ink-800">{sectionLabels[section]}</h3>
              <ul className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
                {dataset.books
                  .filter((b) => b.corpus === currentCorpus && b.section === section)
                  .map((book) => {
                    const count = peopleInBook(book.id).length;
                    return (
                      <li key={book.id}>
                        <Link
                          to={`/books/${book.id}`}
                          className="card block h-full p-4 transition-all hover:-translate-y-0.5 hover:border-gold-500 hover:shadow-pop"
                        >
                          <h4 className="font-display text-base font-bold text-ink-900">{book.name}</h4>
                          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-ink-600">{book.description}</p>
                          <p className="mt-2 text-[11px] text-ink-400">
                            {count > 0 ? `${count} דמויות במאגר` : 'טרם שויכו דמויות'}
                          </p>
                        </Link>
                      </li>
                    );
                  })}
              </ul>
            </section>
          ))}
        </div>
      ))}
    </div>
  );
}

export function BookDetailPage() {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const book = bookId ? dataset.bookById.get(bookId) : undefined;

  if (!book) {
    return (
      <div className="card p-8 text-center">
        <p className="text-ink-600">הספר לא נמצא.</p>
        <Link to="/books" className="btn-secondary mt-4">
          לרשימת הספרים
        </Link>
      </div>
    );
  }

  const people = peopleInBook(book.id);

  return (
    <div className="space-y-6">
      <button type="button" onClick={() => navigate('/books')} className="btn-ghost text-sm">
        <ArrowRight className="h-4 w-4" />
        לספרייה
      </button>

      <header className="card p-6">
        <span className="chip">
          {corpusLabels[book.corpus]} · {sectionLabels[book.section]}
        </span>
        <h1 className="mt-2 font-display text-3xl font-bold text-ink-900">{book.name}</h1>
        <p className="mt-2 max-w-3xl leading-relaxed text-ink-600">{book.description}</p>
      </header>

      <section>
        <h2 className="section-title mb-3">הדמויות על ציר הזמן</h2>
        <Timeline people={people} />
      </section>

      <section>
        <h2 className="section-title mb-3">דמויות המופיעות בספר ({people.length})</h2>
        <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
          {people.map((person) => (
            <PersonCard key={person.id} person={person} compact />
          ))}
        </div>
        {people.length === 0 && (
          <p className="card p-6 text-sm text-ink-400">טרם שויכו דמויות לספר זה במאגר. המבנה תומך בהוספתן בהמשך.</p>
        )}
      </section>
    </div>
  );
}
