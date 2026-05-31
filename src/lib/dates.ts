import { format, formatDistance, formatRelative, isAfter, isBefore, isToday, isTomorrow, isPast, addDays, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from "date-fns";

export {
  format,
  formatDistance,
  formatRelative,
  isAfter,
  isBefore,
  isToday,
  isTomorrow,
  isPast,
  addDays,
  subDays,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
};

export function formatDate(date: string | Date): string {
  return format(new Date(date), "MMM dd, yyyy");
}

export function formatDateTime(date: string | Date): string {
  return format(new Date(date), "MMM dd, yyyy HH:mm");
}

export function getRelativeTime(date: string | Date): string {
  return formatDistance(new Date(date), new Date(), { addSuffix: true });
}

export function isOverdue(date: string | Date): boolean {
  return isPast(new Date(date)) && !isToday(new Date(date));
}
