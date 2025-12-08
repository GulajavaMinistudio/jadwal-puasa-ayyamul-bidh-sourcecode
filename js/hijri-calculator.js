/**
 * Hijri Calculator - Local Calculation Fallback
 * Simple Hijri calendar calculation without API (basic algorithm)
 * Based on Umm al-Qura calendar approximation
 */

export class HijriCalculator {
  /**
   * Convert Gregorian date to Hijri (approximation)
   * Using simple arithmetic algorithm
   * @param {Date} gregorianDate - JavaScript Date object
   * @returns {object} Hijri date {day, month, year, monthName}
   */
  static gregorianToHijri(gregorianDate) {
    // 1. Try using Intl.DateTimeFormat (Modern Browsers) - Much more accurate
    // This aligns local calculation closer to API results (Umm al-Qura)
    if (
      typeof Intl !== "undefined" &&
      typeof Intl.DateTimeFormat === "function"
    ) {
      try {
        const formatter = new Intl.DateTimeFormat(
          "en-US-u-ca-islamic-umalqura",
          {
            day: "numeric",
            month: "numeric",
            year: "numeric",
          }
        );

        const parts = formatter.formatToParts(gregorianDate);
        const dayPart = parts.find((p) => p.type === "day");
        const monthPart = parts.find((p) => p.type === "month");
        const yearPart = parts.find((p) => p.type === "year");

        if (dayPart && monthPart && yearPart) {
          const day = parseInt(dayPart.value);
          const month = parseInt(monthPart.value);
          const year = parseInt(yearPart.value);

          return {
            day: day,
            month: month,
            year: year,
            monthName: this.getMonthName(month),
            calculated: true,
            accuracy: "high (Intl)", // Better accuracy than arithmetic
          };
        }
      } catch (e) {
        console.warn(
          "Intl Hijri calculation failed, falling back to arithmetic",
          e
        );
      }
    }

    // 2. Fallback: Arithmetic Approximation (Legacy)
    // Islamic epoch: July 16, 622 CE
    const islamicEpoch = new Date(622, 6, 16);

    // Calculate days since epoch
    const timeDiff = gregorianDate.getTime() - islamicEpoch.getTime();
    const daysSinceEpoch = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

    // Average Hijri year is approximately 354.36667 days
    const avgHijriYear = 354.36667;

    // Calculate Hijri year (rough approximation)
    let hijriYear = Math.floor(daysSinceEpoch / avgHijriYear) + 1;

    // Calculate days into current Hijri year
    const daysIntoYear =
      daysSinceEpoch - Math.floor((hijriYear - 1) * avgHijriYear);

    // Hijri months alternate between 30 and 29 days
    // Start with month 1
    let hijriMonth = 1;
    let remainingDays = daysIntoYear;
    const monthLengths = [30, 29, 30, 29, 30, 29, 30, 29, 30, 29, 30, 29]; // Approximate

    while (remainingDays > monthLengths[hijriMonth - 1] && hijriMonth < 12) {
      remainingDays -= monthLengths[hijriMonth - 1];
      hijriMonth++;
    }

    const hijriDay = Math.ceil(remainingDays);

    // Adjust if day is 0 or negative
    if (hijriDay <= 0) {
      hijriMonth--;
      if (hijriMonth <= 0) {
        hijriMonth = 12;
        hijriYear--;
      }
    }

    return {
      day: Math.max(1, Math.min(30, hijriDay)),
      month: hijriMonth,
      year: hijriYear,
      monthName: this.getMonthName(hijriMonth),
      calculated: true, // Flag to indicate this is calculated, not from API
      accuracy: "approximate", // Indicate this is an approximation
    };
  }

  /**
   * Get Hijri month name
   */
  static getMonthName(monthNumber) {
    const months = [
      "Muharram",
      "Safar",
      "Rabi' al-Awwal",
      "Rabi' al-Thani",
      "Jumada al-Ula",
      "Jumada al-Akhirah",
      "Rajab",
      "Sha'ban",
      "Ramadan",
      "Shawwal",
      "Dhu al-Qi'dah",
      "Dhu al-Hijjah",
    ];

    return months[monthNumber - 1] || "Unknown";
  }

  /**
   * Check if date is Ayyamul Bidh (13, 14, 15 of Hijri month)
   */
  static isAyyamulBidh(hijriDay) {
    return hijriDay >= 13 && hijriDay <= 15;
  }
}
