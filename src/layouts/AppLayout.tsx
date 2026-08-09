import { useEffect } from 'react';
import { NavLink, Outlet, Link, useLocation } from 'react-router-dom';
import {
  BookOpen,
  CalendarDays,
  Home,
  Hourglass,
  ScrollText,
  Search,
  Swords,
  TreeDeciduous,
  Users,
} from 'lucide-react';
import { SearchBar } from '../components/SearchBar';
import { PersonDrawer } from '../components/PersonDrawer';
import { CorpusSwitch } from '../components/CorpusSwitch';
import { cn } from '../utils/cn';

const navItems = [
  { to: '/', label: 'ראשי', icon: Home, end: true },
  { to: '/timeline', label: 'ציר הזמן', icon: Hourglass, end: false },
  { to: '/people', label: 'דמויות', icon: Users, end: false },
  { to: '/families', label: 'משפחות', icon: TreeDeciduous, end: false },
  { to: '/periods', label: 'תקופות', icon: CalendarDays, end: false },
  { to: '/events', label: 'אירועים', icon: Swords, end: false },
  { to: '/books', label: 'ספרייה', icon: BookOpen, end: false },
];

const mobileNav = navItems.filter((item) => ['/', '/timeline', '/people', '/periods', '/families'].includes(item.to));

export function AppLayout() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [pathname]);

  return (
    <div className="min-h-full">
      <header className="sticky top-0 z-30 border-b border-parchment-200 bg-parchment-50/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-[110rem] items-center gap-4 px-4 py-3 lg:px-6">
          <Link to="/" className="group flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-ink-800 text-parchment-50 shadow-card transition-transform group-hover:scale-105">
              <ScrollText className="h-5 w-5" aria-hidden />
            </span>
            <span className="leading-tight">
              <span className="block font-display text-lg font-bold text-ink-900">מפת המקורות</span>
              <span className="block text-[11px] text-ink-400">מי חי בתקופה של מי?</span>
            </span>
          </Link>

          <CorpusSwitch className="hidden sm:flex" />

          <div className="mr-auto flex flex-1 items-center justify-end gap-2">
            <SearchBar className="hidden w-full max-w-sm md:block" />
            <nav className="hidden items-center gap-1 lg:flex">
              {[
                { to: '/periods', label: 'תקופות' },
                { to: '/people', label: 'דמויות' },
                { to: '/families', label: 'משפחות' },
                { to: '/events', label: 'אירועים' },
              ].map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    cn('btn-ghost text-sm', isActive && 'bg-parchment-100 text-ink-900')
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
            <Link to="/search" className="btn-secondary md:hidden" aria-label="חיפוש">
              <Search className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-[110rem] gap-6 px-4 py-6 lg:px-6">
        <aside className="sticky top-24 hidden h-fit w-56 shrink-0 lg:block">
          <nav className="card p-2">
            <ul className="space-y-0.5">
              {navItems.map(({ to, label, icon: Icon, end }) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    end={end}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium transition-colors',
                        isActive ? 'bg-ink-800 text-parchment-50' : 'text-ink-700 hover:bg-parchment-100',
                      )
                    }
                  >
                    <Icon className="h-4 w-4" aria-hidden />
                    {label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
          <p className="mt-3 px-3 text-[11px] leading-relaxed text-ink-400">
            המידע מבוסס על הכתוב בתנ״ך ובמשנה. תאריכים היסטוריים אינם מוצגים — הציר סכמטי ומציג סדר וחפיפה.
          </p>
        </aside>

        <main className="min-w-0 flex-1 pb-24 lg:pb-6">
          <CorpusSwitch className="mb-4 w-fit sm:hidden" />
          <Outlet />
        </main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-parchment-200 bg-parchment-50/95 backdrop-blur-md lg:hidden">
        <ul className="flex">
          {mobileNav.map(({ to, label, icon: Icon, end }) => (
            <li key={to} className="flex-1">
              <NavLink
                to={to}
                end={end}
                className={({ isActive }) =>
                  cn(
                    'flex flex-col items-center gap-0.5 py-2 text-[11px] font-medium transition-colors',
                    isActive ? 'text-ink-900' : 'text-ink-400',
                  )
                }
              >
                <Icon className="h-5 w-5" aria-hidden />
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <PersonDrawer />
    </div>
  );
}
