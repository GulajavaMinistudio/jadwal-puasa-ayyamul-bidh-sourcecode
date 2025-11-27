/**
 * Main Entry Point
 * Module entry point untuk aplikasi Puasa Ayyamul Bidh
 */

import { App } from "./app.js";

// Initialize app when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  const app = new App();
  app.init();

  // Store app instance globally for debugging (development only)
  if (import.meta.env?.DEV) {
    window.app = app;
  }
});

// Auto-update copyright year in footer
document.addEventListener("DOMContentLoaded", () => {
  const yearElement = document.getElementById("currentYear");
  if (yearElement) {
    const currentYear = new Date().getFullYear();
    yearElement.textContent = currentYear;
  }
});

// Cleanup on page unload (Priority 1: Memory leak prevention)
window.addEventListener("beforeunload", () => {
  if (window.app) {
    window.app.destroy();
  }
});
