# Security Guidelines - Puasa Ayyamul Bidh

**AI Agent**: ALWAYS follow these security rules when modifying code.

---

## 🛡️ Core Security Principles

### 1. **Validate Everything**
All external data MUST be validated before use:
- API responses
- localStorage data
- User input
- URL parameters
- File uploads

### 2. **Sanitize Always**
All data for display MUST be sanitized:
- Use `Validators.sanitizeString()` for text
- Use `textContent` instead of `innerHTML` for clearing
- Use `createElement()` for dynamic DOM

### 3. **Trust Nothing**
- Never trust API responses
- Never trust localStorage (can be manipulated)
- Never trust user input
- Always validate, then sanitize

---

## ✅ Required Security Checks

### For ALL API Calls

```javascript
// ✅ CORRECT - With validation
async function fetchData() {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  
  const data = await response.json();
  
  // VALIDATE the response
  const validation = Validators.validateApiData(data);
  if (!validation.valid) {
    throw new Error("Invalid API data: " + validation.error);
  }
  
  return validation.data; // Safe to use
}

// ❌ WRONG - No validation
async function fetchData() {
  const response = await fetch(url);
  const data = await response.json();
  return data; // DANGEROUS!
}
```

### For ALL localStorage Operations

```javascript
// ✅ CORRECT - With validation
const data = Storage.get(Config.STORAGE_KEYS.APP_CONFIG);
// Storage.get() automatically validates

// ❌ WRONG - Direct access
const data = JSON.parse(localStorage.getItem("app_config"));
// No validation, prototype pollution risk!
```

### For ALL User Input

```javascript
// ✅ CORRECT - Sanitized
const userInput = document.getElementById("input").value;
const sanitized = Validators.sanitizeString(userInput);
element.textContent = sanitized;

// ❌ WRONG - Direct use
element.innerHTML = userInput; // XSS vulnerability!
```

---

## 🚨 Common Vulnerabilities to Avoid

### 1. XSS (Cross-Site Scripting)

#### ❌ VULNERABLE Code
```javascript
// innerHTML with user data
element.innerHTML = userData;

// Direct template insertion
element.innerHTML = `<div>${userData}</div>`;

// Clearing with innerHTML
element.innerHTML = "";  // Can trigger XSS if handlers attached
```

#### ✅ SAFE Code
```javascript
// Use textContent for clearing
element.textContent = "";

// Use createElement for dynamic content
const div = document.createElement("div");
div.textContent = userData;
element.appendChild(div);

// Or sanitize first
element.textContent = Validators.sanitizeString(userData);
```

### 2. Prototype Pollution

#### ❌ VULNERABLE Code
```javascript
// Direct assignment
this.data = importedData;

// Object.assign without filtering
Object.assign(this.data, untrustedData);

// Spread without validation
const merged = { ...untrustedData };
```

#### ✅ SAFE Code
```javascript
// Validate first
const validation = Validators.validateStorageData(importedData, "type");
if (!validation.valid) throw new Error(validation.error);

// Deep clone validated data
this.data = Validators.deepClone(validation.data);

// Validators.deepClone automatically filters __proto__, constructor, prototype
```

### 3. localStorage Injection

#### ❌ VULNERABLE Code
```javascript
// Direct parse without validation
const data = JSON.parse(localStorage.getItem(key));
use(data); // Could be malicious!
```

#### ✅ SAFE Code
```javascript
// Use Storage module (has built-in validation)
const data = Storage.get(Config.STORAGE_KEYS.APP_CONFIG);
// Automatically validated based on key type
```

### 4. Unvalidated API Data

#### ❌ VULNERABLE Code
```javascript
const response = await fetch(apiUrl);
const data = await response.json();
// Direct use of API data
displayName(data.user.name); // No validation!
```

#### ✅ SAFE Code
```javascript
const response = await fetch(apiUrl);
const data = await response.json();

// Validate structure
const validation = Validators.validateUserData(data);
if (!validation.valid) {
  throw new Error("Invalid user data: " + validation.error);
}

// Use validated data
displayName(validation.data.name);
```

---

## 📋 Security Checklist

Before committing ANY code that handles:

### ✅ API Responses
- [ ] Response status checked (`response.ok`)
- [ ] JSON parsed safely (try-catch)
- [ ] Data structure validated (use `Validators`)
- [ ] Strings sanitized before display
- [ ] Numeric values range-checked

### ✅ localStorage Operations
- [ ] Using `Storage` module (not direct localStorage)
- [ ] Data type specified in `Storage.get()`
- [ ] Validation automatic via Storage module
- [ ] Export/import uses `Validators.validateStorageData()`

### ✅ User Input
- [ ] Input sanitized via `Validators.sanitizeString()`
- [ ] Using `textContent` or `createElement()`, NOT `innerHTML`
- [ ] Form data validated before submission
- [ ] File uploads checked (if applicable)

