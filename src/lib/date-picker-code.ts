// code for developers: date picker and calendar classes and html examples. the css lives in global-css.ts
import type { ClassRow, Example } from './code-types';
import { calendar as calPath, clock, chevronDown } from '../components/date-picker/icons';
import { chipPresets, formatDate, formatRange, keyOf, monthGrid, months, railPresets, today, weekdays } from '../data/date-picker';

const icon = (d: string) => `<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="${d}" /></svg>`;
const calIcon = icon(calPath);
const prev = '<button type="button" class="calendar-nav" aria-label="Previous month"><svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M12.5 15L7.5 10L12.5 5" /></svg></button>';
const next = '<button type="button" class="calendar-nav" aria-label="Next month"><svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M7.5 15L12.5 10L7.5 5" /></svg></button>';
const t = keyOf(today.y, today.m, today.d);
const pad = (lines: (string | false | undefined)[], n: number) => lines.filter(Boolean).map((l) => ' '.repeat(n) + l);

interface Marks { start?: number | null; end?: number | null }

// one month: the header, weekdays and 42 dates from sunday
function month(y: number, m: number, { start = null, end = null }: Marks, head: string[]) {
  const lo = start && end ? Math.min(start, end) : start;
  const hi = start && end ? Math.max(start, end) : start;
  const days = monthGrid(y, m).flat().map((c) => {
    const cls = ['calendar-day'];
    if (c.off) cls.push('calendar-day-muted');
    else if (lo && hi && lo !== hi && c.key >= lo && c.key <= hi) cls.push(c.key === lo ? 'calendar-day-range-start' : c.key === hi ? 'calendar-day-range-end' : 'calendar-day-range');
    const sel = !c.off && (c.key === lo || c.key === hi);
    const attrs = [c.off && 'tabindex="-1"', sel && 'aria-selected="true"', !c.off && c.key === t && 'aria-current="date"'].filter(Boolean).join(' ');
    return `  <button type="button" class="${cls.join(' ')}"${attrs ? ' ' + attrs : ''}>${c.d}</button>`;
  });
  return [
    '<div class="calendar-month">',
    ...pad(head, 2),
    `  <div class="calendar-weekdays" aria-hidden="true">${weekdays.map((d) => `<span>${d}</span>`).join('')}</div>`,
    '  <div class="calendar-grid">',
    ...pad(days, 2),
    '  </div>',
    '</div>',
  ];
}

interface Cal extends Marks {
  y?: number;
  m?: number;
  time?: boolean;
  actions?: boolean;
  presets?: boolean;
  double?: boolean;
  info?: boolean;
  label?: string;
  id?: string;
}

