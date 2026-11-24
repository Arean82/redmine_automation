import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

function mount() {
  const el = document.getElementById('my-plugin-root');
  if (el) {
    createRoot(el).render(<App />);
  }
}

// Mount immediately if the document is already loaded, otherwise wait.
// This avoids missing the editor when the script runs after DOMContentLoaded.
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mount, { once: true });
} else {
  mount();
}
