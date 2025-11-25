/**
 * Storage Module - LocalStorage Management
 * Mengelola semua operasi penyimpanan data di browser
 */

import { Config } from "./config.js";
import { Validators } from "./validators.js";

export const Storage = {
  /**
   * Menyimpan data ke localStorage
   * @param {string} key - Key untuk data
   * @param {*} value - Value yang akan disimpan (akan di-JSON.stringify)
   */
  save(key, value) {
    try {
      const serializedValue = JSON.stringify(value);
      localStorage.setItem(key, serializedValue);
      return true;
    } catch (error) {
      console.error("Error saving to localStorage:", error);
      return false;
    }
  },

  /**
   * Mengambil data dari localStorage dengan validation
   * @param {string} key - Key untuk data
   * @returns {*} Parsed dan validated value atau null jika tidak ada
   */
  get(key) {
    try {
      const serializedValue = localStorage.getItem(key);
      if (serializedValue === null) {
        return null;
      }

      // Parse JSON
      const parsedValue = JSON.parse(serializedValue);

      // Validate berdasarkan key type
      let validationResult;
      if (key === Config.STORAGE_KEYS.APP_CONFIG) {
        validationResult = Validators.validateStorageData(
          parsedValue,
          "config"
        );
      } else if (key === Config.STORAGE_KEYS.FASTING_DATA) {
        validationResult = Validators.validateStorageData(
          parsedValue,
          "fasting"
        );
      } else if (key === Config.STORAGE_KEYS.CACHE) {
        validationResult = Validators.validateStorageData(parsedValue, "cache");
      } else {
        // For unknown keys, just deep clone to prevent prototype pollution
        validationResult = Validators.validateStorageData(
          parsedValue,
          "unknown"
        );
      }

      if (!validationResult.valid) {
        console.warn(
          `Invalid data in localStorage for key "${key}":`,
          validationResult.error
        );
        return null;
      }

      return validationResult.data;
    } catch (error) {
      console.error("Error reading from localStorage:", error);
      return null;
    }
  },

  /**
   * Menghapus data dari localStorage
   * @param {string} key - Key yang akan dihapus
   */
  remove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error("Error removing from localStorage:", error);
      return false;
    }
  },

  /**
   * Menghapus semua data aplikasi
   */
  clear() {
    try {
      // Hanya hapus key yang terkait aplikasi (menggunakan constants)
      const appKeys = Object.values(Config.STORAGE_KEYS);
      appKeys.forEach((key) => localStorage.removeItem(key));
      return true;
    } catch (error) {
      console.error("Error clearing localStorage:", error);
      return false;
    }
  },

  /**
   * Export semua data ke JSON
   * @returns {object} Object berisi semua data aplikasi
   */
  exportData() {
    try {
      const data = {
        app_config: this.get(Config.STORAGE_KEYS.APP_CONFIG),
        puasa_ayyamul_bidh: this.get(Config.STORAGE_KEYS.FASTING_DATA),
        exported_at: new Date().toISOString(),
      };
      return data;
    } catch (error) {
      console.error("Error exporting data:", error);
      return null;
    }
  },

  /**
   * Import data dari JSON dengan validation
   * @param {object} data - Data yang akan di-import
   */
  importData(data) {
    try {
      // Validate dan save app_config
      if (data.app_config) {
        const configValidation = Validators.validateStorageData(
          data.app_config,
          "config"
        );
        if (configValidation.valid) {
          this.save(Config.STORAGE_KEYS.APP_CONFIG, configValidation.data);
        } else {
          console.warn("Invalid app_config data:", configValidation.error);
        }
      }

      // Validate dan save fasting data
      if (data.puasa_ayyamul_bidh) {
        const fastingValidation = Validators.validateStorageData(
          data.puasa_ayyamul_bidh,
          "fasting"
        );
        if (fastingValidation.valid) {
          this.save(Config.STORAGE_KEYS.FASTING_DATA, fastingValidation.data);
        } else {
          console.warn("Invalid fasting data:", fastingValidation.error);
        }
      }

      return true;
    } catch (error) {
      console.error("Error importing data:", error);
      return false;
    }
  },

  /**
   * Cek apakah data cache masih valid
   * @param {string} cacheKey - Key untuk cache
   * @param {number} maxAgeMs - Maksimal usia cache dalam milidetik
   * @returns {boolean} True jika cache masih valid
   */
  isCacheValid(cacheKey, maxAgeMs) {
    const cache = this.get(Config.STORAGE_KEYS.CACHE) || {};
    const cacheData = cache[cacheKey];

    if (!cacheData || !cacheData.timestamp) {
      return false;
    }

    const now = new Date().getTime();
    const cacheAge = now - cacheData.timestamp;

    return cacheAge < maxAgeMs;
  },

  /**
   * Simpan data ke cache dengan timestamp
   * @param {string} cacheKey - Key untuk cache
   * @param {*} data - Data yang akan di-cache
   */
  saveCache(cacheKey, data) {
    const cache = this.get(Config.STORAGE_KEYS.CACHE) || {};
    cache[cacheKey] = {
      data: data,
      timestamp: new Date().getTime(),
    };
    this.save(Config.STORAGE_KEYS.CACHE, cache);
  },

  /**
   * Ambil data dari cache
   * @param {string} cacheKey - Key untuk cache
   * @returns {*} Data dari cache atau null
   */
  getCache(cacheKey) {
    const cache = this.get(Config.STORAGE_KEYS.CACHE) || {};
    const cacheData = cache[cacheKey];
    return cacheData ? cacheData.data : null;
  },
};
