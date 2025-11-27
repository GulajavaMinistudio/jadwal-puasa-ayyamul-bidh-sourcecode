# 🌙 Aplikasi Web Puasa Ayyamul Bidh

> Aplikasi web modern untuk melacak dan mengelola jadwal puasa Ayyamul Bidh (puasa sunnah tanggal 13, 14, 15 Hijriyah). Dibangun dengan JavaScript murni, tanpa framework kompleks, namun tetap powerful dan mudah digunakan. Sempurna untuk Muslim yang ingin menjalankan puasa sunnah dengan teratur dan terorganisir.

[![Security](https://img.shields.io/badge/Security-8.5%2F10-green)]()
[![Code Quality](https://img.shields.io/badge/Code%20Quality-7.0%2F10-brightgreen)]()
[![License](https://img.shields.io/badge/License-MIT-blue)]()
[![Status](https://img.shields.io/badge/Status-Active-success)]()

---

## ✨ Fitur Utama

### 🏠 Dashboard Terintegrasi
- **Tanggal Ganda**: Menampilkan tanggal Hijriyah dan Masehi hari ini secara real-time
- **Jam Digital Real-Time**: Menampilkan waktu aktual (HH:MM:SS) dengan zona waktu Indonesia (WIB/WITA/WIT) otomatis
- **Hitung Mundur Dinamis**: Informasi waktu menuju Ayyamul Bidh berikutnya dengan teks yang jelas
- **Statistik Cepat**: Ringkasan puasa bulan ini, tahun ini, dan capaian berturut-turut (streak)
- **Akses Cepat**: Tombol pintas ke fitur-fitur utama

### 🕌 Jadwal Shalat Komprehensif
- **7 Waktu Shalat**: Imsak, Subuh, Syuruq, Dzuhur, Ashar, Maghrib, Isya
- **Jam Digital Real-Time**: Jam yang diperbarui setiap detik dengan deteksi zona waktu otomatis
- **Hitung Mundur Shalat**: Informasi waktu tersisa ke shalat berikutnya dengan format "Akan tiba dalam X menit"
- **Penanda Otomatis**: Menandai waktu shalat yang sedang berlangsung
- **Tabel Bulanan**: Jadwal lengkap untuk satu bulan
- **Lokasi Akurat**: Berdasarkan GPS atau input manual

### 📅 Kalender Hijriyah Interaktif
- **Konversi Dual-Direction**: Gregorian ↔ Hijri
- **Visual Menarik**: Kalender dengan highlight tanggal Ayyamul Bidh (13, 14, 15)
- **Navigasi Mudah**: Berpindah antar bulan dengan cepat
- **Info Detail**: Informasi lengkap untuk setiap tanggal

### 📊 Tracker Puasa Pintar
- **Mark/Unmark Fleksibel**: Tandai hari puasa dengan mudah
- **Statistik Lengkap**: 
  - Progress bulanan (target 3 hari per bulan)
  - Progress tahunan (target 36 hari per tahun)
  - Streak tracking (berapa bulan berturut-turut)
- **History Lengkap**: Riwayat puasa dengan filter
- **Backup Data**: Export/import untuk keamanan data

### 📖 Panduan Islami
- **Dalil Shahih**: Hadits tentang keutamaan puasa Ayyamul Bidh
- **Doa Lengkap**: Doa berbuka dan sahur dalam bahasa Arab dan terjemahan
- **FAQ Praktis**: Jawaban pertanyaan umum
- **Tips Bermanfaat**: Panduan menjalankan puasa sunnah

### ⚙️ Pengaturan Fleksibel
- **Lokasi**: Auto-detect GPS atau manual input kota
- **Metode Kalkulasi**: Pilih dari 7 metode (default: Kemenag RI)
- **Data Management**: Export/import data dalam format JSON
- **Reset Safety**: Reset data dengan konfirmasi ganda

---

## 🚀 Quick Start

### 🌟 Untuk Pengguna (Non-Technical)

**Cara Termudah - Langsung di Browser:**

1. **Download atau Clone Project**
   - Klik tombol "Code" → "Download ZIP" di GitHub
   - Extract file ZIP ke folder di komputer Anda

2. **Buka Aplikasi**
   - Double-click file `index.html`
   - Atau klik kanan → "Open with" → Pilih browser favorit (Chrome/Firefox/Edge)

3. **Setup Lokasi (Pertama Kali)**
   - Aplikasi akan meminta izin lokasi GPS → Klik "Allow/Izinkan"
   - Atau skip dan set lokasi manual di halaman **Pengaturan**

4. **Siap Digunakan!** 🎉
   - Dashboard akan menampilkan informasi lengkap
   - Tandai hari puasa Anda di halaman **Tracker**
   - Lihat jadwal shalat di halaman **Jadwal Shalat**

**Tips Pengguna:**
- 💾 Export data secara berkala untuk backup (Menu Pengaturan)
- 🔖 Bookmark aplikasi untuk akses cepat
- 📍 Update lokasi jika pindah kota
- 🌙 Cek countdown Ayyamul Bidh di dashboard setiap hari

---

### 👨‍💻 Untuk Developer

**Opsi 1: Langsung di Browser (No Build)**
```bash
# Clone repository
git clone https://github.com/yourusername/puasa-ayyamul-bidh.git
cd puasa-ayyamul-bidh

# Buka index.html di browser
# Atau gunakan Live Server extension di VS Code
```

**Opsi 2: Development Server (Recommended)**
```bash
# Install dependencies (dev only)
npm install

# Run development server dengan Vite
npm run dev

# Buka http://localhost:5173 di browser
```

**Opsi 3: Alternative HTTP Server**
```bash
# Install http-server globally (jika belum)
npm install -g http-server

# atau gunakan npm script
npm run serve

# Buka http://localhost:8000
```

**Setup Awal:**
1. Izinkan lokasi GPS atau set manual di Pengaturan
2. Pilih metode kalkulasi (default: Kemenag RI)
3. Aplikasi siap untuk development!

---

## 🏗️ Tech Stack

### Core
- **HTML5** - Semantic markup
- **CSS3 + Bootstrap 5.3.8** - Responsive styling
- **Vanilla JavaScript (ES6 Modules)** - Zero dependencies, no build tools required
- **localStorage** - Client-side data persistence dengan validation

### APIs & External Services
- **[Aladhan API](https://aladhan.com)** - Prayer times & Hijri calendar conversion
- **Geolocation API** - Auto-detect user location

### Development Tools
- **[Google Antigravity Editor](https://www.google.com/antigravity)** - AI-powered code editor untuk development 🤖
- **[Google Gemini 3.0 Pro](https://deepmind.google/technologies/gemini/)** - AI assistant untuk coding dan problem solving 🧠
- **[Anthropic Claude 4.5 Sonnet](https://www.anthropic.com/claude)** - AI assistant untuk code review dan documentation 📝
- **Vite** - Dev server only (bukan untuk build)
- **npm** - Package management untuk dev tools

> **Note**: Aplikasi ini **tidak memerlukan build process**. JavaScript modules di-load langsung di browser.

---

## 📂 Struktur Project

```
puasa-ayyamul-bidh/
├── .agent/                     # 🤖 AI agent documentation
│   ├── AI_AGENT_GUIDE.md       # Quick reference untuk AI assistants
│   ├── PROJECT_OVERVIEW.md     # Architecture & modules
│   ├── SECURITY_GUIDELINES.md  # Security best practices
│   ├── CODING_STANDARDS.md     # Code style conventions
│   └── workflows/              # Automation workflows
│
├── js/                         # 📦 JavaScript modules
│   ├── config.js              # ⚙️ Constants & configuration
│   ├── validators.js          # 🛡️ Validation & sanitization
│   ├── storage.js             # 💾 localStorage wrapper (dengan validation)
│   ├── app.js                 # 🎮 Main application controller
│   ├── prayer-times.js        # 🕌 Prayer times API integration
│   ├── hijri-calendar.js      # 📅 Hijri calendar logic
│   ├── tracker.js             # 📊 Fasting tracker & statistics
│   ├── utils.js               # 🔧 Helper functions
│   └── main.js                # 🚪 Entry point
│
├── css/                        # 🎨 Stylesheets
│   ├── style.css              # Main styles
│   └── components.css         # Component styles
│
├── assets/                     # 🖼️ Images & static files
├── plan/                       # 📋 Planning & documentation
│   ├── code-review-report.md
│   └── implementation-summary.md
│
├── *.html                      # 📄 HTML pages
├── package.json
├── vite.config.js
└── README.md                   # 📖 This file
```

---

## 🧩 Architecture

### Modular Design

Aplikasi menggunakan **ES6 Modules** dengan separation of concerns:

```javascript
// Dependency flow
main.js
  └─> app.js (coordinator)
       ├─> config.js (constants)
       ├─> validators.js (validation)
       ├─> storage.js (localStorage wrapper)
       ├─> prayer-times.js (API integration)
       ├─> hijri-calendar.js (calendar logic)
       ├─> tracker.js (fasting data)
       └─> utils.js (helpers)
```

### Key Modules

| Module | Purpose | Key Features |
|--------|---------|--------------|
| **config.js** | Centralized constants | No magic numbers, all config in one place |
| **validators.js** | Security layer | Schema validation, sanitization, prototype pollution prevention |
| **storage.js** | Data persistence | localStorage wrapper with automatic validation |
| **app.js** | Application controller | Coordinates all modules, manages lifecycle |
| **prayer-times.js** | Prayer times | API integration with caching & validation |
| **hijri-calendar.js** | Hijri calendar | Date conversion & Ayyamul Bidh calculation |
| **tracker.js** | Fasting data | Statistics, streaks, import/export |
| **utils.js** | Utilities | Date formatting, toast notifications, helpers |

---

## 🔒 Security

### Security Score: **8.5/10** 🎯

Aplikasi menerapkan **security-first approach** dengan multiple layers of protection:

#### ✅ Implemented Protections

1. **XSS Prevention**
   - Input sanitization via `Validators.sanitizeString()`
   - Safe DOM manipulation (textContent, createElement)
   - No innerHTML with dynamic data

2. **Prototype Pollution Prevention**
   - Deep cloning with filtering (`__proto__`, `constructor`)
   - Validation sebelum object assignment
   - Safe import/export functions

3. **localStorage Injection Prevention**
   - Automatic schema validation on read
   - Type-specific validators (config, fasting, cache)
   - Integrity checking

4. **API Response Validation**
   - Schema validation untuk semua API responses
   - Type checking dan range validation
   - Sanitization before display

5. **Input Sanitization**
   - HTML escaping untuk user input
   - URL encoding untuk API requests
   - Coordinate validation

#### 📋 Security Audit (2025-11-25)

| Vulnerability Type | Status | Fix |
|-------------------|--------|-----|
| XSS | ✅ FIXED | textContent usage, sanitization |
| Prototype Pollution | ✅ FIXED | Deep cloning with validation |
| localStorage Injection | ✅ FIXED | Schema validation on read |
| Unvalidated API Data | ✅ FIXED | validators.js module |
| Debug Code in Production | ✅ FIXED | Conditional window.app |

**Details**: See `plan/code-review-report.md` and `plan/implementation-summary.md`

### Design Principles
- **Mobile-first** - Responsive dari smartphone sampai desktop
- **Accessible** - Semantic HTML, ARIA labels, keyboard navigation
- **Fast** - Cached data, minimal API calls, optimized
- **Clean** - Modern, minimalist, Islamic aesthetic

### Color Palette
- Primary: Emerald Green (#10b981)
- Accent: Teal (#14b8a6)
- Background: Light gray (#f9fafb)
- Text: Dark gray (#1f2937)

### Typography
- Latin: **Inter** (Google Fonts)
- Arabic: **Amiri** (Google Fonts)

---

## 📱 Features Lengkap

### 1. 🏠 Dashboard
- **Tanggal Dual Calendar**: Tanggal Hijriyah & Masehi hari ini dengan auto-update
- **Countdown Ayyamul Bidh**: Hitung mundur dinamis ke puasa berikutnya (13, 14, 15 Hijriyah)
- **Waktu Shalat Hari Ini**: 
  - **Jam Real-Time**: Menampilkan HH:MM:SS yang update setiap detik ⏰
  - **Timezone Auto-Detect**: WIB/WITA/WIT berdasarkan lokasi sistem
  - Countdown ke shalat berikutnya dengan teks "Akan tiba dalam X menit"
  - Grid 6 waktu shalat dengan highlight waktu aktif
- **Statistik Visual**: 
  - Progress puasa bulan ini (X/3 hari)
  - Total tahun ini (X/36 hari)
  - Streak bulan berturut-turut
- **Quick Actions**: Tombol akses cepat ke semua halaman

### 2. 🕌 Jadwal Shalat
- **Real-Time Clock Display**: 
  - Clock digital dengan update setiap detik
  - Timezone auto-detection (WIB/WITA/WIT)
  - Desain modern dengan gradient biru muda
- **7 Waktu Lengkap**: Imsak, Subuh, Syuruq, Dzuhur, Ashar, Maghrib, Isya
- **Countdown Real-Time**: Hitung mundur ke shalat berikutnya dengan teks yang lebih jelas
- **Visual Highlight**: Card khusus untuk shalat berikutnya
- **Tabel Jadwal Bulanan**: Jadwal lengkap 30 hari dengan scroll horizontal
- **Location-Based**: Kalkulasi akurat berdasarkan koordinat GPS atau kota

### 3. 📅 Kalender Hijriyah
- **Konversi Tanggal**: 
  - Gregorian → Hijri
  - Hijri → Gregorian
- **Visual Kalender**: 
  - Grid kalender interaktif
  - Highlight khusus untuk tanggal 13, 14, 15 (Ayyamul Bidh)
  - Penanda hari ini
- **Navigasi Mudah**: 
  - Prev/Next month
  - Jump to specific month/year
- **Info Detail**: Klik tanggal untuk info lebih lengkap

### 4. 📊 Tracker Puasa
- **Check/Uncheck Interface**: Mark hari puasa dengan satu klik
- **Statistik Multi-Level**:
  - **Per Bulan**: Progress 3 hari target (dengan persentase)
  - **Per Tahun**: Progress 36 hari target (dengan persentase)
  - **Streak**: Berapa bulan berturut-turut lengkap (3/3 hari)
- **History Lengkap**: 
  - List semua hari puasa yang sudah dijalankan
  - Filter per bulan/tahun
  - Sortir berdasarkan tanggal
- **Data Export/Import**: 
  - Format JSON untuk portabilitas
  - Backup otomatis sebelum import
  - Validasi data integrity

### 5. 📖 Panduan
- **Dalil & Hadits**: 
  - Keutamaan puasa Ayyamul Bidh
  - Hadits shahih dengan sanad
  - Penjelasan konteks
- **Doa-Doa**: 
  - Doa berbuka puasa (Arab + Latin + Terjemah)
  - Doa sahur (Arab + Latin + Terjemah)
  - Niat puasa sunnah
- **FAQ Lengkap**: 
  - Apa itu Ayyamul Bidh?
  - Bolehkah puasa jika ada yang terlewat?
  - Tips untuk konsisten
  - Dan 10+ pertanyaan lainnya
- **Tips Praktis**: Panduan menjalankan puasa dengan mudah

### 6. ⚙️ Pengaturan
- **Location Management**:
  - Auto-detect via GPS (dengan permission request)
  - Manual input: City + Country
  - Save preferences ke localStorage
- **Calculation Method** (7 pilihan):
  - Kementerian Agama RI (Default) ⭐
  - Muslim World League (MWL)
  - Islamic Society of North America (ISNA)
  - Egyptian General Authority of Survey
  - Umm Al-Qura University, Makkah
  - University of Islamic Sciences, Karachi
  - Institute of Geophysics, Tehran
- **Data Management**:
  - **Export**: Download semua data sebagai JSON
  - **Import**: Upload backup file dengan validasi
  - **Reset**: Hapus semua data dengan konfirmasi ganda
- **Privacy Note**: Semua data tersimpan di browser, tidak ada server

---

## 🌐 Browser Support

| Browser | Version | Status |
|---------|---------|--------|
| Chrome/Edge | Latest | ✅ Fully supported |
| Firefox | Latest | ✅ Fully supported |
| Safari | Latest | ✅ Fully supported |
| Opera | Latest | ✅ Fully supported |
| Mobile Safari | iOS 12+ | ✅ Supported |
| Chrome Mobile | Latest | ✅ Supported |

**Catatan**: Geolocation memerlukan HTTPS atau localhost.

---

## 🔧 Configuration

### Prayer Calculation Methods

Pilih pada halaman Pengaturan:

- **Kementerian Agama RI** (Default - Indonesia) ✅
- Muslim World League (MWL)
- Islamic Society of North America (ISNA)
- Egyptian General Authority of Survey
- Umm Al-Qura University, Makkah
- University of Islamic Sciences, Karachi
- Institute of Geophysics, University of Tehran

### Data Management

**Export:**
```javascript
// Download data dalam format JSON
{
  "puasa_ayyamul_bidh": { ... },
  "app_config": { ... },
  "exported_at": "2025-11-25T10:00:00.000Z"
}
```

**Import:**
- Upload file JSON hasil export
- Data divalidasi sebelum di-import
- Backup data lama otomatis

---

## 👨‍💻 Development

### Setup Development
```bash
# Clone repo
git clone https://github.com/yourusername/puasa-ayyamul-bidh.git
cd puasa-ayyamul-bidh

# Install dev dependencies  
npm install

# Run dev server
npm run dev
# atau
npm run serve
```

### Code Guidelines

Lihat dokumentasi lengkap di `.agent/` folder:
- `AI_AGENT_GUIDE.md` - Quick reference
- `CODING_STANDARDS.md` - Style guide
- `SECURITY_GUIDELINES.md` - Security patterns

**Quick Rules:**
- ✅ Use `Config` constants (no magic numbers)
- ✅ Validate all external data
- ✅ Sanitize user input
- ✅ Use `Storage` module (not direct localStorage)
- ✅ Add JSDoc comments
- ✅ Handle errors properly

### Testing

**Manual Testing:**
```bash
npm run dev
# Test features di browser
```

**Security Testing:**
- XSS: Try injecting `<script>alert('XSS')</script>`
- localStorage: Manually edit via DevTools
- API: Test dengan invalid responses

**Future**: Unit tests, integration tests, E2E tests

---

## 📝 API Reference

### Aladhan API Endpoints Used

```javascript
// Prayer times by city
GET /v1/timingsByCity/{date}?city={city}&country={country}&method={method}

// Prayer times by coordinates
GET /v1/timings/{date}?latitude={lat}&longitude={lon}&method={method}

// Hijri calendar conversion
GET /v1/gToH/{date}  // Gregorian to Hijri
GET /v1/hToG/{date}  // Hijri to Gregorian

// Monthly calendar
GET /v1/calendarByCity/{year}/{month}?city={city}&country={country}
```

**Rate Limiting**: Be mindful (caching implemented)

---

## 🐛 Known Issues & Limitations

- [x] ~~Calendar page belum diimplementasi~~ ✅ **Completed!**
- [x] ~~Tracker page perlu visualisasi chart~~ ✅ **Completed!**
- [ ] Notifikasi browser belum ada
- [ ] PWA support belum ada
- [ ] Multi-language belum ada (saat ini 100% Bahasa Indonesia)

**See**: Issues tracker on GitHub

---

## 🆕 Update Terkini (2025-11-26)

### ✨ Fitur Baru & Peningkatan

1.  **Jam Digital & Zona Waktu Otomatis** ⏰
    -   Menambahkan jam digital real-time (HH:MM:SS) pada dashboard dan halaman jadwal shalat.
    -   Deteksi otomatis zona waktu Indonesia (WIB/WITA/WIT) berdasarkan offset sistem.
    -   Perbaikan format hitung mundur menjadi lebih natural ("Akan tiba dalam X menit").

2.  **Perbaikan Responsivitas Menu** 📱
    -   Optimasi tampilan menu navigasi untuk perangkat mobile.
    -   Perbaikan layout dan alignment ikon pada tampilan desktop.
    -   Peningkatan aksesibilitas tombol navigasi.

3.  **Lokalisasi Lengkap ke Bahasa Indonesia** 🇮🇩
    -   Mengubah semua teks tampilan dari Bahasa Inggris ke Bahasa Indonesia.
    -   Perubahan mencakup:
        - "Dashboard" → "Beranda" di semua halaman
        - "Loading..." → "Memuat..." 
        - "Complete/Partial" → "Lengkap/Sebagian"
        - "Export/Import" → "Ekspor/Impor"
    -   Aplikasi sekarang 100% Bahasa Indonesia untuk UI.

4.  **Implementasi Kalender Hijriyah Interaktif** 📅
    -   Kalender visual dengan highlight Ayyamul Bidh (13, 14, 15).
    -   Navigasi mudah antar bulan (Prev/Next/Today).
    -   Integrasi dengan tracker untuk menampilkan hari yang sudah puasa.
    -   Jadwal 3 bulan ke depan untuk Ayyamul Bidh.

5.  **Tracker Puasa Lengkap** 📊
    -   Checkbox interface untuk mark/unmark hari puasa.
    -   Statistik komprehensif: bulanan, tahunan, dan streak.
    -   Visual chart monthly progress.
    -   History accordion dengan status lengkap/sebagian/kosong.

6.  **Update Footer** 👨‍💻
    -   Footer sekarang menampilkan "Dikembangkan oleh **Gulajava Ministudio**".

### 🐛 Bug Fixes

1.  **Fix Parse Error Waktu Shalat**
    -   Memperbaiki parser waktu yang gagal dengan format "04:32 (WIB)".
    -   Validator sekarang menghapus timezone suffix otomatis.

2.  **Fix Process Environment Error**
    -   Mengganti `process.env` dengan `import.meta.env` untuk kompatibilitas browser.
    -   Menghilangkan error "process is not defined" di console.

---

## 🗺️ Roadmap

### v1.1 (Q1 2026)
- [ ] Kalender page dengan visual interaktif
- [ ] Tracker charts (dengan Chart.js)
- [ ] Browser notifications
- [ ] Dark mode toggle

### v2.0 (Q2 2026)
- [ ] PWA support (offline-first)
- [ ] Multi-language (EN, AR)
- [ ] Social sharing
- [ ] Automated tests

### v3.0 (Future)
- [ ] Mobile apps (React Native)
- [ ] Backend sync (optional)
- [ ] Community features

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Follow coding standards (see `.agent/CODING_STANDARDS.md`)
4. Ensure security guidelines (see `.agent/SECURITY_GUIDELINES.md`)
5. Commit changes (`git commit -m 'Add AmazingFeature'`)
6. Push to branch (`git push origin feature/AmazingFeature`)
7. Open Pull Request

**Before PR:**
- [ ] Code follows standards
- [ ] Security review passed
- [ ] Manual testing done
- [ ] No console.log / debug code

---

## 📄 License

Open source dan gratis untuk digunakan. Dibuat untuk kepentingan umum umat Muslim.

---

## 🙏 Credits & Acknowledgments

### APIs & Services
- **[Aladhan API](https://aladhan.com)** - Prayer times & Hijri calendar data
- **[Geolocation API](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API)** - Location detection

### Libraries & Tools (Dev Only)
- **[Bootstrap 5](https://getbootstrap.com)** - UI framework
- **[Bootstrap Icons](https://icons.getbootstrap.com)** - Icon library
- **[Vite](https://vitejs.dev)** - Development server
- **[Google Fonts](https://fonts.google.com)** - Web fonts (Inter, Amiri)

### Development Powered By
- **[Google Antigravity Editor](https://www.google.com/antigravity)** - AI-powered development environment 🚀
- **[Google Gemini 3.0 Pro](https://deepmind.google/technologies/gemini/)** - AI coding assistant (Gemini 3.0) 🤖
- **[Anthropic Claude 4.5 Sonnet](https://www.anthropic.com/claude)** - AI code reviewer & documentation assistant 📚

### Inspiration
- Islamic calendar & lunar calendar systems
- Muslim community needs for fasting tracking

---

## 📞 Contact & Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/puasa-ayyamul-bidh/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/puasa-ayyamul-bidh/discussions)
- **Email**: your.email@example.com

---

## 📊 Project Stats

- **Created**: 2025
- **Last Updated**: 2025-11-26
- **Security Score**: 8.5/10
- **Code Quality**: 7.0/10
- **UI Language**: 100% Bahasa Indonesia 🇮🇩
- **Lines of Code**: ~3,000+
- **Files**: 9 JS modules, 6 HTML pages, 2 CSS files

---

## 💡 Pro Tips

### For Users
- 💾 Export data secara berkala untuk backup
- 📍 Update lokasi jika pindah kota
- 🔔 Bookmark halaman untuk akses cepat

### For Developers
- 📖 Baca `.agent/AI_AGENT_GUIDE.md` dulu
- 🛡️ Selalu validate external data
- ⚙️ Use Config constants, NO magic numbers
- 🧪 Test security fixes manually

---

**Dibuat dengan ❤️ untuk umat Muslim**

Semoga bermanfaat dan menjadi amal jariyah! 🤲

**Barakallahu fiikum!** ✨

---

*Last updated: 2025-11-26 | Security audit: 2025-11-25 ✅ | UI Localization: 100% Bahasa Indonesia 🇮🇩*
