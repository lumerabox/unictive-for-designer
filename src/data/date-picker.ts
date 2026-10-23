// values read from the Date-picker, Calendar, Date-number, Select and Select-years component sets in Unictive Design System 1.0
export const aligns = ['Left', 'Right'] as const;
export const bools = ['false', 'true'] as const;
export type Align = (typeof aligns)[number];

export const dateStates = ['Default', 'Hover', 'Select', 'Today', 'Off'] as const;
export type DateState = (typeof dateStates)[number];
export const calendarTypes = ['Single', 'Multiple'] as const;
export type CalendarType = (typeof calendarTypes)[number];

// date-picker set: Alight × Calendar × Multiple
export const variantCount = aligns.length * 2 * 2;
// calendar 4, date-number 5, select 4, select-years 2
export const partCount = 4 + dateStates.length + 4 + 2;

export const metrics = {
  field: { height: 40, width: 300 },
  gap: 4,
  single: { width: 320 },
  multiple: { width: 848, rail: 200 },
  cell: 40,
} as const;

// the DS draws July 2026 with the 8th as today
export const today = { y: 2026, m: 6, d: 8 };
export const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
export const weekdays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
export const years = [2024, 2025, 2026, 2027, 2028];
export const railPresets = ['Last 7 days', 'Last 30 days', 'Last 3 months', 'Last 6 months', 'Last years', 'This week', 'This month'];
export const chipPresets = ['Today', 'Yesterday', 'Tomorrow', 'Last 7 Days', 'Last 14 Days'];

export interface Cell { y: number; m: number; d: number; off: boolean; key: number }
export const keyOf = (y: number, m: number, d: number) => y * 10000 + m * 100 + d;

// six weeks starting on sunday, days outside the month are "off"
export function monthGrid(y: number, m: number): Cell[][] {
  const start = new Date(y, m, 1 - new Date(y, m, 1).getDay());
  const rows: Cell[][] = [];
  for (let r = 0; r < 6; r++) {
    const row: Cell[] = [];
    for (let c = 0; c < 7; c++) {
      const t = new Date(start.getFullYear(), start.getMonth(), start.getDate() + r * 7 + c);
      row.push({ y: t.getFullYear(), m: t.getMonth(), d: t.getDate(), off: t.getMonth() !== m, key: keyOf(t.getFullYear(), t.getMonth(), t.getDate()) });
    }
    rows.push(row);
  }
  return rows;
}

const short = (k: number) => `${months[Math.floor(k / 100) % 100].slice(0, 3)} ${k % 100}`;
export const formatDate = (k: number) => `${short(k)}, ${Math.floor(k / 10000)}`;
export const formatRange = (a: number, b: number) => `${short(a)} - ${short(b)}, ${Math.floor(b / 10000)}`;

// copy to figma: the DS variant as-is, label and required hide the field's own layers (the time field and the
// range rail reuse the same names, so these are paths under the variant)
const field = 'Text-input (Outline)';
interface Picker { align: Align; calendar: boolean; multiple: boolean; label?: boolean; required?: boolean; value?: string }
export const pickerCopy = ({ align, calendar, multiple, label = true, required = true, value = '' }: Picker) => ({
  label: [align, multiple ? 'Multiple' : 'Single', ...(calendar ? ['Open'] : [])].join(' · '),
  spec: {
    parts: [{
      variant: `Date Picker / ${align} / ${calendar} / ${multiple}`,
      hide: [...(label ? [] : [`${field} > Label`]), ...(required ? [] : [`${field} > Label > *`])],
      ...(value ? { texts: { [`${field} > Form > Placeholder text`]: value } } : {}),
    }],
  },
});
export const calendarCopy = (type: CalendarType, range: boolean) => ({
  label: `Calendar · ${type}${range ? ' · Date range' : ''}`,
  spec: { parts: [{ variant: `Calendar / ${type} / ${range}` }] },
});
