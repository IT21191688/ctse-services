/**
 * Format a number as currency
 * @param {number} amount - Amount to format
 * @param {string} currencyCode - Currency code (default: USD)
 * @param {string} locale - Locale for formatting (default: en-US)
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (
  amount,
  currencyCode = "USD",
  locale = "en-US"
) => {
  if (amount === null || amount === undefined) {
    return "";
  }

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currencyCode,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Format a number as currency without cents
 * @param {number} amount - Amount to format
 * @param {string} currencyCode - Currency code (default: USD)
 * @param {string} locale - Locale for formatting (default: en-US)
 * @returns {string} Formatted currency string without cents
 */
export const formatCurrencyWithoutCents = (
  amount,
  currencyCode = "USD",
  locale = "en-US"
) => {
  if (amount === null || amount === undefined) {
    return "";
  }

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currencyCode,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export default formatCurrency;
