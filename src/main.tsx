import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// פונטים מקומיים — בלי תלות ב-CDN חיצוני, וכדי שהטיפוגרפיה תעבוד גם אופליין
import '@fontsource/assistant/300.css';
import '@fontsource/assistant/400.css';
import '@fontsource/assistant/500.css';
import '@fontsource/assistant/600.css';
import '@fontsource/assistant/700.css';
import '@fontsource/frank-ruhl-libre/500.css';
import '@fontsource/frank-ruhl-libre/700.css';
import '@fontsource/frank-ruhl-libre/900.css';

import './styles/index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
