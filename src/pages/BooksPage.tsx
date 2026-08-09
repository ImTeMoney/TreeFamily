import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { dataset } from '../data/repository';
import { sectionLabels } from '../data/books';
import { peopleInBook } from '../utils/people';
import { PersonCard } from '../components/PersonCard';
import { Timeline } from '../components/Timeline';
import type { BookSection } from '../types';

const sections: BookSection[] = ['torah', 'neviim', 'ketuvim'];

export function BooksPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="section-title">ספרי התנ״ך</h1>
        <p className="text-sm text-ink-600">בחרו ספר כדי לראות את הדמויות שמופיעות בו, ולמקם אותן על ציר הזמן.</p>
      </header>

      {sections.map((section) => (
        <section key={section}>
          <h2 className="mb-2 font-display text-xl font-bold text-ink-900">{sectionLabels[section]}</h2>
          <ul className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
            {dataset.books
              .filter((b) => b.section === section)
              .map((book) => (
                <li key={book.id}>
                  <Link
                    to={`/books/${book.id}`}
                    className="card block h-full p-4 transition-all hover:-translate-y-0.5 hover:border-gold-500 hover:shadow-pop"
                  >
                    <h3 className="font-display text-base font-bold text-ink-900">{book.name}</h3>
                    <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-ink-600">{book.description}</p>
                    <p className="mt-2 text-[11px] text-ink-400">{peopleInBook(book.id).length} דמויות במאגר</p>
                  </Link>
                </li>
              ))}
          </ul>
        </section>
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
        כל הספרים
      </button>

      <header className="card p-6">
        <span className="chip">{sectionLabels[book.section]}</span>
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
