/**
 * Hijri Calendar Module - Hijri Date Conversion & Ayyamul Bidh Logic
 * Mengelola konversi kalender dan kalkulasi hari Ayyamul Bidh
 */

import { Storage } from "./storage.js";
import { Utils } from "./utils.js";
import { Config } from "./config.js";
import { Validators } from "./validators.js";
import { RequestQueue } from "./request-queue.js";
import { HijriCalculator } from "./hijri-calculator.js";

export class HijriCalendar {
  constructor(apiBaseURL = Config.API.BASE_URL) {
    this.baseURL = apiBaseURL;
    this.AYYAMUL_BIDH_DATES = Config.AYYAMUL_BIDH.DATES;

    // Initialize request queue with rate limiting
    // Max 3 concurrent requests, 300ms delay between them to be safe
    this.requestQueue = new RequestQueue({
      maxConcurrent: 3,
      delay: 300,
      retryAttempts: 2,
      retryDelay: 1000,
    });
  }

  /**
   * Konversi tanggal Gregorian ke Hijri
   * @param {string} date - Tanggal format DD-MM-YYYY
   * @returns {Promise<object>} Data tanggal Hijri
   */
  async gregorianToHijri(date) {
    const cacheKey = `hijri_${date}`;

    // Cek cache (data konversi bisa di-cache permanent)
    const cached = Storage.getCache(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      // Use RequestQueue for API call
      const data = await this.requestQueue.enqueue(async () => {
        const url = `${this.baseURL}/gToH/${date}`;
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const json = await response.json();
        if (json.code !== 200) {
          throw new Error("API error: " + json.status);
        }
        return json;
      });

      // Validate dan sanitize API response
      const hijriValidation = Validators.validateHijriDate({
        day: data.data.hijri.day,
        month: data.data.hijri.month.number,
        monthName: data.data.hijri.month.en,
        year: data.data.hijri.year,
        formatted: `${data.data.hijri.day} ${data.data.hijri.month.en} ${data.data.hijri.year} H`,
      });

      if (!hijriValidation.valid) {
        throw new Error(
          "Invalid Hijri date from API: " + hijriValidation.error
        );
      }

      const result = {
        ...hijriValidation.data,
        monthNameAr: Validators.sanitizeString(data.data.hijri.month.ar),
      };

      // Save ke cache
      Storage.saveCache(cacheKey, result);
      return result;
    } catch (error) {
      console.warn(`API failed for ${date}, using local fallback:`, error);

      // Fallback to local calculation
      try {
        const [day, month, year] = date.split("-").map(Number);
        const localDate = new Date(year, month - 1, day);
        const fallbackData = HijriCalculator.gregorianToHijri(localDate);

        const fallbackResult = {
          day: fallbackData.day,
          month: fallbackData.month,
          monthName: fallbackData.monthName,
          year: fallbackData.year,
          formatted: `${fallbackData.day} ${fallbackData.monthName} ${fallbackData.year} H`,
          monthNameAr: "", // Local calc doesn't have Arabic name
          isFallback: true,
        };

        // Save fallback result to cache
        Storage.saveCache(cacheKey, fallbackResult);
        return fallbackResult;
      } catch (fallbackError) {
        console.error("Fallback calculation failed:", fallbackError);
        throw error; // Throw original error if fallback also fails
      }
    }
  }

  /**
   * Konversi tanggal Hijri ke Gregorian
   * @param {string} date - Tanggal Hijri format DD-MM-YYYY
   * @returns {Promise<object>} Data tanggal Gregorian
   */
  async hijriToGregorian(date) {
    const cacheKey = `gregorian_${date}`;

    // Cek cache
    const cached = Storage.getCache(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      // Use RequestQueue for API call
      const data = await this.requestQueue.enqueue(async () => {
        const url = `${this.baseURL}/hToG/${date}`;
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const json = await response.json();
        if (json.code !== 200) {
          throw new Error("API error: " + json.status);
        }
        return json;
      });

      const result = {
        day: parseInt(data.data.gregorian.day),
        month: parseInt(data.data.gregorian.month.number),
        monthName: Validators.sanitizeString(data.data.gregorian.month.en),
        year: parseInt(data.data.gregorian.year),
        formatted: Validators.sanitizeString(data.data.gregorian.date),
      };

      // Save ke cache
      Storage.saveCache(cacheKey, result);
      return result;
    } catch (error) {
      console.error("Error converting Hijri to Gregorian:", error);
      throw error;
    }
  }

  /**
   * Get tanggal Hijri hari ini
   * @returns {Promise<object>} Data tanggal Hijri hari ini
   */
  async getCurrentHijriDate() {
    const today = new Date();
    const dateStr = Utils.formatDateForAPI(today);
    return await this.gregorianToHijri(dateStr);
  }

  /**
   * Get tanggal Ayyamul Bidh (13, 14, 15) untuk bulan tertentu
   * @param {number} hijriMonth - Bulan Hijri (1-12)
   * @param {number} hijriYear - Tahun Hijri
   * @returns {Promise<Array>} Array tanggal Gregorian untuk Ayyamul Bidh
   */
  async getAyyamulBidhDates(hijriMonth, hijriYear) {
    const dates = [];

    for (const day of this.AYYAMUL_BIDH_DATES) {
      const hijriDate = `${String(day).padStart(2, "0")}-${String(
        hijriMonth
      ).padStart(2, "0")}-${hijriYear}`;
      try {
        const gregorian = await this.hijriToGregorian(hijriDate);
        dates.push({
          hijriDay: day,
          hijriMonth: hijriMonth,
          hijriYear: hijriYear,
          gregorianDate: new Date(
            gregorian.year,
            gregorian.month - 1,
            gregorian.day
          ),
          formatted: gregorian.formatted,
        });
      } catch (error) {
        console.error(`Error converting Hijri date ${hijriDate}:`, error);
      }
    }

    return dates;
  }

