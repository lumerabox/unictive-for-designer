// values read from the Dropdown-items component set in Unictive Design System 1.0
export const types = ['Default', 'Profile', 'Country', 'Checkbox'] as const;
export const states = ['Default', 'Hover', 'Selected', 'Disable'] as const;
export const sizes = ['Small', 'Large'] as const;

export type Type = (typeof types)[number];
export type State = (typeof states)[number];
export type Size = (typeof sizes)[number];

export const metrics = {
  Small: { width: 320, height: 36, lead: 20 },
  Large: { width: 360, height: 60, lead: 32 },
} as const;

// large items with a 32 px avatar, flag or checkbox row are 58 tall, the boxed icon makes Default 60
export const heightOf = (t: Type, z: Size) => (z === 'Large' && t !== 'Default' ? 58 : metrics[z].height);

export const variantCount = types.length * states.length * sizes.length;

export const stateName = (s: string) => (s === 'Disable' ? 'Disabled' : s);
export const slug = (s: string) => s.toLowerCase().replace(/\s+/g, '-');

// sample content per type, used by the tiles and the playground
export const samples: Record<Type, { title: string; desc: string }> = {
  Default: { title: 'Bank transfer', desc: 'Pay from any Indonesian bank account' },
  Profile: { title: 'Ayu Lestari', desc: 'Product designer, Jakarta' },
  Country: { title: 'Indonesia', desc: '+62, Indonesian rupiah' },
  Checkbox: { title: 'Email updates', desc: 'A weekly summary of account activity' },
};

// three rows per type for the open menu examples, the middle row takes the picked state
export const menuSamples: Record<Type, { label: string; rows: { title: string; desc: string }[] }> = {
  Default: { label: 'Payment method', rows: [
    { title: 'Virtual account', desc: 'Pay with a one-time account number' },
    samples.Default,
    { title: 'Credit card', desc: 'Visa, Mastercard and JCB' },
  ] },
  Profile: { label: 'Assignee', rows: [
    { title: 'Budi Santoso', desc: 'Engineering lead, Bandung' },
    samples.Profile,
    { title: 'Rina Wijaya', desc: 'Researcher, Surabaya' },
  ] },
  Country: { label: 'Time zone', rows: [
    { title: 'WIB, Jakarta', desc: 'Indonesia, GMT+7' },
    { title: 'WITA, Makassar', desc: 'Indonesia, GMT+8' },
    { title: 'WIT, Jayapura', desc: 'Indonesia, GMT+9' },
  ] },
  Checkbox: { label: 'Notifications', rows: [
    { title: 'Push notifications', desc: 'Alerts on this device' },
    samples.Checkbox,
    { title: 'SMS', desc: 'Only for security codes' },
  ] },
};

// copy to figma: one DS row, or a menu wrap of rows (the panel is composed on the site, radius 12 / 16, stroke/soft-200)
const descLayer = 'Lorem ipsum dolor sit amet consectetur.';
interface Row { type: Type; size: Size; state: State; title: string; desc?: string; icon?: boolean; description?: boolean }
export function rowPart({ type, size, state, title, desc = '', icon = true, description = true }: Row) {
  const hide: string[] = [];
  // only the Default type carries the info icon, Large boxes it in a frame named Icon
  if (type === 'Default' && !icon) hide.push(size === 'Large' ? 'Icon' : 'info-circle-line');
  if (size === 'Large' && !description) hide.push(descLayer);
  return {
    variant: `Dropdown / ${type} / ${state} / ${size}`,
    texts: { 'List item': title, ...(size === 'Large' && description ? { [descLayer]: desc } : {}) },
    hide,
  };
}
export const rowCopy = (r: Row) => ({
  label: [r.size, r.type, ...(r.state === 'Default' ? [] : [stateName(r.state)])].join(' · '),
  spec: { parts: [rowPart(r)] },
});
export const menuCopy = (rows: Row[]) => {
  const size = rows[0].size;
  return {
    label: `${size} · ${rows[0].type} menu`,
    spec: {
      parts: rows.map(rowPart),
      wrap: { name: 'Dropdown menu', dir: 'VERTICAL' as const, gap: 4, pad: 8, radius: size === 'Large' ? 16 : 12, fill: '#FFFFFF', stroke: '#EBEBEB' },
    },
  };
};
