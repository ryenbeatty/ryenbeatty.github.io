<script lang="ts">
  import { onMount } from 'svelte'
  import { TURTLE_ART } from '../data/turtle-art'

  export let scale = 0.34

  const TURTLE = TURTLE_ART

  const PADDING = 4

  let x = 0
  let preEl: HTMLPreElement | undefined
  let trackEl: HTMLElement | undefined
  let reducedMotion = false
  let ticking = false

  function updatePosition() {
    if (!trackEl || !preEl) return

    if (reducedMotion) {
      x = 0
      ticking = false
      return
    }

    const maxScroll =
      document.documentElement.scrollHeight - window.innerHeight
    const progress = maxScroll > 0 ? window.scrollY / maxScroll : 0
    const trackWidth = trackEl.clientWidth
    const artWidth = preEl.getBoundingClientRect().width
    const travel = Math.max(0, trackWidth - artWidth - PADDING)

    x = progress * travel
    ticking = false
  }

  function onScroll() {
    if (ticking) return
    ticking = true
    requestAnimationFrame(updatePosition)
  }

  onMount(() => {
    reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    requestAnimationFrame(updatePosition)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })

    const trackObserver =
      trackEl &&
      new ResizeObserver(() => {
        onScroll()
      })
    trackObserver?.observe(trackEl)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      trackObserver?.disconnect()
    }
  })
</script>

<div bind:this={trackEl} class="turtle-track" aria-hidden="true">
  <pre
    bind:this={preEl}
    class="turtle"
    style:transform="translate3d({x}px, 0, 0) scale({scale})"
  >{TURTLE}</pre>
</div>

<style>
  .turtle-track {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: visible;
  }

  .turtle {
    position: absolute;
    left: 0;
    bottom: 0;
    margin: 0;
    padding: 0;
    font-family: var(--font-mono), ui-monospace, Menlo, Monaco, Consolas,
      monospace;
    font-size: 10px;
    line-height: 1;
    letter-spacing: 0;
    white-space: pre;
    color: inherit;
    opacity: 1;
    transform-origin: bottom left;
    will-change: transform;
  }
</style>
