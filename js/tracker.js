/**
 * Fasting Tracker Module
 * Mengelola tracking dan statistik puasa Ayyamul Bidh
 */

import { Storage } from "./storage.js";
import { Utils } from "./utils.js";

export class FastingTracker {
  constructor() {
    this.storageKey = "puasa_ayyamul_bidh";
    this.loadData();
  }

  /**
   * Load data dari localStorage
   */
  loadData() {
    this.data = Storage.get(this.storageKey) || {};
  }

  /**
   * Save data ke localStorage
   */
  saveData() {
    Storage.save(this.storageKey, this.data);
  }

  /**
   * Get key untuk bulan Hijri (format: YYYY-MM)
   * @param {number} month - Bulan Hijri
   * @param {number} year - Tahun Hijri
   * @returns {string} Key format YYYY-MM
   */
  getMonthKey(month, year) {
    return `${year}-${String(month).padStart(2, "0")}`;
  }

  /**
   * Tandai hari puasa
   * @param {number} hijriDay - Hari dalam bulan Hijri (13, 14, atau 15)
   * @param {number} hijriMonth - Bulan Hijri
   * @param {number} hijriYear - Tahun Hijri
   * @returns {boolean} True jika berhasil
   */
  markFasting(hijriDay, hijriMonth, hijriYear) {
    // Validasi: harus tanggal 13, 14, atau 15
    if (![13, 14, 15].includes(hijriDay)) {
      console.warn("Bukan hari Ayyamul Bidh (harus 13, 14, atau 15)");
      return false;
    }

    const monthKey = this.getMonthKey(hijriMonth, hijriYear);

    // Inisialisasi array untuk bulan ini jika belum ada
    if (!this.data[monthKey]) {
      this.data[monthKey] = [];
    }

    // Tambahkan jika belum ada
    if (!this.data[monthKey].includes(hijriDay)) {
      this.data[monthKey].push(hijriDay);
      this.data[monthKey].sort(); // Sort ascending
      this.saveData();
      return true;
    }

    return false;
  }

  /**
   * Unmark/hapus tandai hari puasa
   * @param {number} hijriDay - Hari dalam bulan Hijri
   * @param {number} hijriMonth - Bulan Hijri
   * @param {number} hijriYear - Tahun Hijri
   * @returns {boolean} True jika berhasil
   */
  unmarkFasting(hijriDay, hijriMonth, hijriYear) {
    const monthKey = this.getMonthKey(hijriMonth, hijriYear);

    if (!this.data[monthKey]) {
      return false;
    }

    const index = this.data[monthKey].indexOf(hijriDay);
    if (index > -1) {
      this.data[monthKey].splice(index, 1);

      // Hapus key jika array kosong
      if (this.data[monthKey].length === 0) {
        delete this.data[monthKey];
      }

      this.saveData();
      return true;
    }

    return false;
  }

  /**
   * Toggle status puasa (mark/unmark)
   * @param {number} hijriDay - Hari dalam bulan Hijri
   * @param {number} hijriMonth - Bulan Hijri
   * @param {number} hijriYear - Tahun Hijri
   * @returns {boolean} True jika marked, false jika unmarked
   */
  toggleFasting(hijriDay, hijriMonth, hijriYear) {
    if (this.isFastingMarked(hijriDay, hijriMonth, hijriYear)) {
      this.unmarkFasting(hijriDay, hijriMonth, hijriYear);
      return false;
    } else {
      this.markFasting(hijriDay, hijriMonth, hijriYear);
      return true;
    }
  }

  /**
   * Cek apakah hari tertentu sudah ditandai
   * @param {number} hijriDay - Hari dalam bulan Hijri
   * @param {number} hijriMonth - Bulan Hijri
   * @param {number} hijriYear - Tahun Hijri
   * @returns {boolean} True jika sudah ditandai
   */
  isFastingMarked(hijriDay, hijriMonth, hijriYear) {
    const monthKey = this.getMonthKey(hijriMonth, hijriYear);
    return this.data[monthKey] ? this.data[monthKey].includes(hijriDay) : false;
  }

  /**
   * Get statistik untuk bulan tertentu
   * @param {number} hijriMonth - Bulan Hijri
   * @param {number} hijriYear - Tahun Hijri
   * @returns {object} Statistik bulan
   */
  getMonthlyStats(hijriMonth, hijriYear) {
    const monthKey = this.getMonthKey(hijriMonth, hijriYear);
    const markedDays = this.data[monthKey] || [];
    const totalDays = markedDays.length;
    const isComplete = totalDays === 3;
    const percentage = Math.round((totalDays / 3) * 100);

    return {
      month: hijriMonth,
      monthName: Utils.getHijriMonthName(hijriMonth),
      year: hijriYear,
      markedDays: markedDays,
      totalDays: totalDays,
      isComplete: isComplete,
      percentage: percentage,
      status: totalDays === 3 ? "complete" : totalDays > 0 ? "partial" : "none",
    };
  }