  /**
   * Cek apakah tanggal tertentu adalah hari Ayyamul Bidh
   * @param {object} hijriDate - Object dengan property day, month, year
   * @returns {boolean} True jika hari Ayyamul Bidh
   */
  isAyyamulBidhDay(hijriDate) {
    return this.AYYAMUL_BIDH_DATES.includes(hijriDate.day);
  }

  /**
   * Hitung berapa hari lagi ke Ayyamul Bidh berikutnya
   * @param {object} currentHijriDate - Object tanggal Hijri saat ini { day, month, year }
   * @returns {object} { daysUntil: number, nextDate: number, status: string }
   */
  calculateDaysUntilNextAyyamulBidh(currentHijriDate) {
    const currentDay = currentHijriDate.day;

    if (currentDay < 13) {
      // Masih menuju tanggal 13 bulan ini
      const daysLeft = 13 - currentDay;
      return {
        daysUntil: daysLeft,
        nextDate: 13,
        status: "upcoming",
        message: `🌙 Tinggal ${daysLeft} hari lagi menuju Ayyamul Bidh bulan ini!`,
      };
    } else if (currentDay >= 13 && currentDay <= 15) {
      // Sedang dalam periode Ayyamul Bidh
      return {
        daysUntil: 0,
        nextDate: currentDay,
        status: "current",
        message: `✨ HARI INI PUASA AYYAMUL BIDH! (${currentDay} ${currentHijriDate.monthName} ${currentHijriDate.year} H)`,
      };
    } else {
      // Sudah lewat, hitung ke bulan depan
      // Estimasi: bulan Hijri rata-rata 29-30 hari
      const estimatedDaysInMonth = 30;
      const daysUntilNextMonth = estimatedDaysInMonth - currentDay;
      const totalDays = daysUntilNextMonth + 13;

      return {
        daysUntil: totalDays,
        nextDate: 13,
        status: "next_month",
        message: `📅 Ayyamul Bidh bulan depan dalam ${totalDays} hari lagi`,
      };
    }
  }

  /**
   * Generate data kalender untuk bulan tertentu
   * @param {number} month - Bulan (1-12)
   * @param {number} year - Tahun
   * @param {boolean} isHijri - True jika Hijri, false jika Gregorian
   * @returns {Promise<Array>} Array data kalender
   */
  async generateMonthlyCalendar(month, year, isHijri = false) {
    const calendar = [];

    if (isHijri) {
      // Generate kalender Hijri
      // Estimasi 30 hari untuk bulan Hijri
      for (let day = 1; day <= 30; day++) {
        const hijriDate = `${String(day).padStart(2, "0")}-${String(
          month
        ).padStart(2, "0")}-${year}`;
        try {
          const gregorian = await this.hijriToGregorian(hijriDate);
          calendar.push({
            hijriDay: day,
            hijriMonth: month,
            hijriYear: year,
            gregorianDay: gregorian.day,
            gregorianMonth: gregorian.month,
            gregorianYear: gregorian.year,
            isAyyamulBidh: this.AYYAMUL_BIDH_DATES.includes(day),
          });
        } catch (error) {
          // Jika error, mungkin bulan hanya 29 hari
          break;
        }
      }
    } else {
      // Generate kalender Gregorian dengan konversi ke Hijri
      const daysInMonth = new Date(year, month, 0).getDate();

      // Create array of promises to run in parallel (controlled by RequestQueue)
      const promises = [];

      for (let day = 1; day <= daysInMonth; day++) {
        const gregorianDate = `${String(day).padStart(2, "0")}-${String(
          month
        ).padStart(2, "0")}-${year}`;

        promises.push(
          this.gregorianToHijri(gregorianDate)
            .then((hijri) => ({
              gregorianDay: day,
              gregorianMonth: month,
              gregorianYear: year,
              hijriDay: hijri.day,
              hijriMonth: hijri.month,
              hijriYear: hijri.year,
              hijriMonthName: hijri.monthName,
              isAyyamulBidh: this.AYYAMUL_BIDH_DATES.includes(hijri.day),
              isFallback: hijri.isFallback || false,
            }))
            .catch((error) => {
              console.error(`Error converting date ${gregorianDate}:`, error);
              return null;
            })
        );
      }

      // Wait for all requests to complete
      const results = await Promise.all(promises);

      // Filter out nulls (failed requests)
      calendar.push(...results.filter((item) => item !== null));
    }

    return calendar;
  }

  /**
   * Get nama bulan Hijri
   * @param {number} monthNumber - Nomor bulan (1-12)
   * @returns {string} Nama bulan
   */
  getHijriMonthName(monthNumber) {
    return Utils.getHijriMonthName(monthNumber);
  }

  /**
   * Get Ayyamul Bidh untuk beberapa bulan ke depan
   * @param {number} numberOfMonths - Jumlah bulan
   * @returns {Promise<Array>} Array data Ayyamul Bidh
   */
  async getUpcomingAyyamulBidh(numberOfMonths = 3) {
    const upcoming = [];
    const currentHijri = await this.getCurrentHijriDate();

    for (let i = 0; i < numberOfMonths; i++) {
      let month = currentHijri.month + i;
      let year = currentHijri.year;

      // Handle year overflow
      if (month > 12) {
        month = month - 12;
        year = year + 1;
      }

      const dates = await this.getAyyamulBidhDates(month, year);
      upcoming.push({
        hijriMonth: month,
        hijriMonthName: this.getHijriMonthName(month),
        hijriYear: year,
        dates: dates,
      });
    }

    return upcoming;
  }
}
