# 🤖 Custom Agents - Panduan Penggunaan

Project ini memiliki 4 custom agents yang bisa Anda gunakan untuk berbagai tugas development.

## 📋 Daftar Agents

| Agent | Fokus | Tools | File |
|-------|-------|-------|------|
| **Code Reviewer** 📋 | Analisis kode (read-only) | view, search, grep | [code-reviewer.md](./code-reviewer.md) |
| **Planner** 🗓️ | Research & planning | search, web, docs | [planner.md](./planner.md) |
| **Implementer** 💻 | Coding & implementasi | edit, write, run | [implementer.md](./implementer.md) |
| **Tester** 🧪 | QA & verification | browser, test, run | [tester.md](./tester.md) |

---

## 🚀 Cara Menggunakan

### Metode 1: Request Eksplisit (Recommended)

Format: `"Sebagai [Agent Name], [task]"`

**Contoh:**
```
"Sebagai Code Reviewer, review file dashboard.js"
"Sebagai Planner, buatkan plan untuk fitur notifikasi"
"Sebagai Implementer, tambahkan dark mode"
"Sebagai Tester, test fitur kalender Hijri"
```

### Metode 2: Natural Language

Cukup describe task, Antigravity akan otomatis pilih agent yang tepat:

**Contoh:**
```
"Tolong review kodenya dulu" → Code Reviewer mode
"Buatkan rencana implementasi" → Planner mode
"Implementasikan fiturnya" → Implementer mode
"Test apakah sudah jalan" → Tester mode
```

### Metode 3: Workflow Sequential

Gunakan workflow bertahap:

```
1. Planning: "Buatkan plan untuk fitur X"
2. Implementation: "Plan approved, mulai coding"
3. Testing: "Implementasi selesai, tolong test"
4. Review: "Test pass, review kode dong"
```

---

## 📖 Contoh Skenario Lengkap

### Skenario: Menambahkan Fitur Notifikasi Browser

#### **Step 1: Planning**
```
User: "Sebagai Planner, buatkan implementation plan untuk 
       fitur notifikasi browser yang remind user untuk puasa 
       Ayyamul Bidh sehari sebelumnya"

Antigravity: 
✅ Membuat implementation plan dengan:
   - Requirements analysis
   - Technical approach
   - Step-by-step implementation
   - Verification criteria
```

#### **Step 2: Review Plan**
```
User: "Plan looks good, tapi bisa tambahin fitur 
       notification sound juga?"

Antigravity: 
✅ Update plan dengan sound notification feature
```

#### **Step 3: Implementation**
```
User: "Plan approved, sebagai Implementer, mulai coding"

Antigravity:
✅ Implementasi fitur sesuai plan:
   - Buat notification permission handler
   - Schedule notification 1 hari sebelum
   - Add notification sound
   - Update UI untuk settings
```

#### **Step 4: Testing**
```
User: "Sebagai Tester, test fitur notifikasi yang baru dibuat"

Antigravity:
✅ Menjalankan test:
   - Manual browser testing
   - Permission handling test
   - Notification timing test
   - Sound playback test
   - Bug report (jika ada)
```

#### **Step 5: Fix (jika ada bug)**
```
User: "Sebagai Implementer, fix bug yang ditemukan"

Antigravity:
✅ Perbaiki bugs dari test report
```

#### **Step 6: Code Review**
```
User: "Sebagai Code Reviewer, final review sebelum deploy"

Antigravity:
✅ Code quality review:
   - Security check
   - Performance check
   - Best practices compliance
```

---

## 🎯 Quick Commands

### Code Review
```
"Review kode di [file-name]"
"Ada masalah keamanan di kode ini gak?"
"Check apakah sudah follow best practices"
```

### Planning
```
"Buatkan plan untuk [feature]"
"Analyze requirement untuk [task]"
"Research cara terbaik untuk [problem]"
```

### Implementation
```
"Implementasikan [feature]"
"Fix bug di [location]"
"Tambahkan [functionality]"
```

### Testing
```
"Test fitur [feature-name]"
"Verify apakah [functionality] sudah jalan"
"Cek responsiveness dan error handling"
```

---

## 📌 Tips Penggunaan

### ✅ DO:
- Sebut agent name untuk clarity
- Provide context yang cukup
- Follow workflow sequential (plan → implement → test)
- Request code review sebelum consider done

### ❌ DON'T:
- Expect agent auto-switch tanpa instruksi
- Mix multiple agent tasks dalam satu request
- Skip planning untuk fitur kompleks
- Skip testing setelah implementasi

---

## 🔄 Typical Workflow

```
┌─────────────┐
│   Planner   │ ← Research & design
└──────┬──────┘
       ↓
┌─────────────┐
│ Implementer │ ← Write code
└──────┬──────┘
       ↓
┌─────────────┐
│   Tester    │ ← Verify & test
└──────┬──────┘
       ↓
    ┌──┴──┐
    │ OK? │
    └──┬──┘
   Yes │ No
       │  ↓
       │ ┌─────────────┐
       │ │ Implementer │ ← Fix bugs
       │ └──────┬──────┘
       │        ↓
       │    [Re-test]
       ↓
┌─────────────┐
│Code Reviewer│ ← Final review
└─────────────┘
```

---

## 🌟 Agent Capabilities

### Code Reviewer
- ✅ Analyze code quality
- ✅ Identify security issues
- ✅ Check best practices
- ✅ Suggest improvements
- ❌ Cannot edit code

### Planner
- ✅ Research codebase
- ✅ Create implementation plans
- ✅ Web research
- ✅ Analyze requirements
- ❌ Cannot implement

### Implementer
- ✅ Write/edit code
- ✅ Fix bugs
- ✅ Run commands
- ✅ Follow plans
- ⚠️ Minimal changes only

### Tester
- ✅ Manual testing
- ✅ Browser testing
- ✅ Run test scripts
- ✅ Bug reporting
- ❌ Cannot fix bugs (handoff to Implementer)

---

## 📞 Need Help?

Jika bingung agent mana yang harus digunakan, cukup tanya:

```
"Agent mana yang tepat untuk [task]?"
```

Antigravity akan recommend agent yang sesuai!

---

**Last Updated**: 2024-11-21  
**Project**: Puasa Ayyamul Bidh Tracker
