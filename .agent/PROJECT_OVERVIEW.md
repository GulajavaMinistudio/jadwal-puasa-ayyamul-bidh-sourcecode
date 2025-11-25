# Project Overview - Puasa Ayyamul Bidh Tracker

**AI Agent Context**: This file provides essential project context for AI coding assistants.

---

## 🎯 Project Purpose

Web application untuk tracking puasa Ayyamul Bidh (puasa sunnah tanggal 13, 14, 15 Hijriyah setiap bulan) dengan fitur:
- Kalender Hijriyah
- Jadwal waktu sholat
- Tracking puasa dengan statistik
- Countdown ke Ayyamul Bidh berikutnya

**Target Users**: Muslim Indonesia yang ingin konsisten menjalankan puasa Ayyamul Bidh

---

## 🏗️ Tech Stack

### Core Technologies
- **HTML5** - Structure
- **CSS3 + Bootstrap 5** - Styling & responsive design
- **Vanilla JavaScript (ES6 Modules)** - Logic & functionality
- **NO build tools** - Direct browser execution
- **NO frameworks** - Pure vanilla JS for simplicity

### Data & APIs
- **localStorage** - Client-side data persistence (validated & sanitized)
- **Aladhan API** - Prayer times & Hijri calendar conversion
- **Geolocation API** - Auto-detect user location

### Development
- **Vite** - Dev server only (not for build)
- **npm** - Package management for dev tools only

---

## 📂 Project Structure

```
puasa-ayyamul-bidh/
├── .agent/                    # AI agent documentation (THIS FOLDER)
│   ├── PROJECT_OVERVIEW.md    # This file
│   ├── SECURITY_GUIDELINES.md # Security rules & best practices
│   ├── CODING_STANDARDS.md    # Code style conventions
│   └── workflows/             # Automation workflows
├── js/                        # JavaScript modules
│   ├── config.js             # Constants & configuration
│   ├── validators.js         # Validation & sanitization
│   ├── storage.js            # localStorage management
│   ├── app.js                # Main application controller
│   ├── prayer-times.js       # Prayer times API integration
│   ├── hijri-calendar.js     # Hijri calendar logic
│   ├── tracker.js            # Fasting tracker
│   ├── utils.js              # Helper functions
│   └── main.js               # Entry point
├── css/                       # Stylesheets
├── assets/                    # Images & static files
├── plan/                      # Planning documents
└── *.html                     # HTML pages
```

---

## 🧩 Module Architecture

### Core Modules

#### 1. **config.js** ⚙️
- Centralized constants & configuration
- NO magic numbers allowed
- Time constants, API config, validation limits

#### 2. **validators.js** 🛡️
- Schema validation for all external data
- Input sanitization (XSS prevention)
- Prototype pollution protection
- Deep cloning utilities

#### 3. **storage.js** 💾
- localStorage wrapper with validation
- Automatic data validation on read
- Cache management with timestamps
- Import/export functionality

#### 4. **app.js** 🎮
- Main application controller
- Coordinates all modules
- Manages app lifecycle
- Handles setup wizard

#### 5. **prayer-times.js** 🕌
- Aladhan API integration
- Prayer times calculation
- Caching with validation
- Next prayer countdown

#### 6. **hijri-calendar.js** 📅
- Gregorian ↔ Hijri conversion
- Ayyamul Bidh date calculation
- Calendar generation

#### 7. **tracker.js** 📊
- Fasting data management
- Statistics calculation
- Streak tracking
- History management

#### 8. **utils.js** 🔧
- Date/time formatting
- Toast notifications
- Debounce/throttle
- General utilities

---

## 🔄 Data Flow

```
User Input → Validation → Processing → Storage → UI Update
     ↓           ↓            ↓           ↓          ↓
  Sanitize  → Schema   → Business  → Validated → Safe
              Check      Logic       Write      Render
```

### Key Principles
1. **Validate everything** - All external data (API, localStorage, user input)
2. **Sanitize always** - Use `Validators.sanitizeString()` for display
3. **Use constants** - Import from `Config`, never hardcode
4. **Cache smartly** - Validate cache age before use
5. **Handle errors gracefully** - Try-catch with user feedback

---

## 🔐 Security Model

### Implemented Protections
- ✅ XSS Prevention (sanitization + textContent)
- ✅ Prototype Pollution Protection (deep cloning)
- ✅ localStorage Injection Prevention (schema validation)
- ✅ API Response Validation (type checking)
- ✅ Input Sanitization (HTML escaping)

### Security Score: **8.5/10** 🎯

---

## 📦 Dependencies

### Runtime (None!)
- No runtime dependencies
- Pure vanilla JavaScript
- All modules are self-contained

### Development Only
```json
{
  "vite": "Dev server",
  "http-server": "Alternative dev server"
}
```

---

## 🚀 Quick Start

```bash
# Install dev dependencies
npm install

# Run dev server
npm run dev

# Open browser
# http://localhost:5173
```

---

## 🎨 UI/UX Principles

1. **Mobile-first** - Responsive design from smallest screen
2. **Accessible** - Semantic HTML, ARIA labels
3. **Fast** - Cached data, minimal API calls
4. **Offline-capable** - Works with cached data
5. **Clean** - Bootstrap for consistency

---

## 📝 Key Conventions

### File Naming
- `kebab-case.js` for files
- `PascalCase` for classes
- `camelCase` for functions/variables

### Module Exports
```javascript
// Classes - named export
export class ClassName { }

// Objects - named export
export const ObjectName = { }

// Functions - named export
export function functionName() { }
```

### Imports Order
```javascript
// 1. Internal modules
import { Config } from "./config.js";
import { Validators } from "./validators.js";

// 2. Feature modules
import { PrayerTimesAPI } from "./prayer-times.js";

// 3. Utils (last)
import { Utils } from "./utils.js";
```

---

## 🧪 Testing Strategy

### Current State
- ⚠️ No automated tests yet
- ✅ Manual testing procedures documented

### Future Plans
- Unit tests for `validators.js`
- Integration tests for API calls
- E2E tests for user flows

---

## 🔄 Recent Changes (2025-11-25)

### Security Fixes ✅
- Implemented comprehensive validation system
- Fixed XSS, prototype pollution, localStorage injection
- Created `config.js` and `validators.js` modules

### Code Quality ✅
- Eliminated magic numbers
- Reduced code duplication
- Improved error handling

See: `plan/implementation-summary.md` for details

---

## 💡 AI Agent Tips

### When Adding Features
1. Check if validation is needed → use `validators.js`
2. Check for constants → use `config.js`
3. Check for similar code → create reusable function
4. Update this documentation if architecture changes

### Before Committing
1. No magic numbers (use `Config`)
2. All external data validated
3. Error handling in place
4. JSDoc comments added
5. No debug code (`console.log`, `window.app`)

### Common Patterns
```javascript
// ✅ GOOD - With validation
const data = await api.getData();
const validation = Validators.validateData(data);
if (!validation.valid) throw new Error(validation.error);
return validation.data;

// ❌ BAD - Direct use
const data = await api.getData();
return data; // No validation!
```

---

## 📚 Related Documentation

- `SECURITY_GUIDELINES.md` - Security rules & best practices
- `CODING_STANDARDS.md` - Code style & conventions
- `../README.md` - User-facing documentation
- `../plan/code-review-report.md` - Code review findings
- `../plan/implementation-summary.md` - Recent changes

---

**Last Updated**: 2025-11-25
