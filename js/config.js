/**
 * Application Configuration & Constants
 * Centralized configuration untuk menghindari magic numbers dan hardcoded values
 */

export const Config = {
  /**
   * Time constants (in milliseconds)
   */
  TIME: {
    SECOND_IN_MS: 1000,
    MINUTE_IN_MS: 60 * 1000,
    HOUR_IN_MS: 60 * 60 * 1000,
    DAY_IN_MS: 24 * 60 * 60 * 1000,
  },

  /**
   * Cache durations
   */
  CACHE: {
    PRAYER_TIMES_MAX_AGE: 24 * 60 * 60 * 1000, // 24 jam
    HIJRI_DATE_MAX_AGE: 24 * 60 * 60 * 1000, // 24 jam
    DEFAULT_MAX_AGE: 60 * 60 * 1000, // 1 jam
  },

  /**
   * Update intervals
   */
  INTERVALS: {
    SECOND: 1000, // 1 detik (for real-time clock)
    PRAYER_COUNTDOWN_UPDATE: 60 * 1000, // 1 menit
    DATA_REFRESH: 60 * 60 * 1000, // 1 jam
  },

  /**
   * API Configuration
   */
  API: {
    BASE_URL: "https://api.aladhan.com/v1",
    DEFAULT_METHOD: 99, // Custom Kemenag RI (Akurat)
    TIMEOUT: 10000, // 10 detik

    /**
     * Custom Kemenag RI Parameters
     * Sesuai standar resmi Kementerian Agama RI:
     * - Fajr: -20° (matahari 20° di bawah horizon timur)
     * - Isha: -18° (matahari 18° di bawah horizon barat)
     * - Tune: Offset untuk match jadwal resmi Kemenag
     *   Format: Imsak,Fajr,Sunrise,Dhuhr,Asr,Maghrib,Sunset,Isha,Midnight
     */
    KEMENAG_CUSTOM: {
      method: 99,
      methodSettings: "20,null,18", // Fajr 20°, Maghrib null (sunset), Isha 18°
      tune: "2,2,0,3,2,8,0,3,0", // Offset untuk akurasi
    },
  },

  /**
   * Ayyamul Bidh dates
   */
  AYYAMUL_BIDH: {
    DATES: [13, 14, 15],
    DAYS_PER_MONTH: 3,
    MONTHS_PER_YEAR: 12,
    TOTAL_DAYS_PER_YEAR: 36, // 3 hari × 12 bulan
  },

  /**
   * localStorage keys
   */
  STORAGE_KEYS: {
    APP_CONFIG: "app_config",
    FASTING_DATA: "puasa_ayyamul_bidh",
    CACHE: "cache",
  },

  /**
   * Validation limits
   */
  VALIDATION: {
    LATITUDE_MIN: -90,
    LATITUDE_MAX: 90,
    LONGITUDE_MIN: -180,
    LONGITUDE_MAX: 180,
    HIJRI_DAY_MIN: 1,
    HIJRI_DAY_MAX: 30,
    HIJRI_MONTH_MIN: 1,
    HIJRI_MONTH_MAX: 12,
    HIJRI_YEAR_MIN: 1300, // Reasonable minimum
    HIJRI_YEAR_MAX: 1600, // Reasonable maximum
    MAX_STREAK_CALCULATION: 24, // bulan
  },

  /**
   * Prayer calculation methods
   */
  PRAYER_METHODS: [
    {
      value: 99,
      label: "Kementerian Agama RI (Akurat - Recommended)",
      isCustom: true,
    },
    { value: 20, label: "Kementerian Agama RI (Standard Aladhan)" },
    { value: 3, label: "Muslim World League (MWL)" },
    { value: 2, label: "Islamic Society of North America (ISNA)" },
    { value: 5, label: "Egyptian General Authority of Survey" },
    { value: 4, label: "Umm Al-Qura University, Makkah" },
    { value: 1, label: "University of Islamic Sciences, Karachi" },
    { value: 7, label: "Institute of Geophysics, University of Tehran" },
  ],
};
