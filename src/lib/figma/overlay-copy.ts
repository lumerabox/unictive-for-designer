// copy specs for the modal and popover pages, from the options their playgrounds render from.
// the base variant gets the matching header and footer swapped in, and the slot gets the body text
import type { CopySpec, Part } from './controls';
import { copy, type Header, type Align, type Footer as ModalFooter } from '../../data/modal';
import { tour, type Arrow, type Size, type Footer as PopFooter } from '../../data/popover';

export const copyPage = { modal: 'modal', popover: 'popover' } as const;

const modalLead: Partial<Record<ModalFooter, Record<string, string>>> = {
  'Icon + Text': { Copy: 'Copy link' },
  'Link Button': { 'Link Button': 'Learn more' },
  Checkbox: { Label: 'Don’t show this again' },
};

export function modalSpec(o: { header: Header; description: boolean; align: Align; close: boolean; footer: ModalFooter }): CopySpec {
  const c = copy[o.header];
  // Vertical puts the main action on top
  const confirm = `Action > Buttons#${o.footer === 'Vertical' ? 0 : 1} > Text > Button`;
  return {
    parts: [{
      variant: 'Modal',
      texts: { Body: c.body },
      swap: [
        {
          path: 'Modal-header',
          part: {
            variant: `Modal-header / ${o.header} / ${o.description} / ${o.align}`,
            texts: { 'Modal Title': c.title, 'Lorem ipsum dolor sit amet consectetur': c.desc },
            hide: o.close ? [] : ['x-close-line'],
          },
        },
        { path: 'Modal-footer', part: { variant: `Modal-footer / ${o.footer}`, texts: { [confirm]: c.confirm, ...modalLead[o.footer] } } },
      ],
    }],
  };
}

export function popoverSpec(o: { arrow: Arrow | 'No'; size: Size; header: boolean; footer: boolean; footerType: PopFooter; icon: boolean; description: boolean; padding: boolean; step?: number }): CopySpec {
  const step = Math.max(0, Math.min(tour.length - 1, o.step ?? 0));
  const t = tour[step];
  const last = step === tour.length - 1;
  const swap: { path: string; part: Part }[] = [];
  if (o.header)
    swap.push({
      path: 'Popover-header',
      part: {
        variant: `Popover-header / ${o.size}`,
        texts: { Title: t.title, 'Lorem ipsum dolor sit amet': t.desc },
        hide: [...(o.icon ? [] : ['Icon Buttons']), ...(o.description ? [] : ['Lorem ipsum dolor sit amet'])],
      },
    });
  if (o.footer) {
    const buttons = o.footerType === 'Button Hug' || o.footerType === 'Button Fill';
    // after the first step the back arrow is on, the dots follow the tour
    const variant = `Popover-footer / ${o.footerType} / ${o.size}${!buttons && step > 0 ? ' / Back' : ''}`;
    swap.push({
      path: 'Popover-footer',
      part: buttons
        ? { variant, texts: { 'Buttons#1 > Text > Button': last ? 'Done' : 'Next' } }
        : o.footerType === 'Step'
          ? { variant, texts: { 'Step 1 of 4': `Step ${step + 1} of ${tour.length}` } }
          : { variant, fill: [{ path: 'Indicator', parts: tour.map((_, i) => ({ variant: `Popover-dot / ${i === step ? 'On' : 'Off'} / ${o.size}` })) }] },
    });
  }
  return {
    parts: [{
      variant: `Popover / ${o.arrow === 'No' ? 'Top Left' : o.arrow} / ${o.size} / ${o.padding}`,
      texts: { Body: t.body },
      hide: [...(o.arrow === 'No' ? ['Tail'] : []), ...(o.header ? [] : ['Popover-header']), ...(o.footer ? [] : ['Popover-footer'])],
      swap,
    }],
  };
}
