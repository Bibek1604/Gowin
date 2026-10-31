// Self-hosted fonts (Latin subset, only the weights in use): no render-blocking third-party CSS.
import '@fontsource/dm-sans/latin-400.css';
import '@fontsource/dm-sans/latin-500.css';
import '@fontsource/dm-sans/latin-600.css';
import '@fontsource/dm-sans/latin-700.css';
import '@fontsource/plus-jakarta-sans/latin-500.css';
import '@fontsource/plus-jakarta-sans/latin-700.css';
import '@fontsource/plus-jakarta-sans/latin-800.css';
import './index.css';

const rootEl = document.getElementById('root');

// The app is imported dynamically: the browser still downloads it straight away
// (modulepreload), but evaluating ~300 kB of JavaScript no longer blocks the
// first frames, so the prerendered page (scripts/prerender.mjs) and its hero
// photo paint first. The static page is fully usable meanwhile (plain links).
const mount = () => import('./boot.jsx').then(({ default: boot }) => boot(rootEl));

const hero = rootEl.querySelector('img[fetchpriority="high"]');
if (!hero) {
  mount();
} else {
  let started = false;
  // two frames after the photo is ready, so it is actually painted
  const start = () => { if (!started) { started = true; requestAnimationFrame(() => requestAnimationFrame(() => setTimeout(mount, 0))); } };
  if (hero.complete) start();
  else {
    hero.addEventListener('load', start, { once: true });
    hero.addEventListener('error', start, { once: true });
    setTimeout(start, 2500); // never wait longer than this
  }
}
