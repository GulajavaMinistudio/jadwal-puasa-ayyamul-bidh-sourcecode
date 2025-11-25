/**
 * Prayer Times Module - Aladhan API Integration
 * Mengelola semua operasi terkait waktu shalat
 */

import { Storage } from "./storage.js";
import { Utils } from "./utils.js";
import { Config } from "./config.js";
import { Validators } from "./validators.js";

export class PrayerTimesAPI {
  constructor(apiBaseURL = Config.API.BASE_URL) {
    this.baseURL = apiBaseURL;
    this.defaultMethod = Config.API.DEFAULT_METHOD;
  }

  /**
   * Shared method untuk fetch dari API dengan error handling
   * @param {string} url - API URL
   * @returns {Promise<object>} API response data
   * @private
   */
  async _fetchFromAPI(url) {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.code !== 200) {
      throw new Error("API error: " + data.status);
    }

    return data;
  }

  /**
   * Get waktu shalat berdasarkan kota
   * @param {string} city - Nama kota
   * @param {string} country - Nama negara
   * @param {number} method - Metode kalkulasi (default: 20 untuk Kemenag RI)
   * @param {string} date - Tanggal (format: DD-MM-YYYY), default: hari ini
   * @returns {Promise<object>} Data waktu shalat
   */
  async getTimingsByCity(
    city,
    country,
    method = this.defaultMethod,
    date = null
  ) {
    try {
      const dateStr = date || Utils.formatDateForAPI(new Date());
      const url = `${
        this.baseURL
      }/timingsByCity/${dateStr}?city=${encodeURIComponent(
        city
      )}&country=${encodeURIComponent(country)}&method=${method}`;

      const data = await this._fetchFromAPI(url);
      return this.parseTimingsData(data.data);
    } catch (error) {
      console.error("Error fetching prayer times by city:", error);
      throw error;
    }
  }

  /**
   * Get waktu shalat berdasarkan koordinat
   * @param {number} latitude - Latitude
   * @param {number} longitude - Longitude
   * @param {number} method - Metode kalkulasi
   * @param {string} date - Tanggal (format: DD-MM-YYYY)
   * @returns {Promise<object>} Data waktu shalat
   */
  async getTimingsByCoordinates(
    latitude,
    longitude,
    method = this.defaultMethod,
    date = null
  ) {
    try {
      const dateStr = date || Utils.formatDateForAPI(new Date());
      const url = `${this.baseURL}/timings/${dateStr}?latitude=${latitude}&longitude=${longitude}&method=${method}`;

      const data = await this._fetchFromAPI(url);
      return this.parseTimingsData(data.data);
    } catch (error) {
      console.error("Error fetching prayer times by coordinates:", error);
      throw error;
    }
  }

  /**
   * Get kalender waktu shalat bulanan
   * @param {string} city - Nama kota
   * @param {string} country - Nama negara
   * @param {number} year - Tahun
   * @param {number} month - Bulan (1-12)
   * @param {number} method - Metode kalkulasi
   * @returns {Promise<Array>} Array data waktu shalat untuk 1 bulan
   */
  async getMonthlyCalendar(
    city,
    country,
    year,
    month,
    method = this.defaultMethod
  ) {
    try {
      const url = `${
        this.baseURL
      }/calendarByCity/${year}/${month}?city=${encodeURIComponent(
        city
      )}&country=${encodeURIComponent(country)}&method=${method}`;

      const data = await this._fetchFromAPI(url);
      return data.data.map((day) => this.parseTimingsData(day));
    } catch (error) {
      console.error("Error fetching monthly calendar:", error);
      throw error;
    }
  }

  /**
   * Parse dan validate data dari API response
   * @param {object} data - Raw data dari API
   * @returns {object} Parsed dan validated data
   */
  parseTimingsData(data) {
    // Validate date data
    const dateValidation = Validators.validateDateData(data.date);
    if (!dateValidation.valid) {
      console.warn("Invalid date data from API:", dateValidation.error);
    }

    // Validate timings
    const timingsValidation = Validators.validatePrayerTimings(data.timings);
    if (!timingsValidation.valid) {
      throw new Error(
        "Invalid prayer timings from API: " + timingsValidation.error
      );
    }

    const dateData = dateValidation.data || data.date;
    const validatedTimings = timingsValidation.data;

    return {
      date: {
        gregorian: dateData.gregorian?.date || data.date.gregorian.date,
        hijri: dateData.hijri?.date || data.date.hijri.date,
        readable: dateData.readable || data.date.readable,
        gregorianDay: dateData.gregorian?.day || data.date.gregorian.day,
        gregorianMonth:
          dateData.gregorian?.month || data.date.gregorian.month.en,
        gregorianYear: dateData.gregorian?.year || data.date.gregorian.year,
        hijriDay: dateData.hijri?.day || data.date.hijri.day,
        hijriMonth: dateData.hijri?.month?.en || data.date.hijri.month.en,
        hijriMonthAr: dateData.hijri?.month?.ar || data.date.hijri.month.ar,
        hijriMonthNumber:
          dateData.hijri?.month?.number || data.date.hijri.month.number,
        hijriYear: dateData.hijri?.year || data.date.hijri.year,
      },
      timings: validatedTimings,
    };
  }

  /**
   * Get waktu shalat dengan caching
   * @param {object} location - { city, country } atau { latitude, longitude }
   * @param {number} method - Metode kalkulasi
   * @returns {Promise<object>} Data waktu shalat
   */
  async getPrayerTimesWithCache(location, method = this.defaultMethod) {
    const cacheKey = `prayer_times_${JSON.stringify(location)}`;
    const cacheMaxAge = Config.CACHE.PRAYER_TIMES_MAX_AGE;

    // Cek cache
    if (Storage.isCacheValid(cacheKey, cacheMaxAge)) {
      console.log("Using cached prayer times");
      return Storage.getCache(cacheKey);
    }

    // Fetch dari API
    let data;
    try {
      if (location.city && location.country) {
        data = await this.getTimingsByCity(
          location.city,
          location.country,
          method
        );
      } else if (location.latitude && location.longitude) {
        data = await this.getTimingsByCoordinates(
          location.latitude,
          location.longitude,
          method
        );
      } else {
        throw new Error("Invalid location data");
      }

      // Save ke cache
      Storage.saveCache(cacheKey, data);
      return data;
    } catch (error) {
      // Jika error, coba gunakan cache lama (meskipun expired)
      const cachedData = Storage.getCache(cacheKey);
      if (cachedData) {
        console.warn("Using expired cache due to API error");
        return cachedData;
      }
      throw error;
    }
  }

  /**
   * Get waktu shalat berikutnya
   * @param {object} timings - Object waktu shalat { Fajr, Dhuhr, Asr, Maghrib, Isha }
   * @returns {object} { name: string, time: string, countdown: string }
   */
  getNextPrayerTime(timings) {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    const prayers = [
      { name: "Subuh", time: timings.Fajr },
      { name: "Dzuhur", time: timings.Dhuhr },
      { name: "Ashar", time: timings.Asr },
      { name: "Maghrib", time: timings.Maghrib },
      { name: "Isya", time: timings.Isha },
    ];

    for (const prayer of prayers) {
      const [hours, minutes] = prayer.time.split(":").map(Number);
      const prayerTime = hours * 60 + minutes;

      if (prayerTime > currentTime) {
        return {
          name: prayer.name,
          time: Utils.formatTime(prayer.time),
          countdown: Utils.calculateCountdown(prayer.time),
        };
      }
    }

    // Jika semua waktu sudah lewat, next adalah Subuh besok
    return {
      name: "Subuh",
      time: Utils.formatTime(timings.Fajr),
      countdown: Utils.calculateCountdown(timings.Fajr),
    };
  }

  /**
   * Get waktu shalat yang sedang berjalan
   * @param {object} timings - Object waktu shalat
   * @returns {string} Nama waktu shalat atau null
   */
  getCurrentPrayerTime(timings) {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    const prayerPeriods = [
      { name: "Subuh", start: timings.Fajr, end: timings.Sunrise },
      { name: "Dzuhur", start: timings.Dhuhr, end: timings.Asr },
      { name: "Ashar", start: timings.Asr, end: timings.Maghrib },
      { name: "Maghrib", start: timings.Maghrib, end: timings.Isha },
      { name: "Isya", start: timings.Isha, end: "23:59" },
    ];

    for (const period of prayerPeriods) {
      const [startHours, startMinutes] = period.start.split(":").map(Number);
      const [endHours, endMinutes] = period.end.split(":").map(Number);

      const startTime = startHours * 60 + startMinutes;
      const endTime = endHours * 60 + endMinutes;

      if (currentTime >= startTime && currentTime < endTime) {
        return period.name;
      }
    }

    return null;
  }

  /**
   * List metode kalkulasi waktu shalat
   */
  static getCalculationMethods() {
    return Config.PRAYER_METHODS;
  }
}
