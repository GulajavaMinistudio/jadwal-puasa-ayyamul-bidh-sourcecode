# Implementation Plan: Aplikasi Web Puasa Ayyamul Bidh

## Deskripsi Proyek

Aplikasi web untuk membantu umat Muslim melacak dan mengelola jadwal puasa Ayyamul Bidh (puasa sunnah pada tanggal 13, 14, 15 Hijriyah setiap bulan). Aplikasi ini juga menyediakan fitur jadwal waktu shalat berdasarkan lokasi pengguna, konversi kalender Hijriyah-Masehi, tracker puasa, dan panduan lengkap tentang puasa Ayyamul Bidh.

### Target Pengguna
- Umat Muslim di Indonesia dan negara lain
- Tersedia untuk akses publik
- Mendukung desktop dan mobile devices

### Teknologi Stack
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **CSS Framework**: Bootstrap 5.3.8
- **Storage**: LocalStorage (browser)
- **API**: Aladhan API (prayer times & Hijri calendar)
- **Geolocation**: Browser Geolocation API

---

## User Review Required

> [!IMPORTANT]
> **Konfirmasi Fitur Prioritas**
> 
> Apakah urutan implementasi fitur berikut sudah sesuai dengan prioritas Anda?
> 1. Dashboard → Jadwal Shalat → Kalender → Tracker → Panduan → Pengaturan
> 
> Atau ada fitur yang perlu diprioritaskan lebih dahulu?

> [!NOTE]
> **Metode Kalkulasi Waktu Shalat**
> 
> Default menggunakan **Method 20 (Kementerian Agama RI)** karena target utama adalah pengguna Indonesia. User dapat mengubah metode ini di halaman Pengaturan jika berada di negara lain.

---

## Proposed Changes

### 1. Struktur Proyek

#### [NEW] Struktur Folder dan File

Akan dibuat struktur folder sebagai berikut:

```
d:/WebstormProject/puasa-ayyamul-bidh/
│
├── index.html                 # Dashboard utama
├── kalender.html             # Halaman kalender
├── tracker.html              # Halaman tracker puasa
├── jadwal-shalat.html        # Halaman jadwal shalat
├── panduan.html              # Halaman panduan/info
├── pengaturan.html           # Halaman pengaturan
│
├── css/
│   ├── style.css             # Custom CSS utama
│   └── components.css        # CSS komponen custom
│
├── js/
│   ├── app.js                # Main application logic
│   ├── hijri-calendar.js     # Logic kalender Hijriyah
│   ├── prayer-times.js       # Logic waktu shalat & API
│   ├── tracker.js            # Logic tracker puasa
│   ├── storage.js            # LocalStorage management
│   └── utils.js              # Helper functions
│
├── assets/
│   ├── images/               # Logo, ilustrasi
│   └── icons/                # Custom icons
│
└── README.md                 # Dokumentasi proyek
```

---

### 2. Core JavaScript Modules

#### [NEW] [storage.js](file:///d:/WebstormProject/puasa-ayyamul-bidh/js/storage.js)

**Fungsi**: Mengelola semua operasi LocalStorage dengan API yang clean dan aman.

**Fitur**:
- `save(key, value)`: Menyimpan data ke localStorage
- `get(key)`: Mengambil data dari localStorage
- `remove(key)`: Menghapus data
- `clear()`: Reset semua data
- `exportData()`: Export data ke JSON file
- `importData(jsonData)`: Import data dari JSON

**Data Structure**:
```javascript
{
  "app_config": {
    "location": {
      "city": "Jakarta",
      "country": "Indonesia",
      "latitude": -6.2088,
      "longitude": 106.8456
    },
    "prayer_method": 20,  // Kemenag RI
    "first_time_setup": false
  },
  "puasa_ayyamul_bidh": {
    "1446-03": [13, 14, 15],  // Format: tahun-bulan Hijriyah
    "1446-04": [13, 14],
    "1446-05": [13, 14, 15]
  },
  "cache": {
    "prayer_times": { /* cached data */ },
    "hijri_dates": { /* cached data */ },
    "last_update": "2025-11-20T14:20:00+07:00"
  }
}
```

