// the global.css download on the component pages
import { globalCss } from '../../lib/global-css';

export function GET() {
  return new Response(globalCss, { headers: { 'Content-Type': 'text/css; charset=utf-8' } });
}
