/**
 * Storage Module - LocalStorage Management
 * Mengelola semua operasi penyimpanan data di browser
 */

const Storage = {
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
      console.error('Error saving to localStorage:', error);
      return false;
    }
  },

  /**
   * Mengambil data dari localStorage
   * @param {string} key - Key untuk data
   * @returns {*} Parsed value atau null jika tidak ada
   */
  get(key) {
    try {
      const serializedValue = localStorage.getItem(key);
      if (serializedValue === null) {
        return null;
      }
      return JSON.parse(serializedValue);
    } catch (error) {
      console.error('Error reading from localStorage:', error);
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
      console.error('Error removing from localStorage:', error);
      return false;
    }
  },

  /**
   * Menghapus semua data aplikasi
   */
  clear() {
    try {
      // Hanya hapus key yang terkait aplikasi
      const appKeys = ['app_config', 'puasa_ayyamul_bidh', 'cache'];
      appKeys.forEach(key => localStorage.removeItem(key));
      return true;
    } catch (error) {
      console.error('Error clearing localStorage:', error);
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
        app_config: this.get('app_config'),
        puasa_ayyamul_bidh: this.get('puasa_ayyamul_bidh'),
        exported_at: new Date().toISOString()
      };
      return data;
    } catch (error) {
      console.error('Error exporting data:', error);
      return null;
    }
  },

  /**
   * Import data dari JSON
   * @param {object} data - Data yang akan di-import
   */
  importData(data) {
    try {
      if (data.app_config) {
        this.save('app_config', data.app_config);
      }
      if (data.puasa_ayyamul_bidh) {
        this.save('puasa_ayyamul_bidh', data.puasa_ayyamul_bidh);
      }
      return true;
    } catch (error) {
      console.error('Error importing data:', error);
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
    const cache = this.get('cache') || {};
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
    const cache = this.get('cache') || {};
    cache[cacheKey] = {
      data: data,
      timestamp: new Date().getTime()
    };
    this.save('cache', cache);
  },

  /**
   * Ambil data dari cache
   * @param {string} cacheKey - Key untuk cache
   * @returns {*} Data dari cache atau null
   */
  getCache(cacheKey) {
    const cache = this.get('cache') || {};
    const cacheData = cache[cacheKey];
    return cacheData ? cacheData.data : null;
  }
};

// Export untuk digunakan di module lain
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Storage;
}
