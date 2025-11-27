/**
 * Main Application Controller
 * Mengelola inisialisasi dan koordinasi antar modules
 */

import { PrayerTimesAPI } from "./prayer-times.js";
import { HijriCalendar } from "./hijri-calendar.js";
import { FastingTracker } from "./tracker.js";
import { Storage } from "./storage.js";
import { Utils } from "./utils.js";
import { Config } from "./config.js";

export class App {
  constructor() {
    // Initialize modules
    this.prayerTimesAPI = new PrayerTimesAPI();
    this.hijriCalendar = new HijriCalendar();
    this.tracker = new FastingTracker();

    // App state
    this.config = null;
    this.currentData = {
      todayDate: null,
      prayerTimes: null,
      hijriDate: null,
      ayyamulBidhInfo: null,
    };

    // Interval IDs for cleanup (Priority 1: Memory leak fix)
    this.intervals = [];
    this.clockInterval = null; // Real-time clock interval
  }

  /**
   * Initialize aplikasi
   */
  async init() {
    try {
      // Load config dari localStorage
      this.config = Storage.get(Config.STORAGE_KEYS.APP_CONFIG);

      // Cek first time setup
      if (!this.config || !this.config.first_time_setup) {
        await this.showSetupWizard();
      } else {
        await this.loadApp();
      }
    } catch (error) {
      console.error("Error initializing app:", error);
      this.showError("Gagal menginisialisasi aplikasi");
    }
  }

  /**
   * Setup wizard untuk first time user
   */
  async showSetupWizard() {
    // Show modal atau redirect ke halaman setup
    const setupModal = document.getElementById("setupModal");
    if (setupModal) {
      const modal = new bootstrap.Modal(setupModal);
      modal.show();
    }

    // Setup event listeners untuk setup form
    this.setupLocationFormListeners();
  }

  /**
   * Setup event listeners untuk form lokasi
   */
  setupLocationFormListeners() {
    // Auto-detect location button
    const autoDetectBtn = document.getElementById("autoDetectLocation");
    if (autoDetectBtn) {
      autoDetectBtn.addEventListener("click", () => this.autoDetectLocation());
    }

    // Manual location form
    const setupForm = document.getElementById("setupForm");
    if (setupForm) {
      setupForm.addEventListener("submit", (e) => {
        e.preventDefault();
        this.saveLocationFromForm();
      });
    }
  }

