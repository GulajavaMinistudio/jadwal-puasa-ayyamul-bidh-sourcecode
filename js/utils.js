/**
 * Utils Module - Helper Functions
 * Fungsi-fungsi pembantu yang digunakan di seluruh aplikasi
 */

export const Utils = {
  /**
   * Format tanggal ke string
   * @param {Date} date - Objek Date
   * @param {string} format - Format yang diinginkan ('short', 'long', 'iso')
   * @returns {string} Tanggal terformat
   */
  formatDate(date, format = "long") {
    const options = {
      short: { day: "numeric", month: "numeric", year: "numeric" },
      long: { weekday: "long", day: "numeric", month: "long", year: "numeric" },
      iso: { year: "numeric", month: "2-digit", day: "2-digit" },
    };

    const locale = "id-ID";
    return new Intl.DateTimeFormat(locale, options[format]).format(date);
  },

  /**
   * Format waktu ke string HH:MM
   * @param {string} time - Waktu dalam format "HH:MM"
   * @returns {string} Waktu terformat
   */
  formatTime(time) {
    if (!time || typeof time !== "string") return "--:--";
    return time.substring(0, 5); // Ambil HH:MM saja
  },

  /**
   * Dapatkan tanggal hari ini
   * @returns {Date} Objek Date hari ini
   */
  getCurrentDate() {
    return new Date();
  },

  /**
   * Tambah hari ke tanggal
   * @param {Date} date - Tanggal awal
   * @param {number} days - Jumlah hari yang ditambahkan
   * @returns {Date} Tanggal baru
   */
  addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  },

  /**
   * Hitung selisih hari antara dua tanggal
   * @param {Date} date1 - Tanggal pertama
   * @param {Date} date2 - Tanggal kedua
   * @returns {number} Selisih dalam hari
   */
  diffDays(date1, date2) {
    const oneDay = 24 * 60 * 60 * 1000;
    const diffTime = Math.abs(date2 - date1);
    return Math.round(diffTime / oneDay);
  },

  /**
   * Sanitize HTML untuk mencegah XSS
   * @param {string} input - Input dari user
   * @returns {string} Input yang sudah di-sanitize
   */
  sanitizeHTML(input) {
    if (typeof input !== "string") return "";

    const div = document.createElement("div");
    div.textContent = input;
    return div.innerHTML;
  },

  /**
   * Sanitize input untuk mencegah XSS (alias untuk sanitizeHTML)
   * @param {string} input - Input dari user
   * @returns {string} Input yang sudah di-sanitize
   */
  sanitizeInput(input) {
    return this.sanitizeHTML(input);
  },

  /**
   * Validasi koordinat
   * @param {number} lat - Latitude
   * @param {number} lon - Longitude
   * @returns {object} { valid: boolean, error: string }
   */
  validateCoordinates(lat, lon) {
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lon);

    if (isNaN(latitude) || isNaN(longitude)) {
      return { valid: false, error: "Koordinat harus berupa angka" };
    }

    if (latitude < -90 || latitude > 90) {
      return { valid: false, error: "Latitude harus antara -90 dan 90" };
    }

    if (longitude < -180 || longitude > 180) {
      return { valid: false, error: "Longitude harus antara -180 dan 180" };
    }

    return { valid: true, latitude, longitude };
  },

  /**
   * Throttle function - Membatasi frekuensi eksekusi fungsi
   * @param {Function} func - Fungsi yang akan di-throttle
   * @param {number} delay - Delay dalam milidetik
   * @returns {Function} Fungsi yang sudah di-throttle
   */
  throttle(func, delay) {
    let lastCall = 0;
    return function (...args) {
      const now = new Date().getTime();
      if (now - lastCall < delay) {
        return;
      }
      lastCall = now;
      return func(...args);
    };
  },

  /**
   * Debounce function - Menunda eksekusi fungsi
   * @param {Function} func - Fungsi yang akan di-debounce
   * @param {number} delay - Delay dalam milidetik
   * @returns {Function} Fungsi yang sudah di-debounce
   */
  debounce(func, delay) {
    let timeoutId;
    return function (...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
  },

  /**
   * Format tanggal ke format DD-MM-YYYY untuk API
   * @param {Date} date - Objek Date
   * @returns {string} Tanggal dalam format DD-MM-YYYY
   */
  formatDateForAPI(date) {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  },

  /**
   * Hitung countdown dalam format jam:menit
   * @param {string} targetTime - Waktu target (HH:MM)
   * @returns {string} Countdown dalam format "X jam Y menit"
   */
  calculateCountdown(targetTime) {
    if (!targetTime) return "";

    const now = new Date();
    const [hours, minutes] = targetTime.split(":").map(Number);

    const target = new Date();
    target.setHours(hours, minutes, 0, 0);

    // Jika waktu target sudah lewat, hitung untuk besok
    if (target < now) {
      target.setDate(target.getDate() + 1);
    }

    const diff = target - now;
    const hoursLeft = Math.floor(diff / (1000 * 60 * 60));
    const minutesLeft = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hoursLeft > 0) {
      return `${hoursLeft} jam ${minutesLeft} menit`;
    } else {
      return `${minutesLeft} menit`;
    }
  },

  /**
   * Cek apakah online
   * @returns {boolean} True jika online
   */
  isOnline() {
    return navigator.onLine;
  },

  /**
   * Show toast notification (menggunakan Bootstrap toast)
   * Priority 3: Fully implemented Bootstrap Toast
   * @param {string} message - Pesan yang akan ditampilkan
   * @param {string} type - Type toast ('success', 'error', 'info', 'warning')
   */
  showToast(message, type = "info") {
    // Map type to Bootstrap classes
    const typeClasses = {
      success: "bg-success text-white",
      error: "bg-danger text-white",
      warning: "bg-warning text-dark",
      info: "bg-info text-white",
    };

    const bgClass = typeClasses[type] || typeClasses.info;

    // Create toast container if not exists
    let toastContainer = document.getElementById("toastContainer");
    if (!toastContainer) {
      toastContainer = document.createElement("div");
      toastContainer.id = "toastContainer";
      toastContainer.className =
        "toast-container position-fixed bottom-0 end-0 p-3";
      toastContainer.style.zIndex = "9999";
      document.body.appendChild(toastContainer);
    }

    // Create toast element
    const toastId = `toast-${Date.now()}`;
    const toastEl = document.createElement("div");
    toastEl.id = toastId;
    toastEl.className = `toast ${bgClass}`;
    toastEl.setAttribute("role", "alert");
    toastEl.setAttribute("aria-live", "assertive");
    toastEl.setAttribute("aria-atomic", "true");

    // Create toast body
    const toastBody = document.createElement("div");
    toastBody.className =
      "toast-body d-flex justify-content-between align-items-center";

    const messageSpan = document.createElement("span");
    messageSpan.textContent = message;

    const closeButton = document.createElement("button");
    closeButton.type = "button";
    closeButton.className = "btn-close btn-close-white";
    closeButton.setAttribute("data-bs-dismiss", "toast");
    closeButton.setAttribute("aria-label", "Close");

    toastBody.appendChild(messageSpan);
    toastBody.appendChild(closeButton);
    toastEl.appendChild(toastBody);
    toastContainer.appendChild(toastEl);

    // Show toast using Bootstrap
    const toast = new bootstrap.Toast(toastEl, {
      autohide: true,
      delay: 5000,
    });
    toast.show();

    // Remove toast element after hidden
    toastEl.addEventListener("hidden.bs.toast", () => {
      toastEl.remove();
    });
  },

  /**
   * Download data sebagai JSON file
   * @param {object} data - Data yang akan di-download
   * @param {string} filename - Nama file
   */
  downloadJSON(data, filename = "data.json") {
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();

    URL.revokeObjectURL(url);
  },

  /**
   * Parse JSON file dari input file
   * @param {File} file - File object dari input
   * @returns {Promise} Promise yang resolve dengan parsed data
   */
  async parseJSONFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          resolve(data);
        } catch (error) {
          reject(new Error("File JSON tidak valid"));
        }
      };

      reader.onerror = () => reject(new Error("Gagal membaca file"));
      reader.readAsText(file);
    });
  },

  /**
   * Nama bulan Hijriyah
   */
  hijriMonthNames: [
    "Muharram",
    "Safar",
    "Rabiul Awal",
    "Rabiul Akhir",
    "Jumadil Awal",
    "Jumadil Akhir",
    "Rajab",
    "Sha'ban",
    "Ramadan",
    "Syawal",
    "Dzulqa'dah",
    "Dzulhijjah",
  ],

  /**
   * Get nama bulan Hijriyah
   * @param {number} monthNumber - Nomor bulan (1-12)
   * @returns {string} Nama bulan
   */
  getHijriMonthName(monthNumber) {
    return this.hijriMonthNames[monthNumber - 1] || "";
  },

  /**
   * Nama hari dalam bahasa Indonesia
   */
  dayNames: ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"],

  /**
   * Get nama hari
   * @param {number} dayNumber - Nomor hari (0-6, 0 = Minggu)
   * @returns {string} Nama hari
   */
  getDayName(dayNumber) {
    return this.dayNames[dayNumber] || "";
  },
};
