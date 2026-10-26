// downloadable token files, built at deploy time
import type { APIRoute, GetStaticPaths } from 'astro';
import { formats } from '../../lib/tokens-export';

export const getStaticPaths: GetStaticPaths = () => formats.map((f) => ({ params: { file: f.file } }));

export const GET: APIRoute = ({ params }) => {
  const f = formats.find((f) => f.file === params.file)!;
  return new Response(f.build(), { headers: { 'Content-Type': `${f.type}; charset=utf-8` } });
};