---

#### [NEW] [utils.js](file:///d:/WebstormProject/puasa-ayyamul-bidh/js/utils.js)

**Fungsi**: Helper functions untuk operasi umum.

**Fitur**:
- `formatDate(date, format)`: Format tanggal
- `formatTime(time)`: Format waktu (HH:MM)
- `getCurrentDate()`: Get tanggal hari ini
- `addDays(date, days)`: Tambah hari ke tanggal
- `diffDays(date1, date2)`: Hitung selisih hari
- `sanitizeInput(input)`: Sanitize user input (XSS prevention)
- `validateCoordinates(lat, lon)`: Validasi koordinat
- `throttle(func, delay)`: Throttle function calls
- `debounce(func, delay)`: Debounce function calls

**Security Features**:
- Input sanitization untuk mencegah XSS
- Validasi data sebelum save ke localStorage
- Error handling yang robust

---

#### [NEW] [prayer-times.js](file:///d:/WebstormProject/puasa-ayyamul-bidh/js/prayer-times.js)

**Fungsi**: Menangani semua operasi terkait waktu shalat menggunakan Aladhan API.

**Class Structure**:
```javascript
class PrayerTimesAPI {
  constructor(apiBaseURL = 'https://api.aladhan.com/v1/');
  
  // Methods
  async getTimingsByCity(city, country, method = 20);
  async getTimingsByCoordinates(lat, lon, method = 20);
  async getMonthlyCalendar(city, country, year, month, method = 20);
  async getCurrentPrayerTime();
  getNextPrayerTime(timings);
  calculateCountdown(nextPrayerTime);
}
```

**API Endpoints**:
1. **Daily Timings by City**:
   - Endpoint: `GET /timingsByCity/{date}`
   - Params: `city`, `country`, `method`
   - Response: Waktu shalat untuk hari tertentu

2. **Daily Timings by Coordinates**:
   - Endpoint: `GET /timings/{date}`
   - Params: `latitude`, `longitude`, `method`
   - Response: Waktu shalat berdasarkan koordinat

3. **Monthly Calendar**:
   - Endpoint: `GET /calendarByCity/{year}/{month}`
   - Params: `city`, `country`, `method`
   - Response: Waktu shalat untuk 1 bulan penuh

**Caching Strategy**:
- Cache waktu shalat hari ini selama 24 jam
- Cache kalender bulanan selama 30 hari
- Fallback ke cache jika offline

**Error Handling**:
- Retry mechanism untuk failed requests
- Fallback ke cached data
- User-friendly error messages

---

#### [NEW] [hijri-calendar.js](file:///d:/WebstormProject/puasa-ayyamul-bidh/js/hijri-calendar.js)

**Fungsi**: Mengelola konversi dan kalkulasi kalender Hijriyah.

**Class Structure**:
```javascript
class HijriCalendar {
  constructor();
  
  // Conversion methods
  async gregorianToHijri(date);  // DD-MM-YYYY
  async hijriToGregorian(date);  // DD-MM-YYYY
  
  // Ayyamul Bidh calculations
  getAyyamulBidhDates(hijriMonth, hijriYear);
  isAyyamulBidhDay(hijriDate);
  calculateDaysUntilNextAyyamulBidh(currentHijriDate);
  
  // Calendar generation
  generateMonthlyCalendar(month, year, isHijri = false);
  
  // Utilities
  getHijriMonthName(monthNumber);
  getCurrentHijriDate();
}
```

**API Integration**:
- Aladhan API untuk konversi tanggal:
  - `GET /gToH/{date}`: Gregorian to Hijri
  - `GET /hToG/{date}`: Hijri to Gregorian

**Ayyamul Bidh Logic**:
```javascript
// Identifikasi hari Ayyamul Bidh (13, 14, 15)
const AYYAMUL_BIDH_DATES = [13, 14, 15];

// Hitung countdown ke Ayyamul Bidh berikutnya
function calculateDaysUntilNextAyyamulBidh(currentHijriDate) {
  const currentDay = currentHijriDate.day;
  
  if (currentDay < 13) {
    // Countdown ke tanggal 13 bulan ini
    return 13 - currentDay;
  } else if (currentDay >= 13 && currentDay <= 15) {
    // Sedang dalam periode Ayyamul Bidh
    return 0;
  } else {
    // Countdown ke tanggal 13 bulan depan
    const daysInMonth = currentHijriDate.daysInMonth;
    return (daysInMonth - currentDay) + 13;
  }
}
```

