import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// ── Cache versioning: bump this string whenever seed data changes ────────────
const CACHE_VERSION = 'v4';
if (localStorage.getItem('sis_cache_version') !== CACHE_VERSION) {
  // Clear all collection caches so fresh seed data is loaded
  Object.keys(localStorage)
    .filter(k => k.startsWith('sis_col_'))
    .forEach(k => localStorage.removeItem(k));
  localStorage.setItem('sis_cache_version', CACHE_VERSION);
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
