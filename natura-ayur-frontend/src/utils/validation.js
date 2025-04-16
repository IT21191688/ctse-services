/**
 * Validation helper functions
 */

/**
 * Validate an email address
 * @param {string} email - Email to validate
 * @returns {boolean} True if email is valid
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {object} Validation result with isValid and message
 */
export const validatePassword = (password) => {
  if (!password) {
    return { isValid: false, message: "Password is required" };
  }

  if (password.length < 6) {
    return {
      isValid: false,
      message: "Password must be at least 6 characters long",
    };
  }

  // Check for at least one uppercase letter
  const hasUpperCase = /[A-Z]/.test(password);

  // Check for at least one lowercase letter
  const hasLowerCase = /[a-z]/.test(password);

  // Check for at least one number
  const hasNumber = /\d/.test(password);

  if (!hasUpperCase || !hasLowerCase || !hasNumber) {
    return {
      isValid: false,
      message:
        "Password must include at least one uppercase letter, one lowercase letter, and one number",
    };
  }

  return { isValid: true, message: "Password is strong" };
};

/**
 * Check if password and confirm password match
 * @param {string} password - Password
 * @param {string} confirmPassword - Confirm password
 * @returns {boolean} True if passwords match
 */
export const doPasswordsMatch = (password, confirmPassword) => {
  return password === confirmPassword;
};

/**
 * Validate a phone number
 * @param {string} phone - Phone number to validate
 * @returns {boolean} True if phone number is valid
 */
export const isValidPhone = (phone) => {
  // Basic validation for a 10-digit phone number
  const phoneRegex = /^\d{10}$/;
  return phoneRegex.test(phone);
};

/**
 * Validate a required field
 * @param {string} value - Field value
 * @returns {boolean} True if field is not empty
 */
export const isRequired = (value) => {
  if (value === null || value === undefined) return false;
  return value.toString().trim().length > 0;
};

/**
 * Validate minimum length
 * @param {string} value - Field value
 * @param {number} min - Minimum length
 * @returns {boolean} True if field meets minimum length
 */
export const minLength = (value, min) => {
  if (!value) return false;
  return value.toString().length >= min;
};

/**
 * Validate maximum length
 * @param {string} value - Field value
 * @param {number} max - Maximum length
 * @returns {boolean} True if field does not exceed maximum length
 */
export const maxLength = (value, max) => {
  if (!value) return true;
  return value.toString().length <= max;
};

/**
 * Validate a number is within range
 * @param {number} value - Number to validate
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {boolean} True if number is within range
 */
export const isInRange = (value, min, max) => {
  const num = Number(value);
  return !isNaN(num) && num >= min && num <= max;
};

/**
 * Validate a positive number
 * @param {number} value - Number to validate
 * @returns {boolean} True if number is positive
 */
export const isPositiveNumber = (value) => {
  const num = Number(value);
  return !isNaN(num) && num > 0;
};

/**
 * Validate an integer
 * @param {number} value - Number to validate
 * @returns {boolean} True if number is an integer
 */
export const isInteger = (value) => {
  const num = Number(value);
  return !isNaN(num) && Number.isInteger(num);
};

/**
 * Validate a URL
 * @param {string} url - URL to validate
 * @returns {boolean} True if URL is valid
 */
export const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
};

export default {
  isValidEmail,
  validatePassword,
  doPasswordsMatch,
  isValidPhone,
  isRequired,
  minLength,
  maxLength,
  isInRange,
  isPositiveNumber,
  isInteger,
  isValidUrl,
};
