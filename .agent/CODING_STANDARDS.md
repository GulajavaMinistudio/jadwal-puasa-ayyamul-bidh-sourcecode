# Coding Standards - Puasa Ayyamul Bidh

**AI Agent**: Follow these coding conventions for consistency.

---

## 📝 General Principles

1. **Readability over cleverness** - Code should be self-documenting
2. **Consistency** - Follow existing patterns in the codebase
3. **Simplicity** - Simplest solution that works
4. **DRY** - Don't Repeat Yourself (extract common logic)
5. **YAGNI** - You Aren't Gonna Need It (no premature optimization)

---

## 🎯 Naming Conventions

### Files
```
kebab-case.js          ✅ prayer-times.js, hijri-calendar.js
camelCase.js           ❌ prayerTimes.js
PascalCase.js          ❌ PrayerTimes.js
```

### Classes
```javascript
class PascalCase {}    ✅ class PrayerTimesAPI {}
class camelCase {}     ❌ class prayerTimesAPI {}
```

### Functions & Variables
```javascript
camelCase              ✅ getPrayerTimes, currentDate
PascalCase             ❌ GetPrayerTimes
snake_case             ❌ get_prayer_times
```

### Constants
```javascript
SCREAMING_SNAKE_CASE   ✅ API_BASE_URL, MAX_RETRIES
camelCase              ❌ apiBaseUrl (variables)
```

### Private Methods (Convention)
```javascript
_privateMethod()       ✅ _fetchFromAPI()
__privateMethod()      ❌ Too many underscores
```

---

## 📦 Module Organization

### File Structure
```javascript
/**
 * Module Description
 * What this module does
 */

// 1. Imports (grouped)
import { Config } from "./config.js";
import { Validators } from "./validators.js";
import { Utils } from "./utils.js";

// 2. Class or Object Export
export class ClassName {
  // Constructor
  constructor() {}
  
  // Public methods
  publicMethod() {}
  
  // Private methods (at bottom)
  _privateMethod() {}
}

// 3. Static methods (if applicable)
```

### Import Order
```javascript
// 1. Config & Validators (infrastructure)
import { Config } from "./config.js";
import { Validators } from "./validators.js";

// 2. Storage & Utils
import { Storage } from "./storage.js";
import { Utils } from "./utils.js";

// 3. Feature modules
import { PrayerTimesAPI } from "./prayer-times.js";
import { HijriCalendar } from "./hijri-calendar.js";
```

---

## 💬 Comments & Documentation

### JSDoc for All Public Methods
```javascript
/**
 * Get prayer times for a specific location
 * @param {string} city - City name
 * @param {string} country - Country name
 * @param {number} method - Calculation method (default: Kemenag RI)
 * @returns {Promise<object>} Prayer times data
 */
async getPrayerTimes(city, country, method = Config.API.DEFAULT_METHOD) {
  // Implementation
}
```

### Inline Comments (When Needed)
```javascript
// ✅ GOOD - Explains WHY
// Use cache if API fails (offline support)
const cached = Storage.getCache(key);

// ❌ BAD - States the obvious
// Get cache
const cached = Storage.getCache(key);
```

### Comment Style
```javascript
// Single line comment

/**
 * Multi-line comment
 * for complex explanations
 */

// TODO: Future improvement
// FIXME: Known issue to fix
// NOTE: Important information
```

---

## 🔧 Code Style

### Indentation & Spacing
```javascript
// 2 spaces (not tabs)
function example() {
  if (condition) {
    doSomething();
  }
}

// Space after keywords
if (x) {}          ✅
if(x) {}           ❌

// Space around operators
const sum = a + b; ✅
const sum = a+b;   ❌

// No space before function parentheses
function name() {} ✅
function name () {}❌
```

### Line Length
- **Maximum**: 80-100 characters
- Break long lines logically
```javascript
// ✅ GOOD - Readable breaks
const url = `${this.baseURL}/timings/${date}` +
            `?latitude=${lat}&longitude=${lon}`;

// ❌ BAD - Too long
const url = `${this.baseURL}/timings/${date}?latitude=${lat}&longitude=${lon}&method=${method}`;
```

### Braces
```javascript
// ✅ Always use braces
if (condition) {
  doSomething();
}

// ❌ Never omit braces
if (condition) doSomething();
```

---

## 🎭 Patterns & Best Practices

### Error Handling
```javascript
// ✅ GOOD - Specific error handling
try {
  const data = await fetchData();
  return processData(data);
} catch (error) {
  console.error("Failed to fetch data:", error);
  
  // Try fallback
  const cached = Storage.getCache(key);
  if (cached) return cached;
  
  // User feedback
  Utils.showToast("Gagal memuat data", "error");
  throw error;
}

// ❌ BAD - Silent failure
try {
  return await fetchData();
} catch (e) {
  return null; // User doesn't know what happened
}
```

### Async/Await
```javascript
// ✅ GOOD - Clean async/await
async function loadData() {
  const data = await fetchData();
  const processed = await processData(data);
  return processed;
}

// ❌ BAD - Mixing promises
function loadData() {
  return fetchData().then(data => {
    return processData(data).then(processed => {
      return processed;
    });
  });
}
```

### Object Destructuring
```javascript
// ✅ GOOD - Destructure when using multiple properties
const { day, month, year } = hijriDate;
const formatted = `${day}/${month}/${year}`;

// ❌ BAD - Repetitive access
const formatted = `${hijriDate.day}/${hijriDate.month}/${hijriDate.year}`;
```

