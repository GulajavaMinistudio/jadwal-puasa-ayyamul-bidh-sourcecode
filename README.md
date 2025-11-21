# Aplikasi Web Puasa Ayyamul Bidh

Aplikasi web untuk membantu umat Muslim melacak dan mengelola jadwal puasa Ayyamul Bidh (puasa sunnah pada tanggal 13, 14, 15 Hijriyah). Dilengkapi dengan fitur jadwal waktu shalat, konversi kalender Hijriyah-Masehi, dan tracker puasa.

## 📋 Fitur Utama

- ✅ **Dashboard**: Informasi ringkas tanggal Hijriyah, countdown puasa, dan stats
- ✅ **Jadwal Waktu Shalat**: Waktu shalat berdasarkan lokasi dengan countdown real-time
- ✅ **Kalender**: Visualisasi kalender dengan highlight hari Ayyamul Bidh
- ✅ **Tracker Puasa**: Checklist dan statistik puasa yang sudah dilakukan
- ✅ **Panduan**: Informasi lengkap, doa-doa, dan FAQ tentang puasa Ayyamul Bidh
- ✅ **Pengaturan**: Konfigurasi lokasi, metode kalkulasi, export/import data

## 🚀 Teknologi

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **CSS Framework**: Bootstrap 5.3.8
- **API**: [Aladhan API](https://aladhan.com) untuk waktu shalat dan konversi Hijriyah
- **Storage**: LocalStorage (browser)
- **Icons**: Bootstrap Icons
- **Fonts**: Google Fonts (Inter, Amiri)

## 📦 Struktur Folder

```
puasa-ayyamul-bidh/
│
├── index.html              # Dashboard utama
├── jadwal-shalat.html     # Halaman jadwal shalat
├── kalender.html          # Halaman kalender (belum dibuat)
├── tracker.html           # Halaman tracker (belum dibuat)
├── panduan.html           # Halaman panduan
├── pengaturan.html        # Halaman pengaturan
│
├── css/
│   ├── style.css          # Custom CSS utama
│   └── components.css     # CSS komponen
│
├── js/
│   ├── app.js            # Main application controller
│   ├── storage.js        # LocalStorage management
│   ├── utils.js          # Helper functions
│   ├── prayer-times.js   # Prayer times API integration
│   ├── hijri-calendar.js # Hijri calendar logic
│   └── tracker.js        # Fasting tracker logic
│
├── assets/
│   ├── images/
│   └── icons/
│
└── README.md
```

## 🎯 Cara Menggunakan

### 1. Setup Awal

1. Buka `index.html` di browser
2. Pada setup wizard, pilih salah satu:
   - **Auto-detect**: Izinkan browser mendeteksi lokasi Anda (GPS)
   - **Manual**: Pilih kota dari dropdown
3. Klik "Simpan & Lanjutkan"

### 2. Dashboard

- Lihat tanggal Hijriyah dan Masehi hari ini
- Cek countdown ke puasa Ayyamul Bidh berikutnya
- Pantau waktu shalat hari ini
- Lihat statistik puasa Anda

### 3. Jadwal Shalat

- Lihat waktu shalat lengkap (Imsak, Subuh, Dzuhur, Ashar, Maghrib, Isya)
- Countdown real-time ke shalat berikutnya
- Jadwal waktu shalat bulanan dalam bentuk tabel

### 4. Tracker Puasa

- Tandai hari puasa yang sudah dilakukan
- Lihat statistik per bulan dan per tahun
- Pantau streak (bulan berturut-turut puasa lengkap)
- Export/import data untuk backup

### 5. Pengaturan

- Ubah lokasi atau metode kalkulasi waktu shalat
- Export data untuk backup
- Import data dari backup
- Reset semua data (hati-hati!)

## 🔧 Konfigurasi

### Metode Kalkulasi Waktu Shalat

Aplikasi mendukung berbagai metode kalkulasi:

- **Kementerian Agama RI** (Default untuk Indonesia)
- Muslim World League (MWL)
- Islamic Society of North America (ISNA)
- Egyptian General Authority of Survey
- Umm Al-Qura University, Makkah
- Dan lainnya

Ubah di halaman **Pengaturan**.

### Export/Import Data

- **Export**: Download data puasa Anda dalam format JSON
- **Import**: Upload file JSON yang telah di-export
- Berguna untuk backup atau pindah perangkat

## 🌐 Browser Support

Aplikasi mendukung browser modern:

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Opera (latest)

**Catatan**: Fitur Geolocation memerlukan HTTPS atau localhost.

## 📱 Mobile Friendly

Aplikasi sepenuhnya responsive dan dapat digunakan di:

- 📱 Smartphone
- 📲 Tablet
- 💻 Desktop

## 🔒 Keamanan & Privacy

- ✅ Semua data disimpan di localStorage browser (tidak ada server)
- ✅ Tidak ada tracking atau analytics
- ✅ Tidak ada iklan
- ✅ Data lokasi hanya digunakan untuk kalkulasi waktu shalat
- ✅ XSS protection dengan input sanitization
- ✅ CSP (Content Security Policy) implemented

## 🎨 Desain

Aplikasi menggunakan design system modern dengan tema Islami:

- Warna hijau emerald sebagai primary color
- Gradients dan shadows untuk depth
- Smooth animations dan transitions
- Islamic patterns (subtle)
- Typography: Inter (Latin) & Amiri (Arabic)

## 📝 TODO (Future Enhancements)

- [ ] Halaman Kalender dengan visual kalender interaktif
- [ ] Halaman Tracker dengan charts
- [ ] Notifikasi browser untuk reminder puasa
- [ ] PWA (Progressive Web App) support
- [ ] Multi-language (English, Arabic)
- [ ] Dark mode
- [ ] Share stats ke social media

## 🤝 Kontribusi

Aplikasi ini dibuat untuk kepentingan umum. Jika Anda menemukan bug atau memiliki saran, silakan buat issue atau pull request.

## 📄 Lisensi

Aplikasi ini bersifat open source dan gratis untuk digunakan oleh siapa saja.

## 🙏 Credits

- **Data Waktu Shalat**: [Aladhan API](https://aladhan.com)
- **CSS Framework**: [Bootstrap 5](https://getbootstrap.com)
- **Icons**: [Bootstrap Icons](https://icons.getbootstrap.com)
- **Fonts**: [Google Fonts](https://fonts.google.com)

---

**Catatan**: Aplikasi ini masih dalam pengembangan. Halaman Kalender dan Tracker akan segera dibuat.

**Dibuat dengan ❤️ untuk umat Muslim**

Semoga bermanfaat! 🤲
