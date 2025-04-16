/**
 * Format a date string
 * @param {string|Date} dateString - Date to format
 * @param {object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted date string
 */
export const formatDate = (dateString, options = {}) => {
  if (!dateString) return "";

  const date = new Date(dateString);

  // Default options
  const defaultOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
    ...options,
  };

  return new Intl.DateTimeFormat("en-US", defaultOptions).format(date);
};

/**
 * Format a date with time
 * @param {string|Date} dateString - Date to format
 * @returns {string} Formatted date with time
 */
export const formatDateTime = (dateString) => {
  if (!dateString) return "";

  return formatDate(dateString, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

/**
 * Format a relative time from now (e.g., "2 days ago")
 * @param {string|Date} dateString - Date to format
 * @returns {string} Relative time string
 */
export const formatRelativeTime = (dateString) => {
  if (!dateString) return "";

  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffSec = Math.round(diffMs / 1000);
  const diffMin = Math.round(diffSec / 60);
  const diffHour = Math.round(diffMin / 60);
  const diffDay = Math.round(diffHour / 24);
  const diffMonth = Math.round(diffDay / 30);
  const diffYear = Math.round(diffMonth / 12);

  if (diffSec < 60) {
    return "just now";
  } else if (diffMin < 60) {
    return `${diffMin} minute${diffMin > 1 ? "s" : ""} ago`;
  } else if (diffHour < 24) {
    return `${diffHour} hour${diffHour > 1 ? "s" : ""} ago`;
  } else if (diffDay < 30) {
    return `${diffDay} day${diffDay > 1 ? "s" : ""} ago`;
  } else if (diffMonth < 12) {
    return `${diffMonth} month${diffMonth > 1 ? "s" : ""} ago`;
  } else {
    return `${diffYear} year${diffYear > 1 ? "s" : ""} ago`;
  }
};

/**
 * Check if a date is in the past
 * @param {string|Date} dateString - Date to check
 * @returns {boolean} True if date is in the past
 */
export const isDatePast = (dateString) => {
  if (!dateString) return false;

  const date = new Date(dateString);
  const now = new Date();

  return date < now;
};

/**
 * Check if a date is today
 * @param {string|Date} dateString - Date to check
 * @returns {boolean} True if date is today
 */
export const isDateToday = (dateString) => {
  if (!dateString) return false;

  const date = new Date(dateString);
  const now = new Date();

  return (
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear()
  );
};

/**
 * Get the day name (e.g., "Monday")
 * @param {string|Date} dateString - Date to get day name from
 * @returns {string} Day name
 */
export const getDayName = (dateString) => {
  if (!dateString) return "";

  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(date);
};

export default {
  formatDate,
  formatDateTime,
  formatRelativeTime,
  isDatePast,
  isDateToday,
  getDayName,
};
