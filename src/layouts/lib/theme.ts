export type ColorTheme = 'light' | 'dark'

const THEME_KEY = 'theme'
const COMMAND_CENTER_KEY = 'command-center'
const OUTPOST_FADE_MS = 1200
const OUTPOST_FADE_REDUCED_MS = 300
const OUTPOST_VEIL_ID = 'outpost-transition-veil'

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function getFadeDuration() {
  return prefersReducedMotion() ? OUTPOST_FADE_REDUCED_MS : OUTPOST_FADE_MS
}

function readWashColor() {
  return (
    getComputedStyle(document.documentElement)
      .getPropertyValue('--wash-color')
      .trim() || '#f8f6f1'
  )
}

function getVeil() {
  let veil = document.getElementById(OUTPOST_VEIL_ID)

  if (!veil) {
    veil = document.createElement('div')
    veil.id = OUTPOST_VEIL_ID
    veil.setAttribute('aria-hidden', 'true')
    document.body.appendChild(veil)
  }

  return veil
}

function getTransitionTargets() {
  return Array.from(
    document.querySelectorAll<HTMLElement>('.outpost-transition-target'),
  )
}

function animateOpacity(
  elements: HTMLElement[],
  from: number,
  to: number,
  duration: number,
) {
  if (elements.length === 0) return Promise.resolve()

  if (duration <= 0) {
    for (const element of elements) {
      element.style.opacity = String(to)
    }
    return Promise.resolve()
  }

  const animations = elements.map((element) => {
    element.style.opacity = String(from)

    return element
      .animate([{ opacity: from }, { opacity: to }], {
        duration,
        easing: 'ease-in-out',
        fill: 'forwards',
      })
      .finished.finally(() => {
        element.style.opacity = String(to)
      })
  })

  return Promise.all(animations).then(() => undefined)
}

let transitionLock = false

export function isCommandCenterTransitioning() {
  return transitionLock
}

export function getColorTheme(): ColorTheme {
  if (typeof localStorage === 'undefined') return 'light'
  const saved = localStorage.getItem(THEME_KEY)
  return saved === 'dark' ? 'dark' : 'light'
}

export function setColorTheme(value: ColorTheme) {
  document.documentElement.setAttribute('data-theme', value)
  localStorage.setItem(THEME_KEY, value)
}

export function isCommandCenterEnabled(): boolean {
  if (typeof document !== 'undefined') {
    return document.documentElement.hasAttribute('data-command-center')
  }

  if (typeof localStorage === 'undefined') return false
  return localStorage.getItem(COMMAND_CENTER_KEY) === 'true'
}

export function setCommandCenter(enabled: boolean) {
  if (enabled) {
    document.documentElement.setAttribute('data-command-center', 'true')
    localStorage.setItem(COMMAND_CENTER_KEY, 'true')
  } else {
    document.documentElement.removeAttribute('data-command-center')
    localStorage.removeItem(COMMAND_CENTER_KEY)
  }

  document.dispatchEvent(
    new CustomEvent('command-center-change', { detail: { enabled } }),
  )
}

function clearInlineOpacity() {
  for (const element of getTransitionTargets()) {
    element.style.opacity = ''
  }
}

async function fadeOut(duration: number, enteringOutpost: boolean) {
  const veil = getVeil()
  const targets = getTransitionTargets()

  veil.style.backgroundColor = enteringOutpost ? '#07080a' : readWashColor()
  veil.style.pointerEvents = 'auto'

  document.documentElement.setAttribute('data-outpost-fade', 'out')

  await Promise.all([
    animateOpacity([veil], 0, 1, duration),
    animateOpacity(targets, 1, 0, duration),
  ])
}

async function fadeIn(duration: number) {
  const veil = getVeil()
  const targets = getTransitionTargets()

  document.documentElement.setAttribute('data-outpost-fade', 'in')

  for (const element of targets) {
    element.style.opacity = '0'
  }

  await Promise.all([
    animateOpacity([veil], 1, 0, duration),
    animateOpacity(targets, 0, 1, duration),
  ])
}

export async function transitionCommandCenter(enabled: boolean) {
  if (typeof document === 'undefined') return
  if (transitionLock) return
  if (isCommandCenterEnabled() === enabled) return

  transitionLock = true
  const root = document.documentElement
  const duration = getFadeDuration()

  document.dispatchEvent(
    new CustomEvent('command-center-transition-start', {
      detail: { enabled },
    }),
  )

  try {
    await fadeOut(duration, enabled)
    setCommandCenter(enabled)
    await fadeIn(duration)
  } finally {
    root.removeAttribute('data-outpost-fade')
    getVeil().style.opacity = '0'
    getVeil().style.pointerEvents = 'none'
    clearInlineOpacity()
    transitionLock = false
    document.dispatchEvent(
      new CustomEvent('command-center-transition-end', {
        detail: { enabled },
      }),
    )
  }
}

export function initThemes() {
  setColorTheme(getColorTheme())
  setCommandCenter(isCommandCenterEnabled())
}
