// copy specs for the checkbox, radio group, switch and rating pages, shared by the tiles and the playground
import type { CopySpec, Part } from './controls';
import { itemState } from '../../data/rating';

export type ChoiceKind = 'checkbox' | 'radio' | 'switch';
export const copyPage: Record<ChoiceKind | 'rating', string> = { checkbox: 'checkbox', radio: 'radio-group', switch: 'switch', rating: 'rating' };
const setName: Record<ChoiceKind, string> = { checkbox: 'Checkbox', radio: 'Radio', switch: 'Switch' };

// value is the checkbox State (Default, Select, Indeterminate) or "true"/"false" for radio and switch
export const bare = (kind: ChoiceKind, size: string, value: string, disabled = false): Part => ({
  variant: `${setName[kind]} / ${size} / ${value} / ${disabled}`,
});

export interface LabelText {
  label?: string;
  desc?: string | false;
  badge?: string | false;
  button?: string | false;
}

// the label variants have no size axis, text layers are patched by their DS names
export function labeled(kind: ChoiceKind, position: string, value: string, disabled: boolean, t: LabelText = {}): Part {
  const texts: Record<string, string> = {};
  const hide: string[] = [];
  if (t.label !== undefined) texts.Label = t.label;
  if (t.desc === false) hide.push('Lorem ipsum dolor sit amet consectetur. Risus.');
  else if (t.desc !== undefined) texts['Lorem ipsum dolor sit amet consectetur. Risus.'] = t.desc;
  if (t.badge === false) hide.push('Badge');
  else if (t.badge !== undefined) texts.Badge = t.badge;
  if (t.button === false) hide.push('Link-buttons');
  else if (t.button !== undefined) texts['Link Button'] = t.button;
  return { variant: `${setName[kind]} Label / ${position} / ${value} / ${disabled}`, texts, hide };
}

// several controls side by side or stacked, with the gap the page uses
export const group = (name: string, dir: 'HORIZONTAL' | 'VERTICAL', gap: number, parts: Part[]): CopySpec =>
  parts.length === 1 ? { parts } : { parts, wrap: { name, dir, gap } };

// the DS has no row component, so the row is a wrap of items, gap 2 px at Small and 4 px otherwise
export function ratingRow(type: string, size: string, value: number, disabled = false, count = 5): CopySpec {
  const parts = Array.from({ length: count }, (_, i) => ({
    variant: `Rating / ${type} / ${disabled ? 'Default' : itemState(i, value)} / ${disabled} / ${size}`,
  }));
  return count === 1 ? { parts } : { parts, wrap: { name: 'Rating', dir: 'HORIZONTAL', gap: size === 'Small' ? 2 : 4 } };
}

export const copyAttr = (label: string, spec: CopySpec) => JSON.stringify({ label, spec });
