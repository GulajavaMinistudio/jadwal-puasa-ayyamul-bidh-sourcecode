---
goal: Migrate Puasa Ayyamul Bidh Application to Vite Build System with Legacy Browser Support
version: 1.0
date_created: 2025-11-21
last_updated: 2025-11-21
owner: Gulajava Ministudio
status: 'Planned'
tags: [infrastructure, migration, vite, build-tools, es-modules]
---

# Introduction

![Status: Planned](https://img.shields.io/badge/status-Planned-blue)

This implementation plan outlines the migration of the Puasa Ayyamul Bidh web application from a vanilla JavaScript setup with global scope patterns to a modern Vite-based development environment using ES Modules. The migration will be executed in three distinct phases to minimize risk and ensure backward compatibility with legacy browsers while maintaining CDN-based external dependencies.

## 1. Requirements & Constraints

### Requirements

- **REQ-001**: Maintain CDN-based dependencies (Bootstrap 5.3.8, Bootstrap Icons, Google Fonts) - no bundling of external libraries
- **REQ-002**: Support legacy browsers (IE11) through transpilation and polyfills
- **REQ-003**: Convert all JavaScript files from Global Scope pattern to ES Modules (`import`/`export`)
- **REQ-004**: Configure Vite for Multi-Page Application (MPA) with 6 HTML entry points
- **REQ-005**: Preserve all existing functionality during migration - zero feature regression
- **REQ-006**: Generate both modern (`type="module"`) and legacy (`nomodule`) bundles for optimal performance

### Constraints

- **CON-001**: Team is familiar with ES Modules - no training required
- **CON-002**: Testing will be manual only - no automated test infrastructure available
- **CON-003**: Migration must be executed in phases - no big-bang deployment
- **CON-004**: Development server must remain functional during migration for testing
- **CON-005**: Existing `localStorage` data must remain accessible and compatible

### Guidelines

- **GUD-001**: Follow Vite official documentation for configuration best practices
- **GUD-002**: Maintain code readability during refactoring - avoid clever optimizations
- **GUD-003**: Test each phase completion before proceeding to next phase
- **GUD-004**: Document breaking changes and rollback procedures for each phase

### Patterns to Follow

- **PAT-001**: Use named exports for all classes and utilities (`export class ClassName`)
- **PAT-002**: Create single entry point per HTML page (`main.js` pattern)
- **PAT-003**: Keep CDN dependencies in HTML `<head>` - exclude from bundle
- **PAT-004**: Use `@vitejs/plugin-legacy` for legacy browser transpilation

## 2. Implementation Steps

### Phase 1: Foundation & Infrastructure Setup

**GOAL-001**: Establish Vite build infrastructure without modifying existing JavaScript code

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-001 | Install Vite as devDependency: `npm install -D vite` | ✅ | 2025-11-21 |
| TASK-002 | Install legacy plugin: `npm install -D @vitejs/plugin-legacy terser` | ✅ | 2025-11-21 |
| TASK-003 | Create `vite.config.js` in project root with MPA configuration for 6 HTML files (`index.html`, `kalender.html`, `tracker.html`, `jadwal-shalat.html`, `panduan.html`, `pengaturan.html`) | ✅ | 2025-11-21 |
| TASK-004 | Update `package.json` scripts: `"dev": "vite"`, `"build": "vite build"`, `"preview": "vite preview"` | ✅ | 2025-11-21 |
| TASK-005 | Test dev server startup: `npm run dev` - verify all 6 pages load without errors | ✅ | 2025-11-21 |
| TASK-006 | Create backup branch in git: `git checkout -b backup/pre-vite-migration` | ✅ | 2025-11-21 |

**Acceptance Criteria for Phase 1:**
- ✅ Vite dev server runs successfully on all 6 HTML pages
- ✅ No console errors related to Vite configuration
- ✅ CDN resources (Bootstrap, Icons, Fonts) still load from external sources
- ✅ Git backup branch created for rollback safety

---

### Phase 2A: Refactor Utility Modules

**GOAL-002**: Convert foundational utility modules (`storage.js`, `utils.js`) to ES Modules

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-007 | Refactor `js/storage.js`: Change `class Storage` to `export class Storage`, remove any global assignments | | |
| TASK-008 | Refactor `js/utils.js`: Change `class Utils` to `export class Utils`, ensure `showToast` and `sanitizeHTML` are accessible | | |
| TASK-009 | Test utility modules in isolation: create temporary test file importing both modules | | |
| TASK-010 | Verify no breaking changes in browser DevTools console | | |

**Acceptance Criteria for Phase 2A:**
- ✅ `storage.js` and `utils.js` successfully export classes
- ✅ No global scope pollution (verify `window.Storage` and `window.Utils` are undefined)
- ✅ Modules can be imported in test environment without errors

---

### Phase 2B: Refactor API & Domain Modules

**GOAL-003**: Convert API and domain logic modules to ES Modules with proper imports

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-011 | Refactor `js/prayer-times.js`: Change `class PrayerTimesAPI` to `export class PrayerTimesAPI`, add `import { Storage } from './storage.js'` if used | | |
| TASK-012 | Refactor `js/hijri-calendar.js`: Change `class HijriCalendar` to `export class HijriCalendar` | | |
| TASK-013 | Refactor `js/tracker.js`: Change `class FastingTracker` to `export class FastingTracker`, add imports for `Storage` and `Utils` | | |
| TASK-014 | Test each module import chain: verify dependencies resolve correctly | | |

**Acceptance Criteria for Phase 2B:**
- ✅ All API modules export classes correctly
- ✅ Import statements resolve without errors
- ✅ No circular dependency warnings in console

---

### Phase 2C: Refactor Main Application & Entry Point

**GOAL-004**: Convert main application controller and create module entry point

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-015 | Refactor `js/app.js`: Change `class App` to `export class App`, add all required imports (`PrayerTimesAPI`, `HijriCalendar`, `FastingTracker`, `Storage`, `Utils`) | | |
| TASK-016 | Remove `window.app = new App()` and `DOMContentLoaded` listener from `app.js` | | |
| TASK-017 | Create `js/main.js`: Import `App`, instantiate, and call `init()` on `DOMContentLoaded` | | |
| TASK-018 | Verify module dependency graph is acyclic and correct | | |

**Acceptance Criteria for Phase 2C:**
- ✅ `app.js` cleanly exports `App` class
- ✅ `main.js` successfully imports and initializes application
- ✅ Application logic remains unchanged

---

### Phase 2D: Update HTML Entry Points

**GOAL-005**: Update all HTML files to use module-based script loading

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-019 | Update `index.html`: Remove all individual `<script src="js/...">` tags, add `<script type="module" src="/js/main.js"></script>` before closing `</body>` | | |
| TASK-020 | Update `kalender.html`: Apply same script tag changes as `index.html` | | |
| TASK-021 | Update `tracker.html`: Apply same script tag changes | | |
| TASK-022 | Update `jadwal-shalat.html`: Apply same script tag changes | | |
| TASK-023 | Update `panduan.html`: Apply same script tag changes | | |
| TASK-024 | Update `pengaturan.html`: Apply same script tag changes | | |
| TASK-025 | Verify CDN `<link>` and `<script>` tags for Bootstrap/Icons remain in `<head>` | | |

**Acceptance Criteria for Phase 2D:**
- ✅ All 6 HTML files load single `main.js` module entry point
- ✅ No `<script>` tag duplication or conflicts
- ✅ CDN dependencies still load from external sources
- ✅ Browser DevTools Network tab shows module loading correctly

---

### Phase 3: Testing, Build, & Deployment

**GOAL-006**: Validate migration through comprehensive manual testing and production build

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-026 | Manual test `index.html`: Verify dashboard loads prayer times, Hijri date, and Ayyamul Bidh info | | |
| TASK-027 | Manual test `kalender.html`: Verify calendar displays correctly | | |
| TASK-028 | Manual test `tracker.html`: Verify fasting tracker CRUD operations work | | |
| TASK-029 | Manual test `jadwal-shalat.html`: Verify prayer schedule displays | | |
| TASK-030 | Manual test `panduan.html`: Verify static content loads | | |
| TASK-031 | Manual test `pengaturan.html`: Verify settings (location, method) save/load from localStorage | | |
| TASK-032 | Test navigation: Verify all inter-page links work correctly | | |
| TASK-033 | Run production build: `npm run build`, inspect `dist/` folder output | | |
| TASK-034 | Test production build locally: `npm run preview`, verify all pages work | | |
| TASK-035 | Test legacy browser compatibility: Open preview in IE11 (or BrowserStack), verify polyfills load and app functions | | |
| TASK-036 | Deploy to hosting platform (GitHub Pages / Netlify / Vercel) | | |
| TASK-037 | Post-deployment smoke test: Verify all 6 pages in production environment | | |

**Acceptance Criteria for Phase 3:**
- ✅ All 6 pages function correctly in modern browsers (Chrome, Firefox, Safari, Edge)
- ✅ All 6 pages function correctly in IE11 with legacy bundle
- ✅ Production build completes without errors
- ✅ No console errors in both modern and legacy browsers
- ✅ localStorage data persists across migration
- ✅ Application successfully deployed to hosting platform

## 3. Alternatives

- **ALT-001**: Use Webpack instead of Vite
  - **Rejected**: Vite offers faster dev server with native ES Modules support and simpler configuration for MPA setup. Webpack requires more complex config for same outcome.

- **ALT-002**: Bundle Bootstrap CSS/JS instead of keeping CDN
  - **Rejected**: User requirement (REQ-001) explicitly requires maintaining CDN dependencies to minimize bundle size and leverage browser caching.

- **ALT-003**: Skip legacy browser support
  - **Rejected**: User requirement (REQ-002) mandates IE11 support for broader audience reach.

- **ALT-004**: Big-bang migration (all phases at once)
  - **Rejected**: User constraint (CON-003) requires phased approach to minimize risk and enable incremental testing.

- **ALT-005**: Use TypeScript for migration
  - **Rejected**: No explicit requirement for TypeScript. Team is familiar with ES Modules but TypeScript would add unnecessary complexity for this migration scope.

## 4. Dependencies

### New Dependencies (Production)
- None (all external dependencies remain CDN-based)

### New Dependencies (Development)
- **DEP-001**: `vite` (^5.0.0) - Build tool and dev server
- **DEP-002**: `@vitejs/plugin-legacy` (^5.0.0) - Legacy browser support plugin
- **DEP-003**: `terser` (^5.0.0) - JavaScript minifier (required by legacy plugin)

### Existing Dependencies (CDN - No Change)
- **DEP-004**: Bootstrap 5.3.8 (CSS Framework)
- **DEP-005**: Bootstrap Icons (Icon library)
- **DEP-006**: Google Fonts (Typography)

### External APIs (No Change)
- **DEP-007**: Aladhan API (Prayer times data)
- **DEP-008**: Browser Geolocation API (Location detection)

## 5. Files

### New Files
- **FILE-001**: `vite.config.js` - Vite configuration with MPA and legacy plugin setup
- **FILE-002**: `js/main.js` - Module entry point for application initialization

### Modified Files
- **FILE-003**: `package.json` - Add Vite dependencies and build scripts
- **FILE-004**: `js/storage.js` - Convert to ES Module with `export class Storage`
- **FILE-005**: `js/utils.js` - Convert to ES Module with `export class Utils`
- **FILE-006**: `js/prayer-times.js` - Convert to ES Module with imports and export
- **FILE-007**: `js/hijri-calendar.js` - Convert to ES Module with export
- **FILE-008**: `js/tracker.js` - Convert to ES Module with imports and export
- **FILE-009**: `js/app.js` - Convert to ES Module with all imports and export
- **FILE-010**: `index.html` - Replace script tags with module entry point
- **FILE-011**: `kalender.html` - Replace script tags with module entry point
- **FILE-012**: `tracker.html` - Replace script tags with module entry point
- **FILE-013**: `jadwal-shalat.html` - Replace script tags with module entry point
- **FILE-014**: `panduan.html` - Replace script tags with module entry point
- **FILE-015**: `pengaturan.html` - Replace script tags with module entry point

### Generated Files (Build Output)
- **FILE-016**: `dist/` directory - Production build output with chunked JS and HTML files

## 6. Testing

### Manual Testing Checklist

- **TEST-001**: Dev Server Functionality
  - Start dev server: `npm run dev`
  - Verify hot module replacement (HMR) works on code changes
  - Check console for any module resolution errors

- **TEST-002**: Dashboard Page (`index.html`)
  - Prayer times display correctly
  - Hijri date displays with proper formatting
  - Ayyamul Bidh indicator shows correct status
  - Setup wizard appears on first visit
  - Auto-update intervals function correctly

- **TEST-003**: Calendar Page (`kalender.html`)
  - Calendar grid renders for current month
  - Ayyamul Bidh dates highlighted (13th, 14th, 15th)
  - Month navigation works

- **TEST-004**: Tracker Page (`tracker.html`)
  - Fasting records display from localStorage
  - Add new fasting record works
  - Delete record works
  - Statistics calculate correctly

- **TEST-005**: Prayer Schedule Page (`jadwal-shalat.html`)
  - All prayer times listed correctly
  - Data reflects user's configured location

- **TEST-006**: Guide Page (`panduan.html`)
  - Static content loads without errors

- **TEST-007**: Settings Page (`pengaturan.html`)
  - Location auto-detect works (Geolocation API)
  - Manual location selection saves to localStorage
  - Prayer calculation method selection persists
  - Data export/import functions work
  - Reset data clears localStorage correctly

- **TEST-008**: Cross-Page Navigation
  - All navbar links navigate correctly
  - Browser back/forward buttons work
  - No 404 errors on page transitions

- **TEST-009**: Production Build
  - Build completes: `npm run build`
  - No build errors or warnings
  - `dist/` folder contains all assets
  - File sizes reasonable (JS bundles < 100KB total)

- **TEST-010**: Legacy Browser Compatibility
  - Load production preview in IE11 or BrowserStack
  - Verify nomodule script loads
  - Check all features function (polyfills working)
  - No console errors related to unsupported syntax

- **TEST-011**: Performance Validation
  - Lighthouse score remains good (>90 performance)
  - First Contentful Paint < 2s
  - Time to Interactive < 3.5s

## 7. Risks & Assumptions

### Risks

- **RISK-001**: Module refactoring introduces runtime errors due to scope changes
  - **Likelihood**: Medium
  - **Impact**: High
  - **Mitigation**: Execute migration in small phases with thorough manual testing after each step. Maintain git backup branch for rollback.

- **RISK-002**: Legacy plugin increases bundle size significantly
  - **Likelihood**: Medium
  - **Impact**: Medium
  - **Mitigation**: Monitor bundle size during build. Vite's code-splitting should generate separate modern/legacy bundles. Modern browsers won't download legacy code.

- **RISK-003**: CDN dependencies conflict with module loading
  - **Likelihood**: Low
  - **Impact**: Medium
  - **Mitigation**: Bootstrap is UMD-compatible and attaches to global scope. No conflict expected. Test early in Phase 1.

- **RISK-004**: localStorage data corruption during migration
  - **Likelihood**: Low
  - **Impact**: High
  - **Mitigation**: Storage module interface remains unchanged. Data format stays identical. Test thoroughly in Phase 2A.

- **RISK-005**: IE11 polyfills fail to load or execute
  - **Likelihood**: Low
  - **Impact**: High
  - **Mitigation**: Use official `@vitejs/plugin-legacy` which is battle-tested. Verify polyfill loading in TEST-010.

- **RISK-006**: Deployment platform doesn't support MPA routing
  - **Likelihood**: Low
  - **Impact**: Medium
  - **Mitigation**: GitHub Pages, Netlify, and Vercel all support MPA. Configure proper build output structure matching platform requirements.

### Assumptions

- **ASSUMPTION-001**: Current codebase has no circular dependencies between modules
  - **Validation**: Code review confirms linear dependency chain: `storage.js/utils.js` → API modules → `app.js` → `main.js`

- **ASSUMPTION-002**: All JavaScript files are already strict mode compatible
  - **Validation**: ES Modules enforce strict mode automatically. No legacy code issues expected.

- **ASSUMPTION-003**: Users have modern browsers OR IE11 (no IE10 or lower)
  - **Validation**: Confirmed with user requirement (REQ-002). No support needed for IE10-.

- **ASSUMPTION-004**: Team has access to IE11 testing environment or BrowserStack account
  - **Validation**: Required for TEST-010. Confirm availability before Phase 3.

- **ASSUMPTION-005**: CDN resources (Bootstrap, Icons, Fonts) remain stable and available
  - **Validation**: Using specific version (5.3.8) from reliable CDN (jsDelivr/cdnjs). Very low risk of breaking changes.

- **ASSUMPTION-006**: No automated tests exist that would break during migration
  - **Validation**: User confirmed manual testing only (REQ-004). No test suite to maintain.

## 8. Related Specifications / Further Reading

- [Vite Official Documentation](https://vite.dev/guide/)
- [Vite Multi-Page App Configuration](https://vite.dev/guide/build.html#multi-page-app)
- [@vitejs/plugin-legacy Documentation](https://github.com/vitejs/vite/tree/main/packages/plugin-legacy)
- [ES Modules Browser Compatibility](https://caniuse.com/es6-module)
- [MDN: JavaScript Modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)
- [Bootstrap 5 CDN Integration](https://getbootstrap.com/docs/5.3/getting-started/introduction/)
- Previous Planning Document: [vite-migration-plan.md](file:///d:/WebstormProject/puasa-ayyamul-bidh/plan/vite-migration-plan.md)
