// code for developers: file upload classes and html examples. the css lives in global-css.ts
import type { ClassRow, Example } from './code-types';
import { upload as uploadPath, stateIcon, close as closePath, refresh } from '../components/file-upload/icons';
import { cardInfo, maxFiles, maxSizeMB, type AreaSize, type CardSize, type CardState } from '../data/file-upload';

const svg = (box: number, d: string, solid = false) =>
  `<svg viewBox="0 0 ${box} ${box}" fill="none" aria-hidden="true"><path d="${d}"${solid ? ' fill="currentColor" stroke="none"' : ''} /></svg>`;

interface Area {
  id: string;
  size?: AreaSize;
  label?: string;
  required?: boolean;
  optional?: boolean;
  caption?: string;
  disabled?: boolean;
  accept?: string;
}

// label, the drop zone around a hidden file input, and the caption
function area({ id, size = 'Large', label, required, optional, caption, disabled, accept }: Area) {
  const input = [
    `<input type="file" id="${id}" class="upload-input" multiple`,
    accept && `accept="${accept}"`,
    label && `aria-labelledby="${id}-label"`,
    caption && `aria-describedby="${id}-caption"`,
    disabled && 'disabled',
  ].filter(Boolean).join(' ') + ' />';
  const zone = size === 'Large'
    ? [
        '<label class="upload">',
        `  ${input}`,
        `  <span class="upload-icon">${svg(20, uploadPath[20])}</span>`,
        `  <span class="upload-text"><span class="upload-title">Drag &amp; drop files here</span><span class="upload-desc">Or click to browse (max ${maxFiles} files, up to ${maxSizeMB}MB each)</span></span>`,
        '  <span class="upload-btn">Browse files</span>',
        '</label>',
      ]
    : [
        '<label class="upload upload-sm">',
        `  ${input}`,
        `  ${svg(16, uploadPath[16])}`,
        '  <span>Drag &amp; drop or <span class="upload-link">choose files</span> to Upload</span>',
        '</label>',
      ];
  return [
    '<div class="field">',
    label && `  <span class="field-label" id="${id}-label">${label}${required ? '<span class="field-req">*</span>' : ''}${optional ? '<span class="field-opt">(Optional)</span>' : ''}</span>`,
    ...zone.map((l) => '  ' + l),
    caption && `  <div class="field-foot"><span class="field-caption" id="${id}-caption">${caption}</span></div>`,
    '</div>',
  ].filter(Boolean).join('\n');
}

const sizeClass = { Large: '', Medium: ' file-card-md', Small: ' file-card-sm' } as const;
const stateClass: Record<CardState, string> = { 'Ready to Upload': ' file-card-ready', Loading: ' file-card-loading', Finish: ' file-card-done', Failed: ' file-card-failed', View: ' file-card-view' };

interface Card { name: string; size?: CardSize; state?: CardState; meta?: string[]; close?: boolean }

// one picked file: state icon, name, status line and the actions
export function fileCard({ name, size = 'Large', state = 'Ready to Upload', meta, close = true }: Card) {
  const box = size === 'Large' ? 20 : 16;
  const act = size === 'Large' ? 16 : 12;
  const lines = meta ?? cardInfo[state].filter(Boolean) as string[];
  return [
    `<div class="file-card${sizeClass[size]}${stateClass[state]}">`,
    `  <span class="file-card-icon">${svg(box, stateIcon[state][box], state === 'Finish')}</span>`,
    '  <div class="file-card-body">',
    `    <span class="file-card-name">${name}</span>`,
    size !== 'Small' && `    <span class="file-card-meta">${lines.map((l) => `<span>${l}</span>`).join('')}</span>`,
    '  </div>',
    state === 'Failed' && `  <button type="button" class="file-card-action" aria-label="Retry upload">${svg(act, refresh[act], true)}</button>`,
    close && `  <button type="button" class="file-card-action" aria-label="Remove ${name}">${svg(act, closePath[act])}</button>`,
    '</div>',
  ].filter(Boolean).join('\n');
}

// the playground variant: the area with the card under it
export interface UploadSpec { areaSize: AreaSize; disabled: boolean; label: boolean; required: boolean; optional: boolean; caption: boolean; cardSize: CardSize; cardState: CardState; close: boolean; name: string; card: boolean }
export function fileUploadHtml(s: UploadSpec) {
  return [
    area({ id: 'files', size: s.areaSize, label: s.label ? 'Label' : undefined, required: s.required, optional: s.optional, caption: s.caption ? 'Input caption' : undefined, disabled: s.disabled }),
    s.card && fileCard({ name: s.name, size: s.cardSize, state: s.cardState, close: s.close }),
  ].filter(Boolean).join('\n');
}