### Arrow Functions
```javascript
// ✅ GOOD - Use arrow functions for callbacks
array.map(item => item.value);
array.filter(item => item.active);

// ❌ BAD - Traditional function in callbacks
array.map(function(item) {
  return item.value;
});
```

### Template Literals
```javascript
// ✅ GOOD - Use template literals
const message = `Hello, ${name}!`;
const url = `${baseURL}/api/${endpoint}`;

// ❌ BAD - String concatenation
const message = "Hello, " + name + "!";
const url = baseURL + "/api/" + endpoint;
```

---

## 🔒 Security Patterns

### Use Config Constants
```javascript
// ✅ GOOD
setTimeout(fn, Config.INTERVALS.MINUTE);
const key = Config.STORAGE_KEYS.APP_CONFIG;

// ❌ BAD
setTimeout(fn, 60000); // Magic number
const key = "app_config"; // Hardcoded
```

### Validate Before Use
```javascript
// ✅ GOOD
const validation = Validators.validateData(data);
if (!validation.valid) throw new Error(validation.error);
use(validation.data);

// ❌ BAD
use(data); // No validation
```

### Safe DOM Manipulation
```javascript
// ✅ GOOD
element.textContent = "";
const div = document.createElement("div");
div.textContent = sanitized;
element.appendChild(div);

// ❌ BAD
element.innerHTML = unsafeData;
```

---

## 📋 Code Review Checklist

Before submitting code:

### ✅ General
- [ ] No magic numbers (use  Config)
- [ ] No hardcoded strings  (use Config for keys/URLs)
- [ ] JSDoc comments for public methods
- [ ] Meaningful variable names
- [ ] No unused imports/variables
- [ ] No console.log for debug (remove or conditional)

### ✅ Security
- [ ] All external data validated
- [ ] Strings sanitized before display
- [ ] Using textContent, not innerHTML
- [ ] Using Storage module, not direct localStorage
- [ ] Error handling in place

### ✅ Performance
- [ ] No unnecessary API calls
- [ ] Caching used appropriately
- [ ] Event listeners cleaned up
- [ ] No memory leaks (intervals cleared)

### ✅ Style
- [ ] 2-space indentation
- [ ] Consistent naming conventions
- [ ] Line length < 100 characters
- [ ] Proper spacing and formatting

---

## 🎨 Example: Well-Structured Function

```javascript
/**
 * Get and validate prayer times from API with caching
 * @param {object} location - Location object {city, country} or {lat, lon}
 * @param {number} method - Prayer calculation method
 * @returns {Promise<object>} Validated prayer times data
 * @throws {Error} If validation fails
 */
async getPrayerTimesWithCache(location, method = Config.API.DEFAULT_METHOD) {
  // 1. Setup
  const cacheKey = `prayer_times_${JSON.stringify(location)}`;
  const maxAge = Config.CACHE.PRAYER_TIMES_MAX_AGE;
  
  // 2. Check cache first
  if (Storage.isCacheValid(cacheKey, maxAge)) {
    return Storage.getCache(cacheKey);
  }
  
  try {
    // 3. Fetch from API
    const data = await this._fetchPrayerTimes(location, method);
    
    // 4. Validate response
    const validation = Validators.validatePrayerTimings(data.timings);
    if (!validation.valid) {
      throw new Error("Invalid prayer times: " + validation.error);
    }
    
    // 5. Cache successful result
    Storage.saveCache(cacheKey, validation.data);
    
    // 6. Return validated data
    return validation.data;
    
  } catch (error) {
    // 7. Error handling with fallback
    console.error("Failed to fetch prayer times:", error);
    
    const cached = Storage.getCache(cacheKey);
    if (cached) {
      console.warn("Using expired cache due to error");
      return cached;
    }
    
    throw error;
  }
}
```

### What Makes This Good:
1. ✅ Clear JSDoc documentation
2. ✅ Uses Config constants
3. ✅ Validates external data
4. ✅ Proper error handling
5. ✅ Cache strategy
6. ✅ Descriptive variable names
7. ✅ Comments for complex logic
8. ✅ Single responsibility
9. ✅ Proper structure (setup → check → fetch → validate → cache → return)

---

## 🚫 Anti-Patterns to Avoid

### 1. God Objects
```javascript
// ❌ BAD - One object does everything
const App = {
  fetchData() {},
  processData() {},
  renderUI() {},
  handleEvents() {},
  validateInput() {},
  // ... 50 more methods
}

// ✅ GOOD - Separate concerns
class PrayerTimesAPI {} // API handling
class FastingTracker {} // Data tracking
class App {}            // Coordination
```

### 2. Callback Hell
```javascript
// ❌ BAD
getData(function(data) {
  processData(data, function(result) {
    saveData(result, function() {
      updateUI();
    });
  });
});

// ✅ GOOD
async function workflow() {
  const data = await getData();
  const result = await processData(data);
  await saveData(result);
  updateUI();
}
```

### 3. Mutation Hell
```javascript
// ❌ BAD - Mutating everywhere
function process(data) {
  data.processed = true;
  data.values = data.values.map(v => v * 2);
  return data; // Original mutated!
}

// ✅ GOOD - Immutable approach
function process(data) {
  return {
    ...data,
    processed: true,
    values: data.values.map(v => v * 2)
  };
}
```

---

## 📚 Resources

- [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)
- [Google JavaScript Style Guide](https://google.github.io/styleguide/jsguide.html)
- [Clean Code JavaScript](https://github.com/ryanmcdermott/clean-code-javascript)

---

**Last Updated**: 2025-11-25