---

#### [NEW] [tracker.js](file:///d:/WebstormProject/puasa-ayyamul-bidh/js/tracker.js)

**Fungsi**: Mengelola tracking puasa Ayyamul Bidh yang sudah dilakukan user.

**Class Structure**:
```javascript
class FastingTracker {
  constructor();
  
  // Core tracking
  markFasting(hijriDate);
  unmarkFasting(hijriDate);
  isFastingMarked(hijriDate);
  
  // Statistics
  getMonthlyStats(hijriMonth, hijriYear);
  getYearlyStats(hijriYear);
  getTotalFastingDays();
  getCurrentStreak();
  
  // Data management
  getFastingHistory();
  exportHistory();
  importHistory(data);
}
```

**Statistics Calculations**:

1. **Monthly Stats**:
   - Total hari puasa di bulan ini (max: 3)
   - Persentase completion (0-100%)
   
2. **Yearly Stats**:
   - Total hari puasa dalam 1 tahun (max: 36 hari = 12 bulan × 3 hari)
   - Bulan mana saja yang sudah complete
   - Progress bar visual
   
3. **Streak Calculation**:
   - Hitung berapa bulan berturut-turut user puasa lengkap (3 hari)
   - Reset jika ada bulan yang terlewat

**Data Format**:
```javascript
{
  "puasa_ayyamul_bidh": {
    "1446-01": [13, 14, 15],      // Complete
    "1446-02": [13, 14],           // Partial
    "1446-03": [13, 14, 15],      // Complete
    // ... dst
  },
  "stats": {
    "total_days": 8,
    "current_streak": 1,
    "longest_streak": 3
  }
}
```

---

#### [NEW] [app.js](file:///d:/WebstormProject/puasa-ayyamul-bidh/js/app.js)

**Fungsi**: Main application controller, initialization, dan koordinasi antar modules.

**Features**:

1. **Application Initialization**:
```javascript
class App {
  constructor() {
    this.storage = new Storage();
    this.prayerTimes = new PrayerTimesAPI();
    this.hijriCalendar = new HijriCalendar();
    this.tracker = new FastingTracker();
  }
  
  async init() {
    // Check first time setup
    if (!this.storage.get('app_config')?.first_time_setup) {
      this.showSetupWizard();
    } else {
      this.loadApp();
    }
  }
}
```

2. **Setup Wizard** (First Time):
   - Welcome screen
   - Location selection (GPS auto-detect atau manual)
   - Permission requests (geolocation)
   - Save initial config
   
3. **Auto-Update Features**:
   - Update countdown timer setiap menit
   - Highlight current prayer time
   - Check jika hari ini adalah Ayyamul Bidh
   - Update cache jika expired

4. **Navigation Management**:
   - Handle routing antar halaman
   - Update active nav menu
   - Load page-specific scripts

---

### 3. HTML Pages

#### [NEW] [index.html](file:///d:/WebstormProject/puasa-ayyamul-bidh/index.html)

**Dashboard Utama** - Landing page dan overview.

**Sections**:

1. **Header/Navbar**:
   - Logo aplikasi
   - Navigation menu (Dashboard, Kalender, Tracker, Jadwal Shalat, Panduan, Pengaturan)
   - Responsive hamburger menu untuk mobile

2. **Hero Section - Tanggal Hari Ini**:
   ```
   ┌─────────────────────────────────────┐
   │   HARI INI                          │
   │   Rabu, 20 November 2025            │
   │   13 Jumadal Ula 1446 H             │
   └─────────────────────────────────────┘
   ```

3. **Countdown Ayyamul Bidh**:
   - Jika bukan hari puasa: "X hari lagi menuju puasa Ayyamul Bidh"
   - Jika hari puasa: "HARI INI PUASA AYYAMUL BIDH!" (highlight)
   - Progress bar visual
   
