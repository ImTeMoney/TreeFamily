import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ArrowRight, TreeDeciduous } from 'lucide-react';
import { dataset } from '../data/repository';
import { FamilyTree } from '../components/FamilyTree';
import { PersonCard } from '../components/PersonCard';
import { SourceList } from '../components/SourceList';

export function FamiliesPage() {
  return (
    <div className="space-y-5">
      <header>
        <h1 className="section-title">משפחות</h1>
        <p className="text-sm text-ink-600">
          אשכולות משפחתיים בתנ״ך. בחרו משפחה כדי לראות את העץ, ולחצו על כל דמות לפתיחת הכרטיס שלה.
        </p>
      </header>

      <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {dataset.families.map((family) => (
          <li key={family.id}>
            <Link
              to={`/families/${family.id}`}
              className="card group flex h-full flex-col gap-2 p-5 transition-all hover:-translate-y-0.5 hover:border-gold-500 hover:shadow-pop"
            >
              <TreeDeciduous className="h-5 w-5 text-gold-600" aria-hidden />
              <h2 className="font-display text-xl font-bold text-ink-900 group-hover:text-ink-700">{family.name}</h2>
              <p className="flex-1 text-sm leading-relaxed text-ink-600">{family.description}</p>
              <span className="text-xs text-ink-400">{family.personIds.length} דמויות</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function FamilyDetailPage() {
  const { familyId } = useParams();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const family = familyId ? dataset.familyById.get(familyId) : undefined;

  if (!family) {
    return (
      <div className="card p-8 text-center">
        <p className="text-ink-600">המשפחה לא נמצאה.</p>
        <Link to="/families" className="btn-secondary mt-4">
          לרשימת המשפחות
        </Link>
      </div>
    );
  }

  const members = family.personIds.map((id) => dataset.peopleById.get(id)).filter(Boolean);

  return (
    <div className="space-y-6">
      <button type="button" onClick={() => navigate('/families')} className="btn-ghost text-sm">
        <ArrowRight className="h-4 w-4" />
        כל המשפחות
      </button>

      <header className="card p-6">
        <h1 className="font-display text-3xl font-bold text-ink-900">{family.name}</h1>
        <p className="mt-2 max-w-3xl leading-relaxed text-ink-600">{family.description}</p>
        {family.aliases.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {family.aliases.map((alias) => (
              <span key={alias} className="chip">
                {alias}
              </span>
            ))}
          </div>
        )}
        <div className="mt-4">
          <h2 className="mb-1.5 text-xs font-bold uppercase tracking-wide text-ink-400">מקורות</h2>
          <SourceList sources={family.sources} />
        </div>
      </header>

      <FamilyTree family={family} focusPersonId={params.get('focus')} />

      <section>
        <h2 className="section-title mb-3">בני המשפחה</h2>
        <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
          {members.map((person) => person && <PersonCard key={person.id} person={person} compact />)}
        </div>
      </section>
    </div>
  );
}
