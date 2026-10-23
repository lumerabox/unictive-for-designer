// shared clipboard write for every copy to figma button

// copy event route keeps the write inside the click gesture, works in every browser
export function writeClipboard(html: string, text: string) {
  let ok = false;
  const onCopy = (e: ClipboardEvent) => {
    e.clipboardData?.setData('text/html', html);
    e.clipboardData?.setData('text/plain', text);
    e.preventDefault();
    ok = true;
  };
  document.addEventListener('copy', onCopy);
  const sel = document.getSelection();
  const saved = sel && sel.rangeCount ? sel.getRangeAt(0) : null;
  const holder = document.createElement('span');
  holder.textContent = text;
  holder.style.cssText = 'position:fixed;left:-9999px;top:0;white-space:pre';
  document.body.append(holder);
  const range = document.createRange();
  range.selectNodeContents(holder);
  sel?.removeAllRanges();
  sel?.addRange(range);
  try { document.execCommand('copy'); } catch { ok = false; }
  sel?.removeAllRanges();
  if (saved) sel?.addRange(saved);
  holder.remove();
  document.removeEventListener('copy', onCopy);
  return ok;
}

// the async clipboard api takes a pending blob, so the first click works before the encoder loaded
export async function writeClipboardLater(html: Promise<string>, text: string) {
  try {
    const item = new ClipboardItem({
      'text/html': html.then((h) => new Blob([h], { type: 'text/html' })),
      'text/plain': new Blob([text], { type: 'text/plain' }),
    });
    await navigator.clipboard.write([item]);
    return true;
  } catch {
    return false;
  }
}
