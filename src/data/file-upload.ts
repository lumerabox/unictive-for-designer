// values read from the File-upload-area and Card-upload component sets in Unictive Design System 1.0
export const areaSizes = ['Large', 'Small'] as const;
export const disables = ['false', 'true'] as const;
export const cardSizes = ['Large', 'Medium', 'Small'] as const;
export const cardStates = ['Ready to Upload', 'Loading', 'Finish', 'Failed', 'View'] as const;

export type AreaSize = (typeof areaSizes)[number];
export type CardSize = (typeof cardSizes)[number];
export type CardState = (typeof cardStates)[number];

export const areaMetrics = {
  Large: { height: 206 },
  Small: { height: 84 },
} as const;

export const cardMetrics = {
  Large: { height: 60, icon: 20, box: 44 },
  Medium: { height: 48, icon: 16, box: 32 },
  Small: { height: 44, icon: 16, box: 28 },
} as const;

// secondary line per state, small cards show the file name only
export const cardInfo: Record<CardState, [string, string?]> = {
  'Ready to Upload': ['Ready to upload'],
  Loading: ['Uploading', '10%'],
  Finish: ['Uploaded', '32MB'],
  Failed: ['Upload failed. Try again'],
  View: ['Processing document'],
};

export const maxFiles = 2;
export const maxSizeMB = 5;
export const areaVariants = areaSizes.length * disables.length;
export const cardVariants = cardSizes.length * cardStates.length;
export const variantCount = areaVariants + cardVariants;

export const slug = (s: string) => s.toLowerCase().replace(/\s+/g, '-');
