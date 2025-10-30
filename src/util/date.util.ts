export function formatDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function formatDateToExactTime(date: Date) {
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
}

export function convertMonthNumberToMonthName(month_number: number) {
  const months: string[] = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];
  return months[month_number];
}

export function formatDateToExactString(date: Date) {
  const day = date.getDate();
  const month_name = convertMonthNumberToMonthName(date.getMonth());
  const year = date.getFullYear();
  return `${day} ${month_name} ${year}`;
}

/**
 * Return the start and end of the current week.
 * The start of the week is determined by the day of the week the current date is.
 * The end of the week is the start of the week plus 6 days.
 * @returns [Date, Date] - The start and end of the current week.
 */
export function thisWeek(): { startOfWeek: Date; endOfWeek: Date } {
  const today = new Date();
  const startOfWeek = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() - today.getDay(),
  );
  const endOfWeek = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() - today.getDay() + 6,
  );
  return { startOfWeek, endOfWeek };
}

/**
 * Return the start and end of the current month.
 * The start of the month is the first day of the month.
 * The end of the month is the last day of the month.
 * @returns [Date, Date] - The start and end of the current month.
 */
export function thisMonth(): { startOfMonth: Date; endOfMonth: Date } {
  const today = new Date();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  return { startOfMonth, endOfMonth };
}

export function formatDateToExactStringAndTime(date: Date) {
  const day = date.getDate();
  const month_name = convertMonthNumberToMonthName(date.getMonth());
  const year = date.getFullYear();
  return `${day} ${month_name} ${year} ${formatDateToExactTime(date)}`;
}

export class DateRange {
  start_date!: string;

  finish_date!: string;
}

export function formatRangeToExactString(from: Date, to: Date): string {
  if (from.getFullYear() === to.getFullYear()) {
    return `${from.getDate()} ${convertMonthNumberToMonthName(from.getMonth())} - ${to.getDate()} ${convertMonthNumberToMonthName(to.getMonth())} ${from.getFullYear()}`;
  } else {
    return `${formatDateToExactString(from)} - ${formatDateToExactString(to)}`;
  }
}

export function timeAgo(date: Date): string {
  const now = new Date();
  let diff = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diff < 0) return 'di masa depan';

  const units = [
    { name: 'dekade',   secs: 60 * 60 * 24 * 365.25 * 10 },
    { name: 'tahun',    secs: 60 * 60 * 24 * 365.25 },
    { name: 'bulan',    secs: 60 * 60 * 24 * 30.44 },
    { name: 'hari',     secs: 60 * 60 * 24 },
    { name: 'jam',      secs: 60 * 60 },
    { name: 'menit',    secs: 60 },
    { name: 'detik',    secs: 1 }
  ];

  const parts: string[] = [];
  for (const unit of units) {
    if (diff >= unit.secs || (unit.name === 'detik' && parts.length === 0)) {
      const amount = Math.floor(diff / unit.secs);
      if (amount > 0 || unit.name === 'detik') {
        // Untuk jamak/tunggal di bahasa Indonesia
        parts.push(`${amount} ${unit.name}`);
        diff = diff - amount * unit.secs;
      }
    }
  }

  return `${parts.join(' ')} yang lalu`;
}