4. **Waktu Shalat Hari Ini** (Compact):
   ```
   ┌─────────────────────────────────────┐
   │  Subuh  | Dzuhur | Ashar | Maghrib  │
   │  04:30  | 12:00  | 15:15 | 18:00    │
   │                                      │
   │  Shalat Berikutnya: Maghrib (2:34)  │
   └─────────────────────────────────────┘
   ```

5. **Quick Stats**:
   - Card: "Puasa Bulan Ini: 2/3"
   - Card: "Total Tahun Ini: 24/36"
   - Card: "Streak: 3 bulan"

6. **Quick Actions**:
   - Button: "Tandai Puasa Hari Ini"
   - Button: "Lihat Kalender"
   - Button: "Jadwal Waktu Shalat"

**Bootstrap Components**:
- Navbar
- Cards untuk stats
- Progress bars
- Buttons
- Grid system (responsive)

---

#### [NEW] [kalender.html](file:///d:/WebstormProject/puasa-ayyamul-bidh/kalender.html)

**Halaman Kalender** - Visualisasi kalender dengan highlight Ayyamul Bidh.

**Features**:

1. **Toggle Kalender**:
   - Switch button: "Hijriyah" ↔ "Masehi"
   - Current selection highlighted
   
2. **Calendar View**:
   - Month/Year selector dengan prev/next buttons
   - Kalender bulanan (table layout)
   - Highlight tanggal 13, 14, 15 dengan warna khusus (hijau)
   - Marker (✓) untuk puasa yang sudah dicatat
   - Tanggal hari ini dengan border
   
3. **Calendar Legend**:
   - 🟢 Hijau: Hari Ayyamul Bidh (13, 14, 15)
   - ✓ Checkmark: Sudah puasa
   - 🔵 Biru: Hari ini

4. **Detail Panel**:
   - Klik tanggal → show detail
   - Konversi tanggal (Hijriyah ↔ Masehi)
   - Quick add puasa button

**Implementation**:
```javascript
// Generate calendar table
function generateCalendar(month, year, isHijri) {
  // Logic untuk generate kalender
  // Highlight 13, 14, 15
  // Add markers untuk tracked fasts
}
```

**Bootstrap Components**:
- Table (calendar grid)
- Buttons (navigation, toggle)
- Modal (detail panel)
- Badge (markers)

---

#### [NEW] [tracker.html](file:///d:/WebstormProject/puasa-ayyamul-bidh/tracker.html)

**Halaman Tracker** - Checklist dan statistik puasa.

**Sections**:

1. **Current Month Checklist**:
   ```
   Bulan: Jumadal Ula 1446 H
   
   ☑ 13 Jumadal Ula (Rabu, 20 Nov 2025)
   ☐ 14 Jumadal Ula (Kamis, 21 Nov 2025)
   ☐ 15 Jumadal Ula (Jumat, 22 Nov 2025)
   
   Progress: 1/3 (33%)
   ```

2. **Monthly History** (Accordion):
   - Expandable list untuk setiap bulan
   - Show status: Complete (3/3), Partial (x/3), Tidak ada (0/3)
   - Checkboxes untuk tandai puasa retroaktif

3. **Statistics Dashboard**:
   - **Yearly Progress**:
     - Progress bar: "24/36 hari (66%)"
     - Visual bar chart per bulan
   - **Streak Info**:
     - "Streak saat ini: 3 bulan berturut-turut"
     - "Streak terpanjang: 5 bulan"
   - **Completion Rate**:
     - "Bulan yang complete: 8/12"

4. **Export/Import**:
   - Button: "Export Data" (download JSON)
   - Button: "Import Data" (upload JSON)
   - Button: "Reset Data" (dengan konfirmasi)

**Bootstrap Components**:
- Checkbox list
- Progress bars
- Accordion
- Buttons
- Charts (simple CSS-based atau manual)

---

#### [NEW] [jadwal-shalat.html](file:///d:/WebstormProject/puasa-ayyamul-bidh/jadwal-shalat.html)

**Halaman Jadwal Shalat** - Waktu shalat detail.

**Sections**:

