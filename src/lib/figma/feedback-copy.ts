// copy specs for the alert, banner, badge, progress bar and tooltip pages, from the options their playgrounds render from.
// each one is the DS variant with its texts swapped in and the optional layers hidden
import type { CopySpec } from './controls';
import { statusIcon, type Status } from '../../data/markup';
import { copy as alertCopy, type Size as AlertSize, type Style as AlertStyle } from '../../data/alert';
import { copy as bannerCopy, type Type as BannerType, type Align } from '../../data/banner';
import type { Size as BadgeSize, Type as BadgeType, Color, Style as BadgeStyle } from '../../data/badge';
import type { State } from '../../data/progress-bar';
import { sample, type Type as TipType, type Arrow, type Size as TipSize } from '../../data/tooltip';

export const copyPage = { alert: 'alert', banner: 'banner', badge: 'badge', progress: 'progress-bar', tooltip: 'tooltip' } as const;

export function alertSpec(o: { size: AlertSize; status: Status; style: AlertStyle; icon: boolean; action: boolean; second: boolean; close: boolean }): CopySpec {
  const c = alertCopy[o.status];
  const large = o.size === 'Large';
  const hide = [...(o.icon ? [] : [statusIcon[o.status]]), ...(o.close ? [] : ['x-close-line'])];
  if (!o.action) hide.push(large ? 'Action' : 'Link-buttons');
  else if (large && !o.second) hide.push('Text + Action > Action > Link-buttons#1');
  return {
    parts: [{
      variant: `Alert / ${o.size} / ${o.status} / ${o.style}`,
      texts: {
        'Insert title here!': c.title,
        'Type your description, keeping it to two lines for the best look.': c.desc,
        'Link Button': c.action,
        'Text + Action > Action > Link-buttons#1 > Link Button': 'Learn more',
      },
      hide,
    }],
  };
}

export function bannerSpec(o: { type: BannerType; status: Status; align: Align; description: boolean; button: boolean }): CopySpec {
  const c = bannerCopy[o.status];
  const hide = [...(o.description ? [] : ['Ellipse 1', 'Input Description']), ...(o.button ? [] : ['Link-buttons'])];
  return { parts: [{ variant: `Banner / ${o.type} / ${o.status} / ${o.align}`, texts: { 'Title Banner': c.title, 'Input Description': c.desc, 'Link Button': c.action }, hide }] };
}

export function badgeSpec(o: { size: BadgeSize; type: BadgeType; color: Color; style: BadgeStyle; number: boolean; rounded: boolean; left: boolean; right: boolean }): CopySpec {
  // the set only has Number=true on Basic, a Dot count is the Dot badge with 99 as its text
  const number = o.number && o.type !== 'Icon';
  // the rounded Small / Dot / Red / Stroke badge is labelled Number=true, Rounded=false in the set
  const mislabelled = o.type === 'Dot' && o.size === 'Small' && o.color === 'Red' && o.style === 'Stroke' && o.rounded;
  const axes = mislabelled ? 'true / false' : `${o.type === 'Basic' && number} / ${o.rounded}`;
  const hide = o.type === 'Icon' ? [...(o.left ? [] : ['alert-circle-line']), ...(o.right ? [] : ['x-close-line'])] : [];
  return { parts: [{ variant: `Badge / ${o.size} / ${o.type} / ${o.color} / ${o.style} / ${axes}`, texts: { Badge: number ? '99' : 'Badge', '99': '99' }, hide }] };
}

const progressIcon: Record<State, string> = { 'On Progress': 'loading-01-line', Success: 'check-circle-line', Error: 'x-circle-line' };
const progressInfo = ['10 MB of 100MB', '100 MB of 100MB', 'Oops, something went wrong'];

export function progressSpec(o: { state: State; value: number; label: boolean; icon: boolean; info: boolean }): CopySpec {
  const value = o.state === 'On Progress' ? Math.round(o.value) : 100;
  const note = o.state === 'Error' ? 'Upload failed, check your connection and try again' : `${value} MB of 100 MB`;
  const hide = [...(o.label ? [] : ['Label']), ...(o.icon ? [] : [progressIcon[o.state]]), ...(o.info ? [] : progressInfo)];
  return {
    parts: [{
      variant: `Progress-bar / ${o.state}`,
      texts: { 'Upload...': 'Uploading report.pdf', '10%': `${value}%`, '100%': `${value}%`, ...Object.fromEntries(progressInfo.map((k) => [k, note])) },
      hide,
      // the bar comes in 10% steps
      swap: o.state === 'On Progress' ? [{ path: 'Bar-indicators', part: { variant: `Bar / ${Math.round(value / 10) * 10}%` } }] : undefined,
    }],
  };
}

export function tooltipSpec(o: { type: TipType; arrow: Arrow; size: TipSize; dark: boolean; icon: boolean; close: boolean }): CopySpec {
  const desc = 'Lorem ipsum dolor sit amet consectetur. Blandit id purus eleifend non. Eget diam leo risus.';
  const hide = o.type === 'Description' ? [...(o.icon ? [] : ['alert-circle-line']), ...(o.close ? [] : ['x-close-line'])] : [];
  return {
    parts: [{
      variant: `Tooltip / ${o.type} / ${o.arrow} / ${o.size} / ${o.dark}`,
      texts: { 'Text Tooltip': o.type === 'Default' ? sample.text : sample.title, [desc]: sample.desc },
      hide,
    }],
  };
}
