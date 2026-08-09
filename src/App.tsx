import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from './layouts/AppLayout';
import { AppStateProvider } from './hooks/useAppState';
import { HomePage } from './pages/HomePage';
import { TimelinePage } from './pages/TimelinePage';
import { PeoplePage } from './pages/PeoplePage';
import { PeriodDetailPage, PeriodsPage } from './pages/PeriodsPage';
import { EventDetailPage, EventsPage } from './pages/EventsPage';
import { FamiliesPage, FamilyDetailPage } from './pages/FamiliesPage';
import { BookDetailPage, BooksPage } from './pages/BooksPage';
import { SearchPage } from './pages/SearchPage';

export default function App() {
  return (
    <BrowserRouter>
      <AppStateProvider>
        <Routes>
          <Route element={<AppLayout />}>
            <Route index element={<HomePage />} />
            <Route path="timeline" element={<TimelinePage />} />
            <Route path="people" element={<PeoplePage />} />
            <Route path="periods" element={<PeriodsPage />} />
            <Route path="periods/:periodId" element={<PeriodDetailPage />} />
            <Route path="events" element={<EventsPage />} />
            <Route path="events/:eventId" element={<EventDetailPage />} />
            <Route path="families" element={<FamiliesPage />} />
            <Route path="families/:familyId" element={<FamilyDetailPage />} />
            <Route path="books" element={<BooksPage />} />
            <Route path="books/:bookId" element={<BookDetailPage />} />
            <Route path="search" element={<SearchPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </AppStateProvider>
    </BrowserRouter>
  );
}
