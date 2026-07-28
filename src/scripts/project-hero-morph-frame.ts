const ROOT_CLASS = 'project-hero-morph-done'

function revealHeroFrame(): void {
  document.documentElement.classList.add(ROOT_CLASS)
}

function resetHeroFrame(): void {
  document.documentElement.classList.remove(ROOT_CLASS)
}

function viewTransitionDurationMs(): number {
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue('--view-transition-duration')
    .trim()
  if (!raw) return 410
  if (raw.endsWith('ms')) return Number.parseFloat(raw)
  if (raw.endsWith('s')) return Number.parseFloat(raw) * 1000
  return Number.parseFloat(raw) * 1000
}

function scheduleRevealAfterMorph(): void {
  const hero = document.querySelector('.project-hero-transition-target')
  if (!hero) {
    revealHeroFrame()
    return
  }

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    revealHeroFrame()
    return
  }

  const activeTransition =
    'activeViewTransition' in document
      ? (
          document as Document & {
            activeViewTransition?: { finished: Promise<void> } | null
          }
        ).activeViewTransition
      : null
  if (activeTransition) {
    void activeTransition.finished.then(revealHeroFrame).catch(revealHeroFrame)
    return
  }

  window.setTimeout(revealHeroFrame, viewTransitionDurationMs())
}

function onPageLoad(): void {
  resetHeroFrame()
  requestAnimationFrame(() => {
    requestAnimationFrame(scheduleRevealAfterMorph)
  })
}

document.addEventListener('astro:page-load', onPageLoad)
