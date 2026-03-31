export const formatDate = (value) => {
  if (!value) return 'N/A';
  try {
    const date = new Date(value);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  } catch {
    return value;
  }
};

/**
 * Converts any date input to yyyy-mm-dd format (required by backend)
 * @param {string} date - date string in any format
 * @returns {string|null} - formatted date string or null
 */
export const toBackendDate = (date) => {
  if (!date) return null;
  return new Date(date).toISOString().split("T")[0]; // yyyy-mm-dd
};

/**
 * Converts yyyy-mm-dd to dd/mm/yyyy for display
 * @param {string} date - date string in yyyy-mm-dd format
 * @returns {string} - formatted date string for display
 */
export const toDisplayDate = (date) => {
  if (!date) return "";
  const [year, month, day] = date.split("-");
  return `${day}/${month}/${year}`;
};

/**
 * Converts yyyy-mm-dd to a readable format e.g. "24 Feb 2026"
 * @param {string} date - date string in yyyy-mm-dd format
 * @returns {string} - human readable date
 */
export const toReadableDate = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};