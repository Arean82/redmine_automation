import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

document.addEventListener('DOMContentLoaded', () => {
  const el = document.getElementById('my-plugin-root');
  if (!el) return;

  createRoot(el).render(<App />);
});
