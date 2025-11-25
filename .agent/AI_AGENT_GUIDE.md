# AI Agent Guide - Quick Reference

**For AI Coding Assistants**: This is your quick reference guide for this project.

---

## 🤖 About This Project

**Name**: Puasa Ayyamul Bidh Tracker  
**Type**: Web Application (Vanilla JS, no build tools)  
**Purpose**: Track Islamic fasting days (13th, 14th, 15th of each Hijri month)

---

## ⚡ Quick Facts

### Tech Stack
- Vanilla JavaScript (ES6 Modules)
- Bootstrap 5 (UI only)
- NO frameworks, NO build process
- Direct browser execution

### Key Modules
- `config.js` - All constants (USE THIS, NO magic numbers!)
- `validators.js` - Validation & sanitization (ALWAYS validate!)
- `storage.js` - localStorage wrapper (NEVER use localStorage directly!)
- `app.js`, `prayer-times.js`, `hijri-calendar.js`, `tracker.js`, `utils.js`

---

## 🔐 Critical Security Rules

### 1. ALWAYS Validate External Data
```javascript
// ✅ DO THIS
const validation = Validators.validateApiData(data);
if (!validation.valid) throw new Error(validation.error);
use(validation.data);

// ❌ NEVER THIS
use(data); // Dangerous!
```

### 2. ALWAYS Use Config Constants
```javascript
// ✅ DO THIS
setTimeout(fn, Config.INTERVALS.MINUTE);
Storage.get(Config.STORAGE_KEYS.APP_CONFIG);

// ❌ NEVER THIS
setTimeout(fn, 60000); // Magic number!
Storage.get("app_config"); // Hardcoded!
```

### 3. ALWAYS Sanitize for Display
```javascript
// ✅ DO THIS
element.textContent = Validators.sanitizeString(data);

// ❌ NEVER THIS
element.innerHTML = data; // XSS risk!
```

### 4. NEVER Use Direct localStorage
```javascript
// ✅ DO THIS
const data = Storage.get(Config.STORAGE_KEYS.APP_CONFIG);

// ❌ NEVER THIS
const data = JSON.parse(localStorage.getItem("app_config"));
```

---

## 📋 Before You Code

### Ask Yourself:
1. ✅ Am I validating external data? (API, localStorage, user input)
2. ✅ Am I using Config constants? (no magic numbers/strings)
3. ✅ Am I sanitizing user-facing data?
4. ✅ Am I using Storage module? (not direct localStorage)
5. ✅ Am I handling errors properly?

---

## 🎯 Common Tasks

### Adding a New API Call
```javascript
async function newApiCall(params) {
  try {
    // 1. Build URL with Config
    const url = `${Config.API.BASE_URL}/endpoint`;
    
    // 2. Fetch
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    
    // 3. Parse
    const data = await response.json();
    
    // 4. VALIDATE
    const validation = Validators.validateSomething(data);
    if (!validation.valid) throw new Error(validation.error);
    
    // 5. Cache (optional)
    Storage.saveCache(cacheKey, validation.data);
    
    // 6. Return validated data
    return validation.data;
    
  } catch (error) {
    console.error("API call failed:", error);
    // Try cache fallback
    const cached = Storage.getCache(cacheKey);
    if (cached) return cached;
    throw error;
  }
}
```

### Adding a localStorage Operation
```javascript
// ✅ ALWAYS use Storage module
function saveUserConfig(config) {
  // Validate first
  const validation = Validators.validateStorageData(config, "config");
  if (!validation.valid) {
    throw new Error("Invalid config: " + validation.error);
  }
  
  // Save using Storage (auto-validates on read)
  Storage.save(Config.STORAGE_KEYS.APP_CONFIG, validation.data);
}

function loadUserConfig() {
  // Storage.get() automatically validates
  return Storage.get(Config.STORAGE_KEYS.APP_CONFIG);
}
```

### Updating the DOM Safely
```javascript
function updateDisplay(element, userData) {
  // 1. Clear safely
  element.textContent = "";
  
  // 2. Sanitize
  const safe = Validators.sanitizeString(userData);
  
  // 3. Create elements
  const div = document.createElement("div");
  div.textContent = safe;
  
  // 4. Append
  element.appendChild(div);
}
```

---

## 🚨 Red Flags - Stop and Review!

If you see yourself writing:
- ❌ `innerHTML =` → Use `textContent` or `createElement()`
- ❌ `60000` → Use `Config.INTERVALS.MINUTE`
- ❌ `"app_config"` → Use `Config.STORAGE_KEYS.APP_CONFIG`
- ❌ `localStorage.getItem()` → Use `Storage.get()`
- ❌ `JSON.parse(untrusted)` → Validate first!
- ❌ `this.data = importedData` → Deep clone & validate!
- ❌ No try-catch on async → Add error handling!

---

## 📁 File Locations

```
js/
├── config.js          ← All constants here
├── validators.js      ← All validation here
├── storage.js         ← localStorage wrapper
├── app.js             ← Main controller
├── prayer-times.js    ← Prayer times API
├── hijri-calendar.js  ← Hijri calendar logic
├── tracker.js         ← Fasting tracker
├── utils.js           ← Helper functions
└── main.js            ← Entry point
```

---

## 🔍 Where to Find Things

Need to...
- **Add a constant?** → `config.js`
- **Validate data?** → Use `validators.js` functions
- **Store data?** → Use `storage.js` methods
- **Format date?** → `utils.js` helpers
- **API call?** → Follow pattern in `prayer-times.js`

---

## ✅ Code Review Checklist (Quick)

- [ ] No magic numbers (check for hardcoded 60000, 3600000, etc.)
- [ ] No hardcoded strings (check for "app_config", etc.)
- [ ] All API responses validated
- [ ] Using Storage module, not direct localStorage
- [ ] Using textContent, not innerHTML
- [ ] Error handling present
- [ ] JSDoc comments added

---

## 📚 Full Documentation

For detailed information:
- `PROJECT_OVERVIEW.md` - Architecture & modules
- `SECURITY_GUIDELINES.md` - Security patterns & examples
- `CODING_STANDARDS.md` - Code style & conventions

---

## 💡 Pro Tips

1. **When in doubt, validate** - Better safe than sorry
2. **Search for similar code** - DRY principle, reuse patterns
3. **Check Config first** - Constant probably already exists
4. **Read JSDoc** - Functions are well-documented
5. **Follow the imports** - Pattern already established

---

## 🎯 Current Status (2025-11-25)

- ✅ Security Score: 8.5/10
- ✅ All P0-P1 vulnerabilities fixed
- ✅ Code quality improvements implemented
- ⚠️ Manual testing required before deployment

---

## 🆘 If You're Unsure

1. Check if similar code exists
2. Review  `SECURITY_GUIDELINES.md`
3. Look at validation patterns in `validators.js`
4. When modifying security-critical code, ask user for review

---

**Remember**: This is a security-conscious project. When in doubt, validate and sanitize!

**Last Updated**: 2025-11-25
