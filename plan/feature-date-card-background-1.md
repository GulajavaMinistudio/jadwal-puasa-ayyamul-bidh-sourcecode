---
goal: Menambahkan Background Image Masjid pada Date Card di Halaman Utama
version: 1.0
date_created: 2025-11-27
last_updated: 2025-11-27
owner: Gulajava Ministudio
status: 'Planned'
tags: [feature, design, ui-enhancement, visual-improvement]
---

# Introduction

![Status: Planned](https://img.shields.io/badge/status-Planned-blue)

Implementasi background image masjid (`hero_image_mosque.jpg`) pada date card "HARI INI" di halaman utama aplikasi untuk meningkatkan estetika Islami sambil mempertahankan readability teks 100%. Menggunakan teknik gradient overlay semi-transparan untuk menciptakan visual yang elegan namun tetap fungsional.

## 1. Requirements & Constraints

### Functional Requirements
- **REQ-001**: Background image harus terlihat subtle dan tidak mengganggu keterbacaan teks
- **REQ-002**: Teks pada card (HARI INI, tanggal Gregorian, tanggal Hijriah) harus tetap 100% readable
- **REQ-003**: Background harus responsive di berbagai ukuran layar (mobile, tablet, desktop)
- **REQ-004**: Implementasi harus backward compatible dengan design system yang ada

### Design Requirements
- **DES-001**: Menggunakan gambar `assets/images/hero_image_mosque.jpg` sebagai background
- **DES-002**: Background harus memiliki gradient overlay semi-transparan (white opacity 0.85-0.93)
- **DES-003**: Fokus background pada area kubah masjid (`background-position: center 65%`)
- **DES-004**: Minimal height card: 180px untuk memberikan ruang yang cukup

### Technical Constraints
- **CON-001**: Tidak mengubah struktur HTML yang sudah ada secara drastis
- **CON-002**: Menggunakan CSS murni, tidak menggunakan JavaScript untuk background handling
- **CON-003**: Gambar harus dioptimasi untuk performa (target size: <150KB)
- **CON-004**: Harus kompatibel dengan Bootstrap 5.3.8 yang sudah digunakan

### Performance Requirements
- **PER-001**: Total file size gambar (optimized) maksimal 150KB
- **PER-002**: Tidak menambah blocking resources yang memperlambat First Contentful Paint
- **PER-003**: Background image harus menggunakan lazy loading jika memungkinkan

### Accessibility Guidelines
- **ACC-001**: Contrast ratio teks terhadap background minimal 4.5:1 (WCAG AA standard)
- **ACC-002**: Text shadow ditambahkan untuk meningkatkan readability

## 2. Implementation Steps

### Implementation Phase 1: Asset Preparation

- GOAL-001: Optimasi gambar background untuk performa optimal

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-001 | Resize gambar `hero_image_mosque.jpg` ke max width 1200px jika lebih besar | | |
| TASK-002 | Compress gambar menggunakan tools (TinyJPG/ImageOptim) target 100-150KB | | |
| TASK-003 | Buat versi WebP dari gambar untuk browser modern (optional enhancement) | | |
| TASK-004 | Backup gambar original ke folder `assets/images/original/` | | |

### Implementation Phase 2: HTML Structure Update

- GOAL-002: Modifikasi struktur HTML date card untuk mendukung layered background

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-005 | Cari dan identifikasi date card di `index.html` (section dengan class card yang menampilkan tanggal) | | |
| TASK-006 | Tambahkan class `date-card-with-bg` pada parent card element | | |
| TASK-007 | Tambahkan `<div class="date-card-bg"></div>` sebagai background layer | | |
| TASK-008 | Tambahkan class `date-card-content` pada card-body untuk content layer | | |

### Implementation Phase 3: CSS Implementation

- GOAL-003: Implementasi styling dengan gradient overlay strategy

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-009 | Buat atau buka file `css/components.css` untuk menambahkan styling | | |
| TASK-010 | Tambahkan style untuk `.date-card-with-bg` (position relative, overflow hidden, min-height 180px) | | |
| TASK-011 | Implementasi `.date-card-bg` dengan background image, size cover, position center 65% | | |
| TASK-012 | Tambahkan `::before` pseudo-element untuk gradient overlay dengan opacity 0.88-0.93 | | |
| TASK-013 | Style `.date-card-content` dengan position relative dan z-index 2 | | |
| TASK-014 | Tambahkan text-shadow pada h3 dan .text-success untuk extra readability | | |

### Implementation Phase 4: Responsive Optimization

- GOAL-004: Pastikan design responsive di berbagai breakpoint

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-015 | Tambahkan media query untuk tablet (max-width: 768px) jika perlu adjustment | | |
| TASK-016 | Implementasi media query untuk mobile (max-width: 576px) dengan bg-position center dan min-height 150px | | |
| TASK-017 | Test di berbagai device size menggunakan browser DevTools | | |

### Implementation Phase 5: Testing & Validation

- GOAL-005: Validasi implementasi di berbagai kondisi

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-018 | Test readability teks di light mode pada berbagai browser (Chrome, Firefox, Safari) | | |
| TASK-019 | Verify contrast ratio menggunakan tools accessibility checker | | |
| TASK-020 | Test performa loading menggunakan Lighthouse atau PageSpeed Insights | | |
| TASK-021 | Cross-device testing (desktop, tablet, mobile) | | |
| TASK-022 | Ambil screenshot before/after untuk dokumentasi | | |

### Implementation Phase 6: Documentation & Cleanup

- GOAL-006: Dokumentasi perubahan dan cleanup

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-023 | Update `README.md` dengan informasi tentang background image jika relevan | | |
| TASK-024 | Commit changes dengan descriptive commit message | | |
| TASK-025 | Update walkthrough.md dengan hasil implementasi | | |

## 3. Alternatives

- **ALT-001**: **Blur + Opacity Filter** - Menggunakan `filter: blur(2px) opacity(0.25)` tanpa gradient overlay. Ditolak karena memerlukan layer terpisah dan bisa memblur teks juga.

- **ALT-002**: **Duotone Effect with Grayscale** - Menggunakan `filter: grayscale(100%) opacity(0.15)` dengan blend mode. Ditolak karena menghilangkan warna asli masjid yang indah (biru kubah).

- **ALT-003**: **CSS Background Blend Mode** - Menggunakan `background-blend-mode` untuk blending. Ditolak karena kurang flexible dalam kontroling opacity dan gradasi.

- **ALT-004**: **Multiple Background Images** - Stack multiple backgrounds (image + gradient). Lebih simple tapi kurang control untuk fine-tuning.

- **ALT-005**: **Using SVG Mask/Clip-path** - Terlalu complex untuk use case sederhana ini.

**Selected Approach**: Gradient Overlay dengan `::before` pseudo-element dipilih karena:
- Memberikan kontrol penuh terhadap opacity gradient
- Tidak memerlukan additional DOM elements
- Browser compatibility excellent
- Easy to adjust dan maintain

## 4. Dependencies

- **DEP-001**: **Bootstrap 5.3.8** - Existing CSS framework, harus ensure tidak conflict dengan classes Bootstrap
- **DEP-002**: **Image Asset** - `assets/images/hero_image_mosque.jpg` harus tersedia dan accessible
- **DEP-003**: **Browser Support** - Targeting modern browsers yang support CSS gradient dan pseudo-elements (IE11+)
- **DEP-004**: **Font Libraries** - Google Fonts (Inter, Amiri) untuk text rendering yang konsisten

## 5. Files

### Files to Modify
- **FILE-001**: `index.html` - Update HTML structure date card dengan class dan div background layer
- **FILE-002**: `css/components.css` (atau `css/style.css`) - Tambahkan CSS styling untuk background
- **FILE-003**: `README.md` (optional) - Update dokumentasi jika relevan

### Files to Create
- **FILE-004**: `assets/images/hero_image_mosque.webp` (optional) - WebP version untuk modern browsers
- **FILE-005**: `assets/images/original/hero_image_mosque.jpg` - Backup original image

### Files Potentially Affected
- **FILE-006**: Any CSS file yang override card styling (verify tidak ada conflict)

## 6. Testing

### Visual Testing
- **TEST-001**: **Screenshot Comparison Test** - Capture before/after screenshots di 3 breakpoints (mobile, tablet, desktop)
- **TEST-002**: **Cross-Browser Visual Test** - Test visual consistency di Chrome, Firefox, Safari, Edge
- **TEST-003**: **Dark/Light Mode Test** - Verify jika aplikasi punya dark mode (currently tidak ada)

### Accessibility Testing
- **TEST-004**: **Contrast Ratio Test** - Menggunakan WAVE atau axe DevTools, verify minimum 4.5:1 untuk text
- **TEST-005**: **Screen Reader Test** - Pastikan background tidak mengganggu screen reader experience

### Performance Testing
- **TEST-006**: **Lighthouse Performance Test** - Target score minimal 90 untuk Performance
- **TEST-007**: **Image Load Test** - Verify lazy loading works correctly
- **TEST-008**: **Mobile Network Test** - Test dengan throttling 3G untuk memastikan UX tetap baik

### Responsive Testing
- **TEST-009**: **Breakpoint Test** - Test di semua major breakpoints (320px, 576px, 768px, 992px, 1200px)
- **TEST-010**: **Orientation Test** - Test portrait dan landscape mode di mobile/tablet

### Functional Testing
- **TEST-011**: **Text Readability Test** - User testing dengan 2-3 orang untuk feedback readability
- **TEST-012**: **Regression Test** - Pastikan fitur lain di halaman (prayer times, calendar, dll) tidak terpengaruh

## 7. Risks & Assumptions

### Risks
- **RISK-001**: **Text Readability Issues** - Background terlalu dominan mengurangi readability
  - **Mitigation**: Fine-tune opacity gradient, tambahkan text-shadow, A/B testing dengan user

- **RISK-002**: **Performance Degradation** - Large image memperlambat page load
  - **Mitigation**: Optimize image size, use WebP, implement lazy loading

- **RISK-003**: **Mobile Experience** - Background terlalu ramai di layar kecil
  - **Mitigation**: Tingkatkan opacity di mobile, atau disable background di viewport kecil

- **RISK-004**: **Browser Compatibility** - Older browsers tidak support CSS yang digunakan
  - **Mitigation**: Progressive enhancement, provide fallback plain background

- **RISK-005**: **Aesthetic Mismatch** - Biru dari masjid clash dengan green brand color
  - **Mitigation**: Extensive color testing, ready to adjust atau use grayscale filter

### Assumptions
- **ASSUMPTION-001**: Gambar `hero_image_mosque.jpg` sudah tersedia dan berkualitas tinggi
- **ASSUMPTION-002**: Target audience menggunakan modern browsers (last 2 versions)
- **ASSUMPTION-003**: Aplikasi tidak memiliki dark mode (saat ini)
- **ASSUMPTION-004**: User menginginkan peningkatan visual aesthetic
- **ASSUMPTION-005**: Performa saat ini sudah baik, ada room untuk additional asset
- **ASSUMPTION-006**: Tidak ada requirement untuk support offline mode untuk background image

## 8. Related Specifications / Further Reading

- **Analisis Lengkap**: [background-analysis.md](file:///C:/Users/riany/.gemini/antigravity/brain/06495255-7a47-43c3-9a4f-64f3de5df1fb/background-analysis.md) - Dokumen analisis teknis lengkap dengan alternative strategies
- **CSS Gradient Guide**: [MDN - Using CSS Gradients](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Images/Using_CSS_gradients)
- **WCAG Contrast Guidelines**: [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- **Image Optimization**: [Google Web Fundamentals - Image Optimization](https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/image-optimization)
- **Responsive Images**: [MDN - Responsive Images](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images)
