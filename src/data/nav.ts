export const topNav = [
  { label: 'Foundations', href: null },
  { label: 'Components', href: '/components/button/' },
  { label: 'Tokens', href: null },
  { label: 'Assets', href: null },
  { label: "What's new", href: null },
];

export const sideNav = [
  { group: 'Foundations', items: ['Color', 'Typography', 'Radius & spacing', 'Shadows', 'Icons'] },
  { group: 'Actions', items: ['Button'] },
  { group: 'Inputs', items: ['Text Input', 'Text Area', 'Dropdown', 'Date Picker', 'File Upload', 'Checkbox', 'Radio Group', 'Switch', 'Rating'] },
  { group: 'Navigation', items: ['Breadcrumbs', 'Tab Menu', 'Pagination', 'Stepper'] },
  { group: 'Feedback', items: ['Alert', 'Banner', 'Badge', 'Progress Bar', 'Tooltip'] },
  { group: 'Overlays', items: ['Modal', 'Popover'] },
];

// pages that are live; everything else is listed as coming soon
export const livePages: Record<string, string> = { Button: '/components/button/' };