// the calendar panel, single month or two months with the range rail
export function calendar({ y = today.y, m = today.m, start = null, end = null, time = false, actions = true, presets = false, double = false, info = false, label = 'Choose a date', id }: Cal) {
  const idAttr = id ? ` id="${id}"` : '';
  const btns = (a: string) => [`<button type="button" class="btn btn-tertiary btn-neutral">${a}</button>`, '<button type="button" class="btn">Apply</button>'];
  if (double) {
    const n = { y: m === 11 ? y + 1 : y, m: (m + 1) % 12 };
    const range = start && end ? formatRange(Math.min(start, end), Math.max(start, end)) : '';
    return [
      `<div class="calendar calendar-double"${idAttr} role="dialog" aria-label="${label}">`,
      '  <div class="calendar-rail">',
      '    <span class="calendar-rail-title">Date Range</span>',
      ...pad(railPresets.map((p, i) => `<button type="button" class="calendar-preset" aria-pressed="${i === 0}">${p}</button>`), 4),
      '  </div>',
      '  <div class="calendar-body">',
      '    <div class="calendar-months">',
      ...pad(month(y, m, { start, end }, ['<div class="calendar-head">', `  ${prev}`, `  <span class="calendar-title">${months[m]} ${y}</span>`, '</div>']), 6),
      ...pad(month(n.y, n.m, {}, ['<div class="calendar-head">', `  <span class="calendar-title">${months[n.m]} ${n.y}</span>`, `  ${next}`, '</div>']), 6),
      '    </div>',
      actions && '    <div class="calendar-section">',
      actions && info && `      <span class="calendar-range">${calIcon}<span>${range}</span></span>`,
      ...(actions ? pad(btns('Clear'), 6) : []),
      actions && '    </div>',
      '  </div>',
      '</div>',
    ].filter(Boolean).join('\n');
  }
  const head = [
    '<div class="calendar-head">',
    `  <span class="calendar-title">${months[m]}<button type="button" class="calendar-year" aria-label="Choose year">${y}<svg viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="${chevronDown}" /></svg></button></span>`,
    `  <div class="calendar-navs">${prev}${next}</div>`,
    '</div>',
  ];
  return [
    `<div class="calendar"${idAttr} role="dialog" aria-label="${label}">`,
    '  <div class="calendar-body">',
    ...pad(month(y, m, { start, end }, head), 4),
    ...(time ? pad([
      '<div class="calendar-section">',
      '  <div class="field">',
      '    <label class="field-label" for="time">Time</label>',
      `    <div class="field-control"><input id="time" class="field-input" type="text" inputmode="numeric" value="00:00" />${icon(clock)}</div>`,
      '  </div>',
      '</div>',
    ], 4) : []),
    ...(actions ? pad(['<div class="calendar-section">', ...pad(btns('Cancel'), 2), '</div>'], 4) : []),
    ...(presets ? pad(['<div class="calendar-section calendar-presets">', ...pad(chipPresets.map((p) => `<button type="button" class="calendar-chip" aria-pressed="false">${p}</button>`), 2), '</div>'], 4) : []),
    '  </div>',
    '</div>',
  ].join('\n');
}

interface Picker extends Cal {
  id: string;
  label?: string;
  required?: boolean;
  value?: string;
  open?: boolean;
  end_?: boolean;
  invalid?: boolean;
  disabled?: boolean;
  caption?: string;
}

// label, the trigger and the calendar under it
function picker({ id, label = 'Date', required = false, value, open = false, end_ = false, invalid, disabled, caption, ...cal }: Picker) {
  const attrs = [
    `type="button" id="${id}" class="field-control" aria-haspopup="dialog" aria-expanded="${open}"`,
    open && `aria-controls="${id}-calendar"`,
    caption && `aria-describedby="${id}-caption"`,
    invalid && 'aria-invalid="true"',
    disabled && 'disabled',
  ].filter(Boolean).join(' ');
  return [
    '<div class="field">',
    label && `  <label class="field-label" for="${id}">${label}${required ? '<span class="field-req">*</span>' : ''}</label>`,
    `  <div class="datepicker${end_ ? ' datepicker-end' : ''}">`,
    `    <button ${attrs}>`,
    `      <span class="field-value${value ? '' : ' field-placeholder'}">${value ?? 'Select date'}</span>`,
    `      ${calIcon}`,
    '    </button>',
    ...(open ? pad(calendar({ ...cal, id: `${id}-calendar` }).split('\n'), 4) : []),
    '  </div>',
    caption && `  <div class="field-foot"><span class="field-caption" id="${id}-caption">${caption}</span></div>`,
    '</div>',
  ].filter(Boolean).join('\n');
}

const day = (d: number) => keyOf(today.y, today.m, d);

// the playground variant as html
export interface PickerSpec { align: string; open: boolean; multiple: boolean; label: boolean; required: boolean; range: boolean; time: boolean; actions: boolean; presets: boolean; value: string }
export function datePickerHtml(s: PickerSpec) {
  const range = s.range || s.multiple;
  return picker({
    id: 'date', label: s.label ? 'Date' : '', required: s.required, value: s.value || undefined, open: s.open, end_: s.align === 'Right',
    double: s.multiple, start: range ? day(2) : null, end: range ? t : null,
    time: !s.multiple && s.time, actions: s.actions, presets: !s.multiple && s.presets,
  });
}