1. **Location Info**:
   ```
   📍 Jakarta, Indonesia
   Koordinat: -6.2088, 106.8456
   Metode: Kementerian Agama RI
   ```
   - Button: "Ubah Lokasi"

2. **Waktu Shalat Hari Ini** (Large Display):
   ```
   ┌──────────────────────────────────┐
   │  Imsak      04:15                │
   │  Subuh      04:25  ◀── Telah lewat│
   │  Dzuhur     12:00                │
   │  Ashar      15:15  ◀── Waktu shalat berikutnya (dalam 2 jam 34 menit)│
   │  Maghrib    18:05                │
   │  Isya       19:15                │
   └──────────────────────────────────┘
   ```

3. **Countdown Timer**:
   - Real-time countdown ke shalat berikutnya
   - Auto-update setiap menit
   - Highlight waktu shalat yang sedang berjalan

4. **Monthly Prayer Times Table**:
   - Tabel waktu shalat untuk 1 bulan
   - Columns: Tanggal | Imsak | Subuh | Dzuhur | Ashar | Maghrib | Isya
   - Highlight row hari ini
   - Button: "Print" atau "Download PDF" (future)

**Bootstrap Components**:
- Cards untuk waktu shalat
- Table untuk kalender bulanan
- Badges untuk status
- Buttons

---

#### [NEW] [panduan.html](file:///d:/WebstormProject/puasa-ayyamul-bidh/panduan.html)

**Halaman Panduan** - Informasi dan edukasi.

**Sections**:

1. **Tentang Puasa Ayyamul Bidh**:
   - Definisi
   - Keutamaan dan manfaat
   - Dalil dari Al-Quran dan Hadits
   
2. **Doa-Doa**:
   - **Niat Puasa Sunnah**:
     ```
     نَوَيْتُ صَوْمَ غَدٍ سُنَّةً ِللهِ تَعَالَى
     
     Nawaitu shauma ghadin sunnatan lillahi ta'ala
     
     Artinya: "Saya niat puasa esok hari sunnah 
     karena Allah Ta'ala"
     ```
   
   - **Doa Berbuka Puasa**:
     ```
     اَللّهُمَّ لَكَ صُمْتُ وَبِكَ آمَنْتُ وَعَلَى رِزْقِكَ أَفْطَرْتُ
     
     Allahumma laka shumtu wa bika aamantu 
     wa 'ala rizqika afthartu
     
     Artinya: "Ya Allah, karena-Mu aku berpuasa, 
     kepada-Mu aku beriman, dan dengan rezeki-Mu 
     aku berbuka"
     ```

3. **FAQ (Frequently Asked Questions)**:
   - Apa itu puasa Ayyamul Bidh?
   - Kenapa disebut "hari putih"?
   - Apakah boleh puasa hanya 1 atau 2 hari saja?
   - Bagaimana jika lupa atau tidak bisa puasa?
   - Dan lain-lain

4. **Hadits Terkait**:
   - Kutipan hadits tentang keutamaan puasa Ayyamul Bidh
   - Sumber: Bukhari, Muslim, dll

**Content Format**:
- Text content (static HTML)
- Accordion untuk FAQ
- Cards untuk hadits
- Arabic text dengan transliterasi dan terjemahan

**Bootstrap Components**:
- Accordion
- Cards
- Typography classes

---

#### [NEW] [pengaturan.html](file:///d:/WebstormProject/puasa-ayyamul-bidh/pengaturan.html)

**Halaman Pengaturan** - Konfigurasi aplikasi.

**Sections**:

1. **Lokasi & Koordinat**:
   - Dropdown: Pilih kota (Jakarta, Bandung, Surabaya, dll)
   - Atau input manual koordinat:
     - Input: Latitude
     - Input: Longitude
   - Button: "Deteksi Lokasi Otomatis" (GPS)
   - Preview: Lokasi saat ini
   
2. **Metode Kalkulasi Waktu Shalat**:
   - Dropdown select:
     - Kementerian Agama RI (default)
     - Muslim World League (MWL)
     - Islamic Society of North America (ISNA)
     - Egyptian General Authority of Survey
     - Umm Al-Qura University, Makkah
     - University of Islamic Sciences, Karachi
     - Institute of Geophysics, Tehran
   - Info: Penjelasan singkat tentang perbedaan metode

