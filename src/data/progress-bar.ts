// values read from the Progress Bar page of Unictive Design System 1.0: Bar-indicators, Progress-bar and Circural-progress-bar
import { icon, esc, slug, type IconName } from './markup';

export const states = ['On Progress', 'Success', 'Error'] as const;
export const circleSizes = [['Large', 80], ['Medium', 64], ['Small', 48]] as const;
export const steps = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
export type State = (typeof states)[number];
export type CircleSize = (typeof circleSizes)[number][0];

// Bar-indicators 11, Progress-bar 3, Circural-progress-bar 15
export const variantCount = 29;

const stateIcon: Record<State, IconName> = { 'On Progress': 'loading-01-line', Success: 'check-circle-line', Error: 'x-circle-line' };

// a 6 px track, brand fill; color picks the state fill
export function bar(value: number, color: 'brand' | 'success' | 'error' = 'brand') {
  const v = Math.max(0, Math.min(100, value));
  return `<span class="u-bar" data-color="${color}"><i style="width:${v}%"></i></span>`;
}

export interface Opts {
  state?: State;
  value?: number;
  label?: boolean;
  icon?: boolean;
  info?: boolean;
  title?: string;
  total?: number;
  live?: boolean;
}

export function render(o: Opts) {
  const { state = 'On Progress', label = true, info = true, total = 100, live = false } = o;
  const value = state === 'On Progress' ? Math.round(o.value ?? 40) : 100;
  const color = state === 'Success' ? 'success' : state === 'Error' ? 'error' : 'brand';
  const ic = o.icon === false ? '' : icon(stateIcon[state], 12, state === 'On Progress' ? 'u-spin' : '');
  const head = label ? `<span class="u-progress-label"><span class="u-progress-title">${esc(o.title ?? 'Uploading report.pdf')}</span><span class="u-progress-pct">${value}%${ic}</span></span>` : '';
  const done = Math.round((value / 100) * total);
  const note = state === 'Error' ? 'Upload failed, check your connection and try again' : `${done} MB of ${total} MB`;
  const foot = info ? `<span class="u-progress-info">${note}</span>` : '';
  const data = live ? ` data-live data-c="progress" data-opts='${esc(JSON.stringify({ state, value, label, icon: o.icon !== false, info }))}'` : '';
  return `<div class="u-progress" data-state="${slug(state)}" role="progressbar" aria-label="${esc(o.title ?? 'Uploading report.pdf')}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${value}"${data}>${head}${bar(value, color)}${foot}</div>`;
}

// ring is 10% of the size, information blue on bg/weak-50, starting at 12 o’clock
export function circle(value: number, size: CircleSize = 'Large') {
  const px = circleSizes.find(([s]) => s === size)![1];
  const t = px / 10;
  const r = (px - t) / 2;
  const len = 2 * Math.PI * r;
  const v = Math.max(0, Math.min(100, value));
  return `<span class="u-ring" data-size="${slug(size)}" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${v}" style="width:${px}px;height:${px}px"><svg width="${px}" height="${px}" viewBox="0 0 ${px} ${px}" aria-hidden="true"><circle cx="${px / 2}" cy="${px / 2}" r="${r}" stroke-width="${t}" class="u-ring-track"/><circle cx="${px / 2}" cy="${px / 2}" r="${r}" stroke-width="${t}" class="u-ring-fill" stroke-dasharray="${len.toFixed(2)}" stroke-dashoffset="${(len * (1 - v / 100)).toFixed(2)}" transform="rotate(-90 ${px / 2} ${px / 2})"/></svg><span>${Math.round(v)}%</span></span>`;
}

export const chip = (o: { state: State }) => `Progress-bar · State=${o.state}`;