### ✅ DOM Manipulation
- [ ] No `innerHTML` with dynamic data
- [ ] No `eval()` or Function() constructor
- [ ] No `document.write()`
- [ ] Event handlers properly cleaned up

### ✅ Constants Usage
- [ ] No magic numbers (use `Config`)
- [ ] No hardcoded keys (use `Config.STORAGE_KEYS`)
- [ ] No hardcoded URLs (use `Config.API.BASE_URL`)

---

## 🔐 Validation Functions Reference

### Use These Validators

```javascript
// Prayer times validation
Validators.validatePrayerTimings(timings)
// Returns: { valid, data, error }

// Hijri date validation
Validators.validateHijriDate(hijriData)
// Returns: { valid, data, error }

// Date data validation
Validators.validateDateData(dateData)
// Returns: { valid, data, error }

// Storage data validation
Validators.validateStorageData(data, "config|fasting|cache")
// Returns: { valid, data, error }

// String sanitization
Validators.sanitizeString(input)
// Returns: sanitized string

// Deep clone (safe from prototype pollution)
Validators.deepClone(obj)
// Returns: deeply cloned object
```

---

## 🎯 Security Patterns

### Pattern 1: API Call with Validation

```javascript
async function safeApiCall(url) {
  try {
    // 1. Fetch with error handling
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    // 2. Parse JSON safely
    const data = await response.json();
    
    // 3. Validate response structure
    const validation = Validators.validateApiResponse(data);
    if (!validation.valid) {
      throw new Error("Invalid API response: " + validation.error);
    }
    
    // 4. Return validated data
    return validation.data;
    
  } catch (error) {
    console.error("API call failed:", error);
    // 5. Check cache as fallback
    const cached = Storage.getCache(cacheKey);
    if (cached) return cached;
    throw error;
  }
}
```

### Pattern 2: Safe DOM Update

```javascript
function safeUpdateDOM(element, userContent) {
  // 1. Clear safely
  element.textContent = "";
  
  // 2. Sanitize content
  const sanitized = Validators.sanitizeString(userContent);
  
  // 3. Create elements
  const div = document.createElement("div");
  div.textContent = sanitized;
  
  // 4. Append
  element.appendChild(div);
}
```

### Pattern 3: Safe Data Import

```javascript
function safeImportData(importedData) {
  // 1. Validate structure
  const validation = Validators.validateStorageData(
    importedData,
    "fasting"
  );
  
  // 2. Check validation result
  if (!validation.valid) {
    throw new Error("Invalid import data: " + validation.error);
  }
  
  // 3. Deep clone to prevent pollution
  const safeData = Validators.deepClone(validation.data);
  
  // 4. Use safe data
  this.data = safeData;
  this.saveData();
}
```

---

## ⚠️ Never Do This

```javascript
// ❌ NEVER use innerHTML with dynamic data
element.innerHTML = userData;

// ❌ NEVER use eval
eval(userCode);

// ❌ NEVER trust API data directly
const name = apiResponse.user.name; // No validation!

// ❌ NEVER parse localStorage directly
const data = JSON.parse(localStorage.getItem(key));

// ❌ NEVER use Function constructor
new Function(userCode)();

// ❌ NEVER assign imported data directly
this.data = importedData; // Prototype pollution!

// ❌ NEVER use magic numbers
setTimeout(fn, 60000); // Use Config.INTERVALS.MINUTE

// ❌ NEVER skip error handling
const data = await riskyOperation(); // No try-catch!
```

---

## 🧪 Security Testing

### Manual Tests to Perform

1. **XSS Test**
   ```javascript
   // Try injecting script
   input.value = "<script>alert('XSS')</script>";
   // Should be escaped/sanitized
   ```

2. **Prototype Pollution Test**
   ```javascript
   // Try polluting via import
   const malicious = {
     __proto__: { polluted: true }
   };
   importData(malicious);
   // Should be filtered by Validators.deepClone
   ```

3. **localStorage Manipulation**
   ```javascript
   // Manually edit localStorage in DevTools
   localStorage.setItem('app_config', '{"__proto__": {"admin": true}}');
   // Should be rejected by Storage.get validation
   ```

---

## 📊 Security Metrics

### Current Status (2025-11-25)
- **Security Score**: 8.5/10 ✅
- **Critical Vulnerabilities**: 0 🎯
- **High Priority Issues**: 0 ✅
- **Medium Priority Issues**: 0 ✅
- **Low Priority Items**: 4 (future work)

### Coverage
- ✅ XSS Prevention
- ✅ Prototype Pollution Protection
- ✅ Input Validation
- ✅ Output Sanitization
- ✅ localStorage Security
- ✅ API Response Validation

---

## 📚 References

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [MDN Security Best Practices](https://developer.mozilla.org/en-US/docs/Web/Security)
- Project: `plan/code-review-report.md`
- Project: `plan/implementation-summary.md`

---

**Last Updated**: 2025-11-25  
**Security Review**: 2025-11-25 ✅