  /**
   * Get statistik untuk tahun tertentu
   * @param {number} hijriYear - Tahun Hijri
   * @returns {object} Statistik tahun
   */
  getYearlyStats(hijriYear) {
    let totalDays = 0;
    let completeMonths = 0;
    let partialMonths = 0;
    const monthlyDetails = [];

    for (let month = 1; month <= 12; month++) {
      const monthStats = this.getMonthlyStats(month, hijriYear);
      monthlyDetails.push(monthStats);

      totalDays += monthStats.totalDays;

      if (monthStats.isComplete) {
        completeMonths++;
      } else if (monthStats.totalDays > 0) {
        partialMonths++;
      }
    }

    const maxPossibleDays = 36; // 12 bulan × 3 hari
    const percentage = Math.round((totalDays / maxPossibleDays) * 100);

    return {
      year: hijriYear,
      totalDays: totalDays,
      maxPossibleDays: maxPossibleDays,
      percentage: percentage,
      completeMonths: completeMonths,
      partialMonths: partialMonths,
      emptyMonths: 12 - completeMonths - partialMonths,
      monthlyDetails: monthlyDetails,
    };
  }

  /**
   * Get total hari puasa sepanjang waktu
   * @returns {number} Total hari puasa
   */
  getTotalFastingDays() {
    let total = 0;
    for (const monthKey in this.data) {
      total += this.data[monthKey].length;
    }
    return total;
  }

  /**
   * Get current streak (bulan berturut-turut yang complete)
   * @param {number} currentMonth - Bulan Hijri saat ini
   * @param {number} currentYear - Tahun Hijri saat ini
   * @returns {number} Jumlah bulan streak
   */
  getCurrentStreak(currentMonth, currentYear) {
    let streak = 0;
    let month = currentMonth - 1; // Mulai dari bulan lalu
    let year = currentYear;

    while (true) {
      if (month < 1) {
        month = 12;
        year--;
      }

      const monthStats = this.getMonthlyStats(month, year);

      if (monthStats.isComplete) {
        streak++;
        month--;
      } else {
        break;
      }

      // Limit untuk mencegah infinite loop (max 24 bulan)
      if (streak >= 24) break;
    }

    return streak;
  }

  /**
   * Get longest streak
   * @returns {number} Longest streak
   */
  getLongestStreak() {
    const allMonths = Object.keys(this.data)
      .filter((key) => this.data[key].length === 3)
      .sort();

    if (allMonths.length === 0) return 0;

    let longestStreak = 1;
    let currentStreak = 1;

    for (let i = 1; i < allMonths.length; i++) {
      const [prevYear, prevMonth] = allMonths[i - 1].split("-").map(Number);
      const [currYear, currMonth] = allMonths[i].split("-").map(Number);

      // Cek apakah bulan berurutan
      const isConsecutive =
        (currYear === prevYear && currMonth === prevMonth + 1) ||
        (currYear === prevYear + 1 && prevMonth === 12 && currMonth === 1);

      if (isConsecutive) {
        currentStreak++;
        longestStreak = Math.max(longestStreak, currentStreak);
      } else {
        currentStreak = 1;
      }
    }

    return longestStreak;
  }

  /**
   * Get history puasa (semua data)
   * @returns {Array} Array history
   */
  getFastingHistory() {
    const history = [];

    for (const monthKey in this.data) {
      const [year, month] = monthKey.split("-").map(Number);
      history.push({
        monthKey: monthKey,
        month: month,
        monthName: Utils.getHijriMonthName(month),
        year: year,
        days: this.data[monthKey],
        ...this.getMonthlyStats(month, year),
      });
    }

    // Sort by year and month descending (terbaru di atas)
    history.sort((a, b) => {
      if (a.year !== b.year) return b.year - a.year;
      return b.month - a.month;
    });

    return history;
  }

  /**
   * Export history ke JSON
   * @returns {object} Data untuk export
   */
  exportHistory() {
    return {
      puasa_ayyamul_bidh: this.data,
      exported_at: new Date().toISOString(),
      total_days: this.getTotalFastingDays(),
      longest_streak: this.getLongestStreak(),
    };
  }

  /**
   * Import history dari JSON
   * @param {object} data - Data yang akan di-import
   * @returns {boolean} True jika berhasil
   */
  importHistory(data) {
    try {
      if (data.puasa_ayyamul_bidh) {
        this.data = data.puasa_ayyamul_bidh;
        this.saveData();
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error importing history:", error);
      return false;
    }
  }

  /**
   * Reset semua data
   */
  resetAll() {
    this.data = {};
    this.saveData();
  }
}