3. **Data Management**:
   - Button: "Export Data" → Download JSON
   - Button: "Import Data" → Upload JSON
   - Button: "Reset Semua Data" → Konfirmasi → Clear all
   
4. **About App**:
   - Versi aplikasi
   - Developer info
   - Link ke GitHub repo (jika ada)
   - Lisensi

**Form Validation**:
- Validasi koordinat (latitude: -90 to 90, longitude: -180 to 180)
- Sanitize input untuk keamanan
- Show error messages jika invalid

**Bootstrap Components**:
- Forms (input, select, buttons)
- Alerts (success/error messages)
- Modal (confirmation dialogs)

---

### 4. Styling (CSS)

#### [NEW] [style.css](file:///d:/WebstormProject/puasa-ayyamul-bidh/css/style.css)

**Custom CSS** - Override dan tambahan Bootstrap.

**Design System**:

1. **Color Palette** (Islamic/Premium Theme):
   ```css
   :root {
     /* Primary colors */
     --primary-green: #059669;      /* Emerald green */
     --primary-dark: #047857;
     --primary-light: #10b981;
     
     /* Accent colors */
     --accent-gold: #f59e0b;        /* Gold accent */
     --accent-blue: #3b82f6;
     
     /* Neutral colors */
     --bg-light: #f9fafb;
     --bg-dark: #111827;
     --text-dark: #1f2937;
     --text-light: #6b7280;
     
     /* Semantic colors */
     --success: #10b981;
     --warning: #f59e0b;
     --danger: #ef4444;
     --info: #3b82f6;
   }
   ```

2. **Typography**:
   - Font: Google Fonts - "Inter" (modern, readable)
   - Arabic font: "Amiri" atau "Scheherazade New"
   - Heading: Bold weights
   - Body: Regular weight

3. **Components Styling**:
   - **Cards**: Subtle shadow, rounded corners, hover effects
   - **Buttons**: Gradient backgrounds, smooth transitions
   - **Calendar**: Grid layout dengan highlight colors
   - **Progress bars**: Animated, gradient fills

4. **Animations**:
   ```css
   /* Fade in animation */
   @keyframes fadeIn {
     from { opacity: 0; transform: translateY(10px); }
     to { opacity: 1; transform: translateY(0); }
   }
   
   /* Pulse animation untuk countdown */
   @keyframes pulse {
     0%, 100% { opacity: 1; }
     50% { opacity: 0.7; }
   }
   ```

5. **Responsive Design**:
   - Mobile-first approach
   - Breakpoints: 576px (sm), 768px (md), 992px (lg), 1200px (xl)
   - Stack layout di mobile, grid di desktop

**Premium Design Elements**:
- Glassmorphism effects untuk cards
- Smooth gradients untuk backgrounds
- Micro-animations pada hover
- Subtle shadows dan depth
- Modern, clean aesthetic

---

#### [NEW] [components.css](file:///d:/WebstormProject/puasa-ayyamul-bidh/css/components.css)

**Component-specific CSS**.

**Custom Components**:

1. **Hijri Date Display**:
   - Large, elegant typography
   - Arabic numerals option
   - Decorative borders

2. **Prayer Time Card**:
   - Icon + time layout
   - Highlight active prayer
   - Countdown badge

3. **Ayyamul Bidh Calendar Cell**:
   - Special styling untuk tanggal 13, 14, 15
   - Checkmark overlay
   - Hover effects

4. **Fasting Tracker Checkbox**:
   - Custom checkbox design (Islamic pattern)
   - Checked state animation
   - Disable past dates option

5. **Stats Cards**:
   - Icon + number + label
   - Gradient backgrounds
   - Hover lift effect

---

### 5. Assets

#### [NEW] Logo & Icons

**Requirements**:
- **Logo aplikasi**: Islamic-themed, bulan sabit atau pattern Islam
- **Favicon**: 32x32, 64x64, 128x128
- **Icons**: 
  - Mosque icon (untuk shalat)
  - Calendar icon
  - Checkmark icon
  - Settings icon

