/**
 * Set item in localStorage with an optional expiry time
 * @param {string} key - Storage key
 * @param {any} value - Value to store
 * @param {number} expiryInMinutes - Time in minutes after which the key should expire
 */
export const setLocalStorage = (key, value, expiryInMinutes = null) => {
  try {
    const item = {
      value: value,
    };

    // Add expiry time if specified
    if (expiryInMinutes) {
      const now = new Date();
      item.expiry = now.getTime() + expiryInMinutes * 60 * 1000;
    }

    localStorage.setItem(key, JSON.stringify(item));
  } catch (error) {
    console.error("Error setting localStorage item:", error);
  }
};

/**
 * Get item from localStorage
 * @param {string} key - Storage key
 * @returns {any} Value from storage or null if expired or not found
 */
export const getLocalStorage = (key) => {
  try {
    const itemStr = localStorage.getItem(key);

    // Return null if item doesn't exist
    if (!itemStr) {
      return null;
    }

    const item = JSON.parse(itemStr);

    // Check if the item has an expiry time and if it's expired
    if (item.expiry && new Date().getTime() > item.expiry) {
      // Delete the expired item
      localStorage.removeItem(key);
      return null;
    }

    return item.value;
  } catch (error) {
    console.error("Error getting localStorage item:", error);
    return null;
  }
};

/**
 * Remove item from localStorage
 * @param {string} key - Storage key
 */
export const removeLocalStorage = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error("Error removing localStorage item:", error);
  }
};

/**
 * Clear all items from localStorage
 */
export const clearLocalStorage = () => {
  try {
    localStorage.clear();
  } catch (error) {
    console.error("Error clearing localStorage:", error);
  }
};