  /**
   * Auto-detect lokasi menggunakan Geolocation API
   */
  autoDetectLocation() {
    if (!navigator.geolocation) {
      this.showError("Browser Anda tidak mendukung deteksi lokasi");
      return;
    }

    const statusEl = document.getElementById("locationStatus");
    if (statusEl) {
      statusEl.textContent = "Mendeteksi lokasi...";
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        // Save location
        await this.saveLocation({
          latitude,
          longitude,
          method: "gps",
        });

        if (statusEl) {
          statusEl.textContent = "Lokasi terdeteksi!";
          statusEl.className = "text-success";
        }

        // Load app
        setTimeout(() => this.completeSetup(), 1000);
      },
      (error) => {
        console.error("Geolocation error:", error);
        this.showError(
          "Gagal mendeteksi lokasi. Silakan pilih kota secara manual."
        );

        if (statusEl) {
          statusEl.textContent = "Gagal mendeteksi lokasi";
          statusEl.className = "text-danger";
        }
      }
    );
  }

  /**
   * Save lokasi dari form manual
   */
  async saveLocationFromForm() {
    const city = document.getElementById("citySelect")?.value;
    const country =
      document.getElementById("countryInput")?.value || "Indonesia";

    if (!city) {
      this.showError("Pilih kota terlebih dahulu");
      return;
    }

    await this.saveLocation({
      city,
      country,
      method: "manual",
    });

    this.completeSetup();
  }

  /**
   * Save konfigurasi lokasi
   */
  async saveLocation(locationData) {
    this.config = {
      location: locationData,
      prayer_method: Config.API.DEFAULT_METHOD, // Default: Kemenag RI (Akurat)
      first_time_setup: true,
    };

    Storage.save(Config.STORAGE_KEYS.APP_CONFIG, this.config);
  }

  /**
   * Complete setup dan load app
   */
  async completeSetup() {
    // Hide setup modal
    const setupModal = document.getElementById("setupModal");
    if (setupModal) {
      const modal = bootstrap.Modal.getInstance(setupModal);
      if (modal) {
        modal.hide();
      }
    }

    // Load app
    await this.loadApp();
  }

  /**
   * Load aplikasi utama
   */
  async loadApp() {
    try {
      // Show loading
      this.showLoading(true);

      // Load data in correct order
      // Load basic data first (parallel)
      await Promise.all([this.loadTodayDate(), this.loadPrayerTimes()]);

      // Load Hijri date first (required for Ayyamul Bidh)
      await this.loadHijriDate();

      // Then load Ayyamul Bidh info (depends on Hijri date)
      await this.loadAyyamulBidhInfo();

      // Render UI
      this.renderDashboard();

      // Setup auto-update
      this.setupAutoUpdate();

      // Setup real-time clock
      this.setupClock();

      // Hide loading
      this.showLoading(false);
    } catch (error) {
      console.error("Error loading app:", error);
      this.showError("Gagal memuat data. Menggunakan data cache...");
      this.showLoading(false);
    }
  }

  /**
   * Load tanggal hari ini
   */
  async loadTodayDate() {
    this.currentData.todayDate = Utils.getCurrentDate();
  }

  /**
   * Load waktu shalat
   * Priority 2: Added user notification
   * Priority 4: Removed debug console.log
   */
  async loadPrayerTimes() {
    try {
      const location = this.config.location;
      const method = this.config.prayer_method || Config.API.DEFAULT_METHOD;

      this.currentData.prayerTimes =
        await this.prayerTimesAPI.getPrayerTimesWithCache(location, method);
    } catch (error) {
      console.error("Error loading prayer times:", error);
      Utils.showToast(
        "Gagal memuat waktu sholat terbaru. Menggunakan data tersimpan.",
        "warning"
      );
    }
  }

  /**
   * Load tanggal Hijri
   * Priority 2: Added user notification
   * Priority 4: Removed debug console.log
   */
  async loadHijriDate() {
    try {
      this.currentData.hijriDate =
        await this.hijriCalendar.getCurrentHijriDate();
    } catch (error) {
      console.error("Error loading Hijri date:", error);
      Utils.showToast(
        "Gagal memuat tanggal Hijri. Periksa koneksi internet.",
        "error"
      );
    }
  }

  /**
   * Load info Ayyamul Bidh
   * Priority 2: Added user notification
   * Priority 4: Removed debug console.log
   */
  async loadAyyamulBidhInfo() {
    try {
      if (this.currentData.hijriDate) {
        this.currentData.ayyamulBidhInfo =
          this.hijriCalendar.calculateDaysUntilNextAyyamulBidh(
            this.currentData.hijriDate
          );
      } else {
        Utils.showToast("Informasi Ayyamul Bidh tidak dapat dimuat", "warning");
      }
    } catch (error) {
      console.error("Error loading Ayyamul Bidh info:", error);
      Utils.showToast("Gagal menghitung info Ayyamul Bidh", "error");
    }
  }

  /**
   * Render dashboard
   */
  renderDashboard() {
    // Update tanggal
    this.updateDateDisplay();

    // Update waktu shalat
    this.updatePrayerTimesDisplay();

    // Update countdown Ayyamul Bidh
    this.updateAyyamulBidhDisplay();

    // Update stats
    this.updateStatsDisplay();
  }

  /**
   * Update tampilan tanggal
   */
  updateDateDisplay() {
    // Gregorian date
    const gregorianEl = document.getElementById("gregorianDate");
    if (gregorianEl && this.currentData.todayDate) {
      gregorianEl.textContent = Utils.formatDate(
        this.currentData.todayDate,
        "long"
      );
    }

    // Hijri date
    const hijriEl = document.getElementById("hijriDate");
    if (hijriEl && this.currentData.hijriDate) {
      hijriEl.textContent = this.currentData.hijriDate.formatted;
    }
  }

  /**
   * Update tampilan waktu shalat
   * Priority 5: XSS fix using createElement instead of innerHTML
   */
  updatePrayerTimesDisplay() {
    if (!this.currentData.prayerTimes) return;

    const timings = this.currentData.prayerTimes.timings;

    // Update individual prayer times
    const prayerElements = {
      fajrTime: timings.Fajr,
      dhuhrTime: timings.Dhuhr,
      asrTime: timings.Asr,
      maghribTime: timings.Maghrib,
      ishaTime: timings.Isha,
      imsakTime: timings.Imsak,
    };

    for (const [id, time] of Object.entries(prayerElements)) {
      const el = document.getElementById(id);
      if (el) {
        el.textContent = Utils.formatTime(time);
      }
    }

    // Update next prayer (Priority 5: XSS fix - using createElement)
    const nextPrayer = this.prayerTimesAPI.getNextPrayerTime(timings);
    const nextPrayerEl = document.getElementById("nextPrayer");
    if (nextPrayerEl && nextPrayer) {
      // Clear existing content safely using textContent
      nextPrayerEl.textContent = "";

      // Create elements safely
      const strongEl = document.createElement("strong");
      strongEl.textContent = nextPrayer.name;

      const timeText = document.createTextNode(` - ${nextPrayer.time}`);
      const brEl = document.createElement("br");

      const smallEl = document.createElement("small");
      smallEl.className = "text-muted";
      smallEl.textContent = `Akan tiba dalam ${nextPrayer.countdown}`;

      // Append elements
      nextPrayerEl.appendChild(strongEl);
      nextPrayerEl.appendChild(timeText);
      nextPrayerEl.appendChild(brEl);
      nextPrayerEl.appendChild(smallEl);
    }

    // Highlight current prayer
    const currentPrayer = this.prayerTimesAPI.getCurrentPrayerTime(timings);
    if (currentPrayer) {
      // Add highlight class to current prayer
      document.querySelectorAll(".prayer-time-card").forEach((card) => {
        card.classList.remove("active-prayer");
      });

      const currentCard = document.querySelector(
        `[data-prayer="${currentPrayer.toLowerCase()}"]`
      );
      if (currentCard) {
        currentCard.classList.add("active-prayer");
      }
    }
  }

  /**
   * Update tampilan Ayyamul Bidh
   */
  updateAyyamulBidhDisplay() {
    const messageEl = document.getElementById("ayyamulBidhMessage");
    const progressEl = document.getElementById("ayyamulBidhProgress");

    if (!this.currentData.ayyamulBidhInfo) {
      // Fallback message when data is not available
      if (messageEl) {
        messageEl.textContent =
          "Informasi Ayyamul Bidh tidak tersedia. Silakan refresh halaman atau periksa koneksi internet.";
        messageEl.className = "alert alert-warning";
      }
      if (progressEl) {
        progressEl.style.width = "0%";
      }
      return;
    }

    const info = this.currentData.ayyamulBidhInfo;

    // Update message
    if (messageEl) {
      messageEl.textContent = info.message;

      // Add special class jika hari ini puasa
      if (info.status === "current") {
        messageEl.className = "alert alert-success fw-bold";
      } else {
        messageEl.className = "alert alert-info";
      }
    }

    // Update countdown
    const countdownEl = document.getElementById("ayyamulBidhCountdown");
    if (countdownEl && info.daysUntil > 0) {
      countdownEl.textContent = info.daysUntil;
    }

    // Update progress bar based on actual fasting completion
    if (progressEl && this.currentData.hijriDate) {
      const currentMonth = this.currentData.hijriDate.month;
      const currentYear = this.currentData.hijriDate.year;

      // Get actual fasting stats from tracker
      const monthStats = this.tracker.getMonthlyStats(
        currentMonth,
        currentYear
      );
      const completedDays = monthStats.totalDays; // 0-3
      const progress = (completedDays / 3) * 100; // Calculate percentage

      progressEl.style.width = `${progress}%`;
      progressEl.setAttribute("aria-valuenow", progress);

      // Update progress bar text content
      progressEl.textContent = `${completedDays}/3 hari (${Math.round(
        progress
      )}%)`;
    }
  }

  /**
   * Update tampilan statistik
   */
  updateStatsDisplay() {
    if (!this.currentData.hijriDate) return;

    const currentMonth = this.currentData.hijriDate.month;
    const currentYear = this.currentData.hijriDate.year;

    // Monthly stats
    const monthStats = this.tracker.getMonthlyStats(currentMonth, currentYear);
    const monthStatsEl = document.getElementById("monthlyStats");
    if (monthStatsEl) {
      monthStatsEl.textContent = `${monthStats.totalDays}/3`;
    }

    // Yearly stats
    const yearStats = this.tracker.getYearlyStats(currentYear);
    const yearStatsEl = document.getElementById("yearlyStats");
    if (yearStatsEl) {
      yearStatsEl.textContent = `${yearStats.totalDays}/36`;
    }

    // Streak
    const streak = this.tracker.getCurrentStreak(currentMonth, currentYear);
    const streakEl = document.getElementById("currentStreak");
    if (streakEl) {
      streakEl.textContent = `${streak} bulan`;
    }
  }

  /**
   * Setup auto-update (countdown, dll)
   * Priority 1: Save interval IDs for cleanup
   */
  setupAutoUpdate() {
    // Clear existing intervals first
    this.clearIntervals();

    // Update countdown setiap menit
    const minuteInterval = setInterval(() => {
      this.updatePrayerTimesDisplay();
    }, Config.INTERVALS.PRAYER_COUNTDOWN_UPDATE);
    this.intervals.push(minuteInterval);

    // Re-fetch data setiap jam
    const hourInterval = setInterval(async () => {
      await this.loadPrayerTimes();
      this.updatePrayerTimesDisplay();
    }, Config.INTERVALS.DATA_REFRESH);
    this.intervals.push(hourInterval);
  }

  /**
   * Show/hide loading indicator
   */
  showLoading(show) {
    const loadingEl = document.getElementById("loadingIndicator");
    if (loadingEl) {
      loadingEl.style.display = show ? "block" : "none";
    }
  }

  /**
   * Show error message
   */
  showError(message) {
    Utils.showToast(message, "error");
    console.error(message);
  }

  /**
   * Clear all intervals
   * Priority 1: Cleanup method
   */
  clearIntervals() {
    this.intervals.forEach((id) => clearInterval(id));
    this.intervals = [];

    // Clear clock interval too
    if (this.clockInterval) {
      clearInterval(this.clockInterval);
      this.clockInterval = null;
    }
  }

  /**
   * Cleanup resources (call on page unload)
   * Priority 1: Destroy method to prevent memory leak
   */
  destroy() {
    this.clearIntervals();
  }

  /**
   * Setup real-time clock
   */
  setupClock() {
    // Clear existing clock interval
    if (this.clockInterval) {
      clearInterval(this.clockInterval);
    }

    // Initial update
    this.updateClock();

    // Update every second
    this.clockInterval = setInterval(() => {
      this.updateClock();
    }, Config.INTERVALS.SECOND);
  }

  /**
   * Update clock display
   */
  updateClock() {
    const clockEl = document.getElementById("currentTime");
    const timezoneEl = document.getElementById("currentTimezone");

    if (!clockEl) return;

    const now = new Date();

    // Format time (HH:MM:SS)
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");

    clockEl.textContent = `${hours}:${minutes}:${seconds}`;

    // Determine timezone
    if (timezoneEl) {
      const timezone = Utils.getIndonesianTimezone();
      timezoneEl.textContent = timezone;
    }
  }

  /**
   * Refresh all data
   */
  async refresh() {
    await this.loadApp();
  }
}
