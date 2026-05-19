import { pathToFileURL } from 'node:url';
import { resolve as resolvePath } from 'node:path';

const srcURL = pathToFileURL(resolvePath(process.cwd(), 'src') + '/');

export function resolve(specifier, context, nextResolve) {
  if (specifier.startsWith('@/')) {
    const resolved = new URL(specifier.slice(2), srcURL).href;
    return nextResolve(resolved, context);
  }
  return nextResolve(specifier, context);
}
