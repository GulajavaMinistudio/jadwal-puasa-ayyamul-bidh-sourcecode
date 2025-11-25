/**
 * Validators Module - Data Validation & Sanitization
 * Schema validators dan input sanitizers untuk security
 */

import { Config } from "./config.js";

export const Validators = {
  /**
   * Validate Hijri date object from API
   * @param {object} hijriData - Data from API
   * @returns {object} { valid: boolean, data: object|null, error: string|null }
   */
  validateHijriDate(hijriData) {
    if (!hijriData || typeof hijriData !== "object") {
      return {
        valid: false,
        data: null,
        error: "Invalid hijri data structure",
      };
    }

    const { day, month, year, monthName, formatted } = hijriData;

    // Validate day
    const dayNum = parseInt(day);
    if (
      isNaN(dayNum) ||
      dayNum < Config.VALIDATION.HIJRI_DAY_MIN ||
      dayNum > Config.VALIDATION.HIJRI_DAY_MAX
    ) {
      return {
        valid: false,
        data: null,
        error: `Invalid Hijri day: ${day}`,
      };
    }

    // Validate month
    const monthNum = parseInt(month);
    if (
      isNaN(monthNum) ||
      monthNum < Config.VALIDATION.HIJRI_MONTH_MIN ||
      monthNum > Config.VALIDATION.HIJRI_MONTH_MAX
    ) {
      return {
        valid: false,
        data: null,
        error: `Invalid Hijri month: ${month}`,
      };
    }

    // Validate year
    const yearNum = parseInt(year);
    if (
      isNaN(yearNum) ||
      yearNum < Config.VALIDATION.HIJRI_YEAR_MIN ||
      yearNum > Config.VALIDATION.HIJRI_YEAR_MAX
    ) {
      return {
        valid: false,
        data: null,
        error: `Invalid Hijri year: ${year}`,
      };
    }

    // Validate monthName is string
    if (typeof monthName !== "string" || monthName.trim() === "") {
      return {
        valid: false,
        data: null,
        error: "Invalid month name",
      };
    }

    // Validate formatted is string
    if (typeof formatted !== "string" || formatted.trim() === "") {
      return {
        valid: false,
        data: null,
        error: "Invalid formatted date",
      };
    }

    // Return sanitized data
    return {
      valid: true,
      data: {
        day: dayNum,
        month: monthNum,
        monthName: this.sanitizeString(monthName),
        year: yearNum,
        formatted: this.sanitizeString(formatted),
      },
      error: null,
    };
  },

  /**
   * Validate prayer timings object from API
   * @param {object} timings - Timings object from API
   * @returns {object} { valid: boolean, data: object|null, error: string|null }
   */
  validatePrayerTimings(timings) {
    if (!timings || typeof timings !== "object") {
      return {
        valid: false,
        data: null,
        error: "Invalid timings structure",
      };
    }

    const requiredTimes = [
      "Fajr",
      "Sunrise",
      "Dhuhr",
      "Asr",
      "Maghrib",
      "Isha",
      "Imsak",
    ];
    const validatedTimings = {};

    for (const timeKey of requiredTimes) {
      if (!timings[timeKey]) {
        return {
          valid: false,
          data: null,
          error: `Missing ${timeKey} time`,
        };
      }

      // Validate time format (HH:MM or HH:MM:SS)
      const timeStr = String(timings[timeKey]);
      if (!this.isValidTimeFormat(timeStr)) {
        return {
          valid: false,
          data: null,
          error: `Invalid time format for ${timeKey}: ${timeStr}`,
        };
      }

      validatedTimings[timeKey] = timeStr;
    }

    // Add optional Midnight if exists
    if (timings.Midnight && this.isValidTimeFormat(String(timings.Midnight))) {
      validatedTimings.Midnight = String(timings.Midnight);
    }

    return {
      valid: true,
      data: validatedTimings,
      error: null,
    };
  },

  /**
   * Validate date object from API
   * @param {object} dateData - Date data from API
   * @returns {object} { valid: boolean, data: object|null, error: string|null }
   */
  validateDateData(dateData) {
    if (!dateData || typeof dateData !== "object") {
      return { valid: false, data: null, error: "Invalid date structure" };
    }

    const sanitizedData = {};

    // Validate gregorian data
    if (dateData.gregorian) {
      const greg = dateData.gregorian;
      sanitizedData.gregorian = {
        date: this.sanitizeString(greg.date || ""),
        day: this.sanitizeString(greg.day || ""),
        month: this.sanitizeString(greg.month?.en || ""),
        year: this.sanitizeString(greg.year || ""),
      };
    }

    // Validate hijri data
    if (dateData.hijri) {
      const hijri = dateData.hijri;
      sanitizedData.hijri = {
        date: this.sanitizeString(hijri.date || ""),
        day: this.sanitizeString(hijri.day || ""),
        month: {
          en: this.sanitizeString(hijri.month?.en || ""),
          ar: this.sanitizeString(hijri.month?.ar || ""),
          number: parseInt(hijri.month?.number) || 0,
        },
        year: this.sanitizeString(hijri.year || ""),
      };
    }

    if (dateData.readable) {
      sanitizedData.readable = this.sanitizeString(dateData.readable);
    }

    return {
      valid: true,
      data: sanitizedData,
      error: null,
    };
  },

  /**
   * Validate localStorage data structure
   * @param {object} data - Data from localStorage
   * @param {string} expectedType - Expected data type ('config', 'fasting', 'cache')
   * @returns {object} { valid: boolean, data: object|null, error: string|null }
   */
  validateStorageData(data, expectedType) {
    if (!data || typeof data !== "object") {
      return { valid: false, data: null, error: "Invalid storage data" };
    }

    // Prevent prototype pollution
    if (
      Object.prototype.hasOwnProperty.call(data, "__proto__") ||
      Object.prototype.hasOwnProperty.call(data, "constructor") ||
      Object.prototype.hasOwnProperty.call(data, "prototype")
    ) {
      return {
        valid: false,
        data: null,
        error: "Potential prototype pollution detected",
      };
    }

    switch (expectedType) {
      case "config":
        return this.validateConfigData(data);
      case "fasting":
        return this.validateFastingData(data);
      case "cache":
        return this.validateCacheData(data);
      default:
        return { valid: true, data: this.deepClone(data), error: null };
    }
  },

  /**
   * Validate config data structure
   * @param {object} config - Config object
   * @returns {object} Validation result
   */
  validateConfigData(config) {
    const sanitized = {};

    if (config.location) {
      sanitized.location = {};
      if (config.location.city) {
        sanitized.location.city = this.sanitizeString(config.location.city);
      }
      if (config.location.country) {
        sanitized.location.country = this.sanitizeString(
          config.location.country
        );
      }
      if (
        config.location.latitude !== undefined &&
        config.location.longitude !== undefined
      ) {
        const latNum = parseFloat(config.location.latitude);
        const lonNum = parseFloat(config.location.longitude);
        if (
          !isNaN(latNum) &&
          !isNaN(lonNum) &&
          latNum >= Config.VALIDATION.LATITUDE_MIN &&
          latNum <= Config.VALIDATION.LATITUDE_MAX &&
          lonNum >= Config.VALIDATION.LONGITUDE_MIN &&
          lonNum <= Config.VALIDATION.LONGITUDE_MAX
        ) {
          sanitized.location.latitude = latNum;
          sanitized.location.longitude = lonNum;
        }
      }
      if (config.location.method) {
        sanitized.location.method = this.sanitizeString(config.location.method);
      }
    }

    if (config.prayer_method !== undefined) {
      const method = parseInt(config.prayer_method);
      if (!isNaN(method)) {
        sanitized.prayer_method = method;
      }
    }

    if (typeof config.first_time_setup === "boolean") {
      sanitized.first_time_setup = config.first_time_setup;
    }

    return { valid: true, data: sanitized, error: null };
  },

  /**
   * Validate fasting data structure
   * @param {object} fastingData - Fasting tracker data
   * @returns {object} Validation result
   */
  validateFastingData(fastingData) {
    const sanitized = {};

    for (const [key, value] of Object.entries(fastingData)) {
      // Validate key format (YYYY-MM)
      if (!/^\d{4}-\d{2}$/.test(key)) {
        continue; // Skip invalid keys
      }

      // Validate value is array
      if (Array.isArray(value)) {
        // Filter only valid Ayyamul Bidh days (13, 14, 15)
        const validDays = value.filter(
          (day) =>
            typeof day === "number" && Config.AYYAMUL_BIDH.DATES.includes(day)
        );
        if (validDays.length > 0) {
          sanitized[key] = validDays;
        }
      }
    }

    return { valid: true, data: sanitized, error: null };
  },

  /**
   * Validate cache data structure
   * @param {object} cacheData - Cache object
   * @returns {object} Validation result
   */
  validateCacheData(cacheData) {
    const sanitized = {};

    for (const [key, value] of Object.entries(cacheData)) {
      if (value && typeof value === "object") {
        if (value.timestamp && typeof value.timestamp === "number") {
          sanitized[key] = {
            data: this.deepClone(value.data),
            timestamp: value.timestamp,
          };
        }
      }
    }

    return { valid: true, data: sanitized, error: null };
  },

  /**
   * Check if time format is valid (HH:MM or HH:MM:SS)
   * @param {string} timeStr - Time string
   * @returns {boolean} True if valid
   */
  isValidTimeFormat(timeStr) {
    return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/.test(timeStr);
  },

  /**
   * Sanitize string untuk mencegah XSS
   * @param {string} str - Input string
   * @returns {string} Sanitized string
   */
  sanitizeString(str) {
    if (typeof str !== "string") return "";

    // Remove any HTML tags and trim
    const div = document.createElement("div");
    div.textContent = String(str);
    return div.innerHTML.trim();
  },

  /**
   * Deep clone object (safe from prototype pollution)
   * @param {*} obj - Object to clone
   * @returns {*} Cloned object
   */
  deepClone(obj) {
    if (obj === null || typeof obj !== "object") {
      return obj;
    }

    if (obj instanceof Date) {
      return new Date(obj.getTime());
    }

    if (Array.isArray(obj)) {
      return obj.map((item) => this.deepClone(item));
    }

    const cloned = {};
    for (const key of Object.keys(obj)) {
      // Skip prototype-related keys
      if (key === "__proto__" || key === "constructor" || key === "prototype") {
        continue;
      }
      cloned[key] = this.deepClone(obj[key]);
    }

    return cloned;
  },
};
