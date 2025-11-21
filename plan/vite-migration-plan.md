# Implementation Plan - Migrating to Vite

This plan outlines the steps to migrate the current Vanilla JS application to use Vite as the build tool and module bundler.

## Goal
Migrate the project from a simple HTTP server setup with global scripts to a modern Vite-based development environment using ES Modules.

## User Review Required
> [!IMPORTANT]
> **Breaking Change**: This migration changes how JavaScript files are loaded. The application will switch from Global Scope (window.App) to ES Modules (import/export).
> **Browser Support**: ES Modules are supported in all modern browsers. Old browsers (IE11) will not be supported without additional polyfills (not included in this plan).

## Proposed Changes

### 1. Dependency Management
#### [MODIFY] [package.json](file:///d:/WebstormProject/puasa-ayyamul-bidh/package.json)
- Add `vite` as `devDependencies`.
- Update scripts:
    - `dev`: `vite`
    - `build`: `vite build`
    - `preview`: `vite preview`

### 2. Configuration
#### [NEW] [vite.config.js](file:///d:/WebstormProject/puasa-ayyamul-bidh/vite.config.js)
- Configure `build.rollupOptions.input` to include all HTML files (MPA setup):
    - `main`: `index.html`
    - `kalender`: `kalender.html`
    - `tracker`: `tracker.html`
    - `jadwal`: `jadwal-shalat.html`
    - `panduan`: `panduan.html`
    - `pengaturan`: `pengaturan.html`

### 3. JavaScript Refactoring (ES Modules)
We need to convert global classes to exported modules.

#### [MODIFY] [js/utils.js](file:///d:/WebstormProject/puasa-ayyamul-bidh/js/utils.js)
- Change `class Utils` to `export class Utils`.
- Remove global instantiation if present.

#### [MODIFY] [js/storage.js](file:///d:/WebstormProject/puasa-ayyamul-bidh/js/storage.js)
- Change `class Storage` to `export class Storage`.

#### [MODIFY] [js/prayer-times.js](file:///d:/WebstormProject/puasa-ayyamul-bidh/js/prayer-times.js)
- Change `class PrayerTimesAPI` to `export class PrayerTimesAPI`.
- Import `Utils` and `Storage` if used.

#### [MODIFY] [js/hijri-calendar.js](file:///d:/WebstormProject/puasa-ayyamul-bidh/js/hijri-calendar.js)
- Change `class HijriCalendar` to `export class HijriCalendar`.

#### [MODIFY] [js/tracker.js](file:///d:/WebstormProject/puasa-ayyamul-bidh/js/tracker.js)
- Change `class FastingTracker` to `export class FastingTracker`.
- Import `Storage` and `Utils`.

#### [MODIFY] [js/app.js](file:///d:/WebstormProject/puasa-ayyamul-bidh/js/app.js)
- Change `class App` to `export class App`.
- Import all required classes: `PrayerTimesAPI`, `HijriCalendar`, `FastingTracker`, `Storage`, `Utils`.
- Remove `window.app = new App()` and `DOMContentLoaded` listener (will be moved to entry point).

#### [NEW] [js/main.js](file:///d:/WebstormProject/puasa-ayyamul-bidh/js/main.js)
- Create a central entry point.
- Import `App` and initialize it.
- Import CSS files here (optional, but good practice in Vite) or keep in HTML.

### 4. HTML Updates
Update all HTML files to use the module system.

#### [MODIFY] HTML Files
- `index.html`
- `kalender.html`
- `tracker.html`
- `jadwal-shalat.html`
- `panduan.html`
- `pengaturan.html`

**Changes:**
- Remove individual `<script src="js/...">` tags.
- Add `<script type="module" src="/js/main.js"></script>` (or specific entry points if logic differs per page).
- *Note*: Since `app.js` currently handles logic for multiple pages (checking elements existence), we can likely use a single entry point `main.js` that initializes `App`.

## Verification Plan

### Automated Tests
- Run `npm run build` to ensure the build process completes without errors.
- Check `dist/` folder for generated assets.

### Manual Verification
- Run `npm run dev`.
- Open each page (`index.html`, `kalender.html`, etc.) in the browser.
- Verify functionality:
    - Dashboard loads data.
    - Navigation works.
    - Settings page works.
    - Tracker works.
- Verify no console errors related to "module not found" or "is not defined".