export const classes: ClassRow[] = [
  ['upload', 'Component', 'Drop zone, a label around the file input so a click opens the picker. 32 px padding, dashed border'],
  ['upload-sm', 'Size', 'Small, everything on one row, 84 px high'],
  ['upload-input', 'Part', 'The file input, hidden but still focusable'],
  ['upload-icon', 'Part', 'Upload icon in a round frame, Large only'],
  ['upload-text', 'Part', 'Column for the title and the description'],
  ['upload-title', 'Part', 'Main instruction, Label 14/20'],
  ['upload-desc', 'Part', 'Limits like file count and size, 12/16'],
  ['upload-btn', 'Part', 'Browse files, looks like a button and opens the picker through the label'],
  ['upload-link', 'Part', 'The grey choose files words in Small'],
  ['upload-dragover', 'State', 'Brand border while a file is dragged over, add it on dragenter from script'],
  ['disabled', 'Attribute', 'On the input: grey zone, no picker'],
  ['file-card', 'Component', 'One picked file, Large with a 20 px icon'],
  ['file-card-md', 'Size', 'Medium, 48 px high with a 16 px icon'],
  ['file-card-sm', 'Size', 'Small, 44 px high, the name only'],
  ['file-card-ready', 'State', 'Picked, not sent yet. Dashed border'],
  ['file-card-loading', 'State', 'Uploading, the icon spins'],
  ['file-card-done', 'State', 'Uploaded'],
  ['file-card-view', 'State', 'Uploaded and being processed or reviewed'],
  ['file-card-failed', 'State', 'Red border, icon and status. Add a retry button before the remove button'],
  ['file-card-icon', 'Part', 'State icon in a framed box'],
  ['file-card-name', 'Part', 'File name, cut with an ellipsis when long'],
  ['file-card-meta', 'Part', 'Status line, put each value in a span and a dot goes between them'],
  ['file-card-action', 'Part', 'Retry or remove button. Give it an aria-label'],
];

export const examples: Example[] = [
  {
    id: 'ex-basic',
    title: 'Basic',
    desc: 'The zone is a label, so a click anywhere opens the file picker. Say what files fit in the description',
    html: area({ id: 'documents', label: 'Documents', required: true, caption: 'PDF, JPG or PNG' }),
  },
  {
    id: 'ex-small',
    title: 'Small',
    desc: 'upload-sm fits the zone in one row inside a form',
    html: area({ id: 'receipt', size: 'Small', label: 'Receipt', optional: true, caption: 'A photo or a scan is fine', accept: 'image/*,.pdf' }),
  },
  {
    id: 'ex-disabled',
    title: 'Disabled',
    desc: 'Add disabled to the input. The zone turns grey and the picker stays closed',
    html: area({ id: 'locked-files', label: 'Attachments', caption: 'Uploads close after the invoice is sent', disabled: true }),
  },
  {
    id: 'ex-states',
    title: 'File card states',
    desc: 'A file moves from ready through loading to done, or to failed. Swap the state class and the icon as it goes',
    html: [
      fileCard({ name: 'invoice-0425.pdf', state: 'Ready to Upload' }),
      fileCard({ name: 'invoice-0425.pdf', state: 'Loading' }),
      fileCard({ name: 'invoice-0425.pdf', state: 'Finish' }),
      fileCard({ name: 'invoice-0425.pdf', state: 'Failed' }),
      fileCard({ name: 'invoice-0425.pdf', state: 'View' }),
    ].join('\n'),
    stack: true,
  },
  {
    id: 'ex-sizes',
    title: 'File card sizes',
    desc: 'Large and Medium show a status line, Small shows the name only for dense lists',
    html: [
      fileCard({ name: 'passport-scan.pdf', state: 'Finish', meta: ['Uploaded', '1.2MB'] }),
      fileCard({ name: 'passport-scan.pdf', size: 'Medium', state: 'Finish', meta: ['Uploaded', '1.2MB'] }),
      fileCard({ name: 'passport-scan.pdf', size: 'Small', state: 'Finish' }),
    ].join('\n'),
    stack: true,
  },
  {
    id: 'ex-list',
    title: 'With picked files',
    desc: 'List each picked file under the zone, so people can follow the upload and remove a file',
    html: [
      '<div class="field" style="width: 400px; max-width: 100%">',
      ...area({ id: 'contract', size: 'Small', label: 'Contract', required: true }).split('\n').slice(1, -1),
      '</div>',
      '<div style="display: grid; gap: var(--spacing-8); width: 400px; max-width: 100%">',
      ...[fileCard({ name: 'contract-signed.pdf', size: 'Medium', state: 'Finish', meta: ['Uploaded', '2.4MB'] }), fileCard({ name: 'id-card.jpg', size: 'Medium', state: 'Loading', meta: ['Uploading', '64%'] })].join('\n').split('\n').map((l) => '  ' + l),
      '</div>',
    ].join('\n'),
    stack: true,
  },
];
