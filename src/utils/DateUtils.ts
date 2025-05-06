/**
 * Formats a given Date object into a string with the format 'MM/DD/YY'.
 *
 * @param date - The Date object to be formatted.
 * @returns A string representing the formatted date in 'MM/DD/YY' format.
 */
export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    year: '2-digit',
    month: '2-digit',
    day: '2-digit',
  });
};

/**
 * Formats a given Date object into a string with the format 'Month Day, Year'.
 *
 * @param date - The Date object to be formatted.
 * @returns A string representing the formatted date in 'Month Day, Year' format.
 */
export const formatDateLong = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Formats a given Date object into a string with the format 'HH:MM AM/PM'.
 *
 * @param date - The Date object to be formatted.
 * @returns A string representing the formatted time in 'HH:MM AM/PM' format.
 */
export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};