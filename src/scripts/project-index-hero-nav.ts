import { navigate } from 'astro:transitions/client'

const FADE_MS = 154

let navLock = false

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function resetProjectIndexNav(): void {
  navLock = false
  document.querySelectorAll('.project-index--hero-nav').forEach((el) => {
    el.classList.remove('project-index--hero-nav')
  })
  document.querySelectorAll('[data-nav-hidden]').forEach((el) => {
    el.removeAttribute('data-nav-hidden')
  })
  document.querySelectorAll('.project-tile--nav-active').forEach((el) => {
    el.classList.remove('project-tile--nav-active')
  })
}

document.addEventListener('astro:page-load', resetProjectIndexNav)

function isProjectWorkLink(anchor: HTMLAnchorElement): boolean {
  if (anchor.target === '_blank') return false
  const url = new URL(anchor.href, location.href)
  if (url.origin !== location.origin) return false
  return /^\/work\/[^/]+\/?$/.test(url.pathname)
}

function beginHeroNav(index: HTMLElement, tile: HTMLElement, activeCell: HTMLElement): void {
  index.classList.add('project-index--hero-nav')
  tile.classList.add('project-tile--nav-active')

  index.querySelectorAll('.project-index__cell').forEach((cell) => {
    if (cell !== activeCell) cell.setAttribute('data-nav-hidden', '')
  })

  index.querySelectorAll('.project-index__cta').forEach((cta) => {
    cta.setAttribute('data-nav-hidden', '')
  })
}

document.addEventListener(
  'click',
  (event) => {
    if (navLock) return
    if (event.defaultPrevented) return
    if (event.button !== 0) return
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return

    const target = event.target
    if (!(target instanceof Element)) return

    const anchor = target.closest('a.project-tile__link')
    if (!(anchor instanceof HTMLAnchorElement)) return
    if (!isProjectWorkLink(anchor)) return

    const index = anchor.closest('.project-index')
    if (!(index instanceof HTMLElement)) return

    const tile = anchor.closest('.project-tile')
    const activeCell = anchor.closest('.project-index__cell')
    if (!(tile instanceof HTMLElement) || !(activeCell instanceof HTMLElement)) return

    event.preventDefault()
    navLock = true

    beginHeroNav(index, tile, activeCell)

    const delay = prefersReducedMotion() ? 0 : FADE_MS

    window.setTimeout(() => {
      void navigate(anchor.href).finally(() => {
        navLock = false
      })
    }, delay)
  },
  { capture: true },
)
