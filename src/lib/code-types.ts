// shapes shared by the component code pages
export type ClassRow = [name: string, type: string, desc: string];

export interface Example {
  id: string;
  title: string;
  desc: string;
  html: string;
  stack?: boolean;
  // room under the preview for an open menu or calendar
  height?: number;
}
