import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { preloadRoute } from './routes';

/**
 * Replace the prerendered markup in #root with the React app. The current
 * page's code is fetched first, so the static page is swapped straight for the
 * real one instead of a loading spinner (no layout jump).
 */
export default async function boot(rootEl) {
  try { await preloadRoute(window.location.pathname); } catch { /* render anyway; the route will retry */ }
  createRoot(rootEl).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
