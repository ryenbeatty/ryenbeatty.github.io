/**
 * Prefix a root-relative path with Astro `base` (needed for GitHub Pages “project” sites).
 * @param path e.g. `work/kato` or `/work/kato`
 */
export function sitePath(path: string): string {
  const base = import.meta.env.BASE_URL || '/'
  const clean = path.replace(/^\//, '')
  const prefix = base.endsWith('/') ? base : `${base}/`
  return `${prefix}${clean}`
}
