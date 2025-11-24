/**
 * Prayer Times Module - Aladhan API Integration
 * Mengelola semua operasi terkait waktu shalat
 */

import { Storage } from "./storage.js";
import { Utils } from "./utils.js";

export class PrayerTimesAPI {
  constructor(apiBaseURL = "https://api.aladhan.com/v1") {
    this.baseURL = apiBaseURL;
    this.defaultMethod = 20; // Kementerian Agama RI
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

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.code !== 200) {
        throw new Error("API error: " + data.status);
      }

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

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.code !== 200) {
        throw new Error("API error: " + data.status);
      }

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

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.code !== 200) {
        throw new Error("API error: " + data.status);
      }

      return data.data.map((day) => this.parseTimingsData(day));
    } catch (error) {
      console.error("Error fetching monthly calendar:", error);
      throw error;
    }
  }

  /**
   * Parse data dari API response
   * @param {object} data - Raw data dari API
   * @returns {object} Parsed data
   */
  parseTimingsData(data) {
    return {
      date: {
        gregorian: data.date.gregorian.date,
        hijri: data.date.hijri.date,
        readable: data.date.readable,
        gregorianDay: data.date.gregorian.day,
        gregorianMonth: data.date.gregorian.month.en,
        gregorianYear: data.date.gregorian.year,
        hijriDay: data.date.hijri.day,
        hijriMonth: data.date.hijri.month.en,
        hijriMonthAr: data.date.hijri.month.ar,
        hijriMonthNumber: data.date.hijri.month.number,
        hijriYear: data.date.hijri.year,
      },
      timings: {
        Fajr: data.timings.Fajr,
        Sunrise: data.timings.Sunrise,
        Dhuhr: data.timings.Dhuhr,
        Asr: data.timings.Asr,
        Sunset: data.timings.Sunset,
        Maghrib: data.timings.Maghrib,
        Isha: data.timings.Isha,
        Imsak: data.timings.Imsak,
        Midnight: data.timings.Midnight,
      },
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
    const cacheMaxAge = 24 * 60 * 60 * 1000; // 24 jam

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
    return [
      { value: 20, label: "Kementerian Agama Republik Indonesia" },
      { value: 3, label: "Muslim World League (MWL)" },
      { value: 2, label: "Islamic Society of North America (ISNA)" },
      { value: 5, label: "Egyptian General Authority of Survey" },
      { value: 4, label: "Umm Al-Qura University, Makkah" },
      { value: 1, label: "University of Islamic Sciences, Karachi" },
      { value: 7, label: "Institute of Geophysics, University of Tehran" },
    ];
  }
}
