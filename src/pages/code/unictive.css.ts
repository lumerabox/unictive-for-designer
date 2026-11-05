// unictive.css: every component class without tailwind, the file published as unictive-ds
import { standaloneCss } from '../../lib/global-css';

export function GET() {
  return new Response(standaloneCss, { headers: { 'Content-Type': 'text/css; charset=utf-8' } });
}