export const classes: ClassRow[] = [
  ['datepicker', 'Component', 'Wrapper around the trigger and the calendar, the calendar opens 4 px under it'],
  ['datepicker-end', 'Modifier', 'Lines the calendar up with the right edge, the Right alignment in Figma'],
  ['field-control', 'Part', 'The trigger, a button in the 40 px field frame with the calendar icon'],
  ['calendar', 'Component', 'Panel with one month, 320 px wide'],
  ['calendar-double', 'Modifier', 'Two months and a rail of range presets, 848 px wide'],
  ['calendar-head', 'Part', 'Month, year and the arrows'],
  ['calendar-year', 'Part', 'Year button, open your own list of years from it'],
  ['calendar-nav', 'Part', 'Previous or next month arrow'],
  ['calendar-weekdays', 'Part', 'Row of weekday names, Sunday first'],
  ['calendar-grid', 'Part', 'Seven columns of calendar-day buttons'],
  ['calendar-day', 'Part', 'One date, a 40 px circle'],
  ['calendar-day-muted', 'Modifier', 'A date from the month before or after, grey'],
  ['aria-current="date"', 'Attribute', 'Today, light brand fill'],
  ['aria-selected="true"', 'Attribute', 'The picked date, or each end of a range, solid brand fill'],
  ['calendar-day-range', 'Modifier', 'A date inside a range, light band. Use -range-start and -range-end on the ends'],
  ['calendar-section', 'Part', 'Row under the dates for the time field or the action buttons'],
  ['calendar-presets', 'Modifier', 'Section of calendar-chip quick picks, mark the active one aria-pressed="true"'],
  ['calendar-rail', 'Part', 'Range presets on the left of calendar-double, each a calendar-preset button'],
];

export const examples: Example[] = [
  {
    id: 'ex-basic',
    title: 'Basic',
    desc: 'A button in the field frame opens the calendar. It shows a grey placeholder until a date is picked',
    html: [picker({ id: 'start-date', label: 'Start date', required: true }), picker({ id: 'due-date', label: 'Due date', value: formatDate(t) })].join('\n'),
  },
  {
    id: 'ex-open',
    title: 'Open',
    desc: 'Set aria-expanded="true" and put the calendar inside datepicker. Apply writes the date into the field, Cancel closes it',
    html: picker({ id: 'delivery', label: 'Delivery date', required: true, open: true, start: t }),
    height: 600,
  },
  {
    id: 'ex-range',
    title: 'Date range',
    desc: 'Mark both ends aria-selected and every date between them with calendar-day-range',
    html: calendar({ start: day(2), end: t, label: 'Choose dates' }),
  },
  {
    id: 'ex-time',
    title: 'With time',
    desc: 'A time field under the dates for bookings and reminders',
    html: calendar({ start: t, time: true }),
  },
  {
    id: 'ex-presets',
    title: 'Date presets',
    desc: 'Quick picks under the month. Without the action buttons a date applies as soon as it is clicked',
    html: calendar({ start: t, actions: false, presets: true }),
  },
  {
    id: 'ex-double',
    title: 'Two months',
    desc: 'calendar-double shows two months and a rail of range presets, for reports and bookings that span weeks. It needs 848 px',
    html: calendar({ double: true, start: day(2), end: t, info: true, label: 'Choose a date range' }),
  },
  {
    id: 'ex-end',
    title: 'Aligned right',
    desc: 'datepicker-end lines the calendar up with the right edge of the field, for a field near the right edge of the layout',
    html: picker({ id: 'report', label: 'Report date', open: true, end_: true, start: t }),
    height: 600,
  },
  {
    id: 'ex-states',
    title: 'Error and disabled',
    desc: 'aria-invalid="true" turns the border and the caption red. disabled greys out the trigger',
    html: [
      picker({ id: 'birth', label: 'Date of birth', required: true, invalid: true, caption: 'Pick a date in the past' }),
      picker({ id: 'joined', label: 'Joined on', value: formatDate(day(1)), disabled: true, caption: 'Set by your company admin' }),
    ].join('\n'),
  },
];
