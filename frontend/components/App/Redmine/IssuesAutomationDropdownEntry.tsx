import React from 'react';
import { createRoot } from 'react-dom/client';

// Entry point for the issues dropdown bundle (issues_dropdown_bundle.js).
// This is a placeholder shell; the dropdown UI will be implemented in a later milestone.
document.addEventListener('DOMContentLoaded', () => {
  const els = document.querySelectorAll('[data-automation-dropdown-root]');
  els.forEach((el) => {
    createRoot(el).render(<span />);
  });
});
