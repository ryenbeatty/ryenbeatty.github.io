/**
 * Lucide icons — use the package that matches your component type:
 *
 * Astro (`.astro`):
 * ```astro
 * ---
 * import { ArrowRight } from '@lucide/astro';
 * ---
 * <ArrowRight size={20} aria-hidden="true" />
 * ```
 *
 * React (`.tsx`):
 * ```tsx
 * import { ArrowRight } from 'lucide-react';
 * <ArrowRight size={20} aria-hidden />
 * ```
 *
 * Svelte 4 (`.svelte`):
 * ```svelte
 * <script lang="ts">
 *   import { ArrowRight } from 'lucide-svelte';
 * </script>
 * <ArrowRight size={20} aria-hidden="true" />
 * ```
 *
 * Generic Astro icon from an `IconNode` (e.g. from `@lucide/lab`):
 * ```astro
 * ---
 * import { LucideIcon } from 'components/icons';
 * import { burger } from '@lucide/lab';
 * ---
 * <LucideIcon iconNode={burger} size={20} />
 * ```
 */
export { Icon as LucideIcon } from '@lucide/astro';
export type { IconProps as LucideIconProps, IconNode } from '@lucide/astro';