**Generation**:
- Akan dibuat menggunakan `generate_image` tool
- Format: PNG dengan transparent background
- Style: Minimalist, modern, Islamic aesthetic

---

### 6. Integration & API Flow

#### API Integration Strategy

**1. Aladhan API** (https://api.aladhan.com/v1/)

**Endpoints Usage**:

| Feature | Endpoint | Caching |
|---------|----------|---------|
| Daily Prayer Times | `/timingsByCity/{date}` | 24 hours |
| Monthly Calendar | `/calendarByCity/{year}/{month}` | 30 days |
| Hijri Conversion | `/gToH/{date}` | Permanent |
| Current Date Info | `/timings/{timestamp}` | 1 hour |

**Request Flow**:
```
User Action → Check Cache → Cache Hit? 
                              ├─ Yes → Return Cached Data
                              └─ No → Fetch from API → Save to Cache → Return Data
```

**Error Handling**:
```
API Request → Success?
               ├─ Yes → Process Data → Update UI
               └─ No → Retry (max 3x) → Failed?
                                         ├─ Yes → Use Cached Data → Show Offline Notice
                                         └─ No → Process Data
```

**2. Geolocation API**

**Permission Flow**:
```
Request Location → Permission Granted?
                    ├─ Yes → Get Coordinates → Fetch Prayer Times
                    └─ No → Show Manual Input → User Select City
```

---

### 7. Data Flow & State Management

#### Application State

**State Structure**:
```javascript
const AppState = {
  user: {
    location: { city, country, lat, lon },
    preferences: { prayerMethod, language },
    firstTimeSetup: false
  },
  
  currentData: {
    todayDate: { gregorian, hijri },
    prayerTimes: { /* today's times */ },
    nextAyyamulBidh: { daysUntil, dates }
  },
  
  trackedFasting: {
    /* all tracked fasting data */
  },
  
  cache: {
    /* cached API responses */
  }
}
```

**State Updates**:
- Centralized through `app.js`
- Event-driven updates (custom events)
- Auto-save to localStorage pada setiap perubahan

**Sync Strategy**:
- Background sync setiap 1 jam (untuk update waktu)
- Manual sync button di settings
- Offline-first: semua data tersimpan local, sync hanya untuk fresh data

---

## Verification Plan

### Automated Tests

**Manual Testing Checklist** (akan dilakukan dengan browser):

1. **Functionality Tests**:
   ```
   ☐ Dashboard loads dengan data yang benar
   ☐ Waktu shalat sesuai dengan lokasi
   ☐ Countdown timer berfungsi dan update real-time
   ☐ Kalender menampilkan highlight tanggal 13, 14, 15
   ☐ Toggle kalender Hijriyah/Masehi berfungsi
   ☐ Tracker checkbox save/load dengan benar
   ☐ Statistik dihitung dengan akurat
   ☐ Pengaturan lokasi berfungsi (manual + GPS)
   ☐ Export/import data berfungsi
   ☐ Data persist setelah refresh browser
   ```

2. **API Integration Tests**:
   ```
   ☐ API waktu shalat return data yang valid
   ☐ Konversi Hijriyah berfungsi dengan benar
   ☐ Caching mechanism berfungsi
   ☐ Offline mode menggunakan cached data
   ☐ Error handling untuk failed API requests
   ```

3. **Security Tests**:
   ```
   ☐ Input sanitization mencegah XSS
   ☐ Coordinate validation berfungsi
   ☐ Tidak ada sensitive data di localStorage
   ☐ CSP headers implemented (jika deploy)
   ```

4. **Performance Tests**:
   ```
   ☐ Page load time < 2 detik
   ☐ Smooth animations (60fps)
   ☐ Responsive di berbagai ukuran layar
   ☐ Throttling/debouncing untuk expensive operations
   ```

### Manual Verification

**Browser Testing**:
- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)

**Device Testing**:
- ✅ Desktop (1920x1080, 1366x768)
- ✅ Tablet (768x1024)
- ✅ Mobile (375x667, 414x896)

**User Flow Testing**:

1. **First Time User**:
   ```
   1. Open app → Setup wizard shows
   2. Choose location (auto-detect / manual)
   3. Dashboard loads with data
   4. Navigate to each page
   5. Mark a fasting day
   6. Verify stats update
   ```

2. **Returning User**:
   ```
   1. Open app → Dashboard loads immediately
   2. Data persisted from previous session
   3. Prayer times updated for current day
   4. Tracked fasting still visible
   ```

3. **Offline User**:
   ```
   1. Disable internet
   2. Open app → Cached data loads
   3. Can still mark fasting
   4. Stats still calculable
   5. Show "offline" indicator
   ```

**Edge Cases**:
- Timezone changes
- Month transitions (last day of month)
- Year transitions (Hijri new year)
- Invalid coordinates input
- Corrupted localStorage data
- Very slow internet connection

### Validation

**Code Quality**:
- Clean code principles applied
- Consistent naming conventions
- Proper error handling
- Comments untuk complex logic
- No console errors atau warnings

**Accessibility**:
- Semantic HTML
- ARIA labels where needed
- Keyboard navigation
- Color contrast ratio (WCAG AA)
- Alt text untuk images

**SEO**:
- Proper meta tags
- Descriptive page titles
- Open Graph tags (untuk sharing)
- Structured data (opsional)

---

## Timeline Estimation

**Phase 1: Foundation (Estimated: 1-2 sessions)**
- Setup struktur folder
- Implementasi core JavaScript modules
- Setup Bootstrap dan base styling

**Phase 2: Core Features (Estimated: 2-3 sessions)**
- Dashboard implementation
- Prayer times integration
- Hijri calendar integration
- Basic styling

**Phase 3: Advanced Features (Estimated: 2-3 sessions)**
- Kalender page dengan toggle
- Tracker dengan statistics
- Pengaturan page
- Panduan content

**Phase 4: Polish & Verification (Estimated: 1-2 sessions)**
- Advanced styling dan animations
- Cross-browser testing
- Bug fixes
- Performance optimization
- Documentation

**Total Estimated Time**: 6-10 development sessions

---

## Future Enhancements (Post-MVP)

> [!NOTE]
> Fitur-fitur berikut dapat diimplementasikan di versi mendatang:

1. **Notifikasi Browser**:
   - Reminder untuk puasa besok
   - Notifikasi waktu shalat
   
2. **PWA (Progressive Web App)**:
   - Install ke home screen
   - Offline-first dengan Service Worker
   - Background sync
   
3. **Multi-language Support**:
   - English, Arabic, Malay
   
4. **Advanced Analytics**:
   - Charts dengan Chart.js
   - Yearly heatmap
   - Comparison dengan tahun sebelumnya
   
5. **Social Features**:
   - Share stats ke social media
   - Leaderboard dengan teman
   
6. **Customization**:
   - Theme switcher (light/dark mode)
   - Custom color schemes
   - Adjustable text sizes

---

## Dependencies & Resources

**External Libraries** (via CDN):
- Bootstrap 5.3.8 (CSS + JS)
- Bootstrap Icons
- Google Fonts (Inter, Amiri)

**APIs** (Free, No Auth Required):
- Aladhan API (https://aladhan.com/prayer-times-api)

**Browser APIs**:
- LocalStorage
- Geolocation API
- Fetch API

**Development Tools**:
- Code editor (WebStorm / VS Code)
- Browser DevTools
- Git untuk version control

---

## Notes

> [!IMPORTANT]
> **Catatan Penting untuk Implementasi:**
> 
> 1. Semua JavaScript akan ditulis dalam **ES6+ syntax** dengan best practices
> 2. Kode akan **modular** dan mudah di-maintain
> 3. **Error handling** di setiap API call dan user interaction
> 4. **Input validation** untuk semua user input
> 5. **Responsive design** adalah prioritas
> 6. **Accessibility** harus diperhatikan

> [!TIP]
> **Rekomendasi Development:**
> 
> - Start dengan fitur core (Dashboard + Prayer Times) terlebih dahulu
> - Test di browser secara berkala
> - Commit code secara incremental
> - Dokumentasikan complex logic
> - Minta feedback user untuk UX improvement
