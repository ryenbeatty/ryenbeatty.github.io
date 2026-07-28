<script lang="ts">
  import { onMount } from 'svelte'
  import {
    isCommandCenterEnabled,
    isCommandCenterTransitioning,
    transitionCommandCenter,
  } from '../lib/theme'

  let enabled =
    typeof document !== 'undefined' &&
    document.documentElement.hasAttribute('data-command-center')
  let transitioning = false

  function syncEnabled() {
    enabled = isCommandCenterEnabled()
  }

  async function toggle() {
    if (transitioning || isCommandCenterTransitioning()) return

    transitioning = true
    const next = !isCommandCenterEnabled()

    try {
      await transitionCommandCenter(next)
    } finally {
      transitioning = false
      syncEnabled()
    }
  }

  onMount(() => {
    syncEnabled()

    const onChange = (event: Event) => {
      const detail = (event as CustomEvent<{ enabled: boolean }>).detail
      enabled =
        typeof detail?.enabled === 'boolean'
          ? detail.enabled
          : isCommandCenterEnabled()
    }

    const onTransitionStart = () => {
      transitioning = true
    }

    const onTransitionEnd = () => {
      transitioning = false
      syncEnabled()
    }

    document.addEventListener('command-center-change', onChange)
    document.addEventListener('command-center-transition-start', onTransitionStart)
    document.addEventListener('command-center-transition-end', onTransitionEnd)

    return () => {
      document.removeEventListener('command-center-change', onChange)
      document.removeEventListener(
        'command-center-transition-start',
        onTransitionStart,
      )
      document.removeEventListener(
        'command-center-transition-end',
        onTransitionEnd,
      )
    }
  })
</script>

<button
  type="button"
  on:click={toggle}
  class="outpost-toggle"
  class:is-active={enabled}
  class:is-transitioning={transitioning}
  aria-pressed={enabled}
  aria-busy={transitioning}
  aria-label={enabled ? 'Exit' : 'Enter'}
  disabled={transitioning}
>
  <span class="crt-overlay crt-overlay--scanlines" aria-hidden="true"></span>
  <span class="crt-overlay crt-overlay--sweep" aria-hidden="true"></span>
  <span class="crt-overlay crt-overlay--flicker" aria-hidden="true"></span>
  <span class="crt-display__content">
    <span class="outpost-toggle__icon" aria-hidden="true">
      <svg
        width="14"
        height="14"
        viewBox="0 0 12 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          class="ring ring-outer"
          cx="6"
          cy="6"
          r="5.25"
          stroke="currentColor"
          stroke-width="0.75"
        />
        <circle
          class="ring ring-mid"
          cx="6"
          cy="6"
          r="3.25"
          stroke="currentColor"
          stroke-width="0.75"
        />
        <circle
          class="ring-pulse"
          cx="6"
          cy="6"
          r="2.5"
          stroke="currentColor"
          stroke-width="0.6"
        />
        <circle class="center-dot" cx="6" cy="6" r="0.75" fill="currentColor" />

        <g class="radar-sweep">
          <path
            d="M6 6 L6 0.75 A5.25 5.25 0 0 1 11.25 6 Z"
            fill="currentColor"
          />
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 6 6"
            to="360 6 6"
            dur={enabled ? '1.6s' : '2.4s'}
            repeatCount="indefinite"
          />
        </g>

        <circle
          class="radar-blip"
          cx="8.55"
          cy="4.05"
          r="0.55"
          fill="currentColor"
        />
      </svg>
    </span>
    <span class="outpost-toggle__label">{enabled ? 'Exit' : 'Enter'}</span>
  </span>
</button>

<style>
  .outpost-toggle {
    position: relative;
    overflow: hidden;
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    border: 1px solid #39ff14;
    background: #000000;
    cursor: pointer;
    padding: 0.2rem 0.45rem;
    color: #39ff14;
    border-radius: 4px;
    font-family: var(--font-mono);
    font-size: 0.7rem;
    font-weight: 500;
    letter-spacing: 0.04em;
    line-height: 1;
    text-shadow:
      0 0 4px rgba(57, 255, 20, 0.7),
      0 0 8px rgba(57, 255, 20, 0.35);
    box-shadow: inset 0 0 12px rgba(57, 255, 20, 0.08);
    animation: crt-jitter 5s steps(1) infinite;
    transition:
      background-color 0.15s ease,
      color 0.15s ease,
      box-shadow 0.15s ease;
  }

  .crt-overlay {
    position: absolute;
    inset: 0;
    border-radius: inherit;
    pointer-events: none;
  }

  .crt-overlay--scanlines {
    z-index: 2;
    background: repeating-linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0) 0,
      rgba(0, 0, 0, 0) 2px,
      rgba(0, 0, 0, 0.55) 2px,
      rgba(0, 0, 0, 0.55) 3px
    );
    opacity: 0.55;
  }

  .crt-overlay--sweep {
    z-index: 3;
    top: -35%;
    height: 28%;
    background: linear-gradient(
      to bottom,
      transparent 0%,
      rgba(57, 255, 20, 0.04) 35%,
      rgba(57, 255, 20, 0.22) 50%,
      rgba(57, 255, 20, 0.04) 65%,
      transparent 100%
    );
    animation: crt-sweep-roll 2.8s linear infinite;
  }

  .crt-overlay--flicker {
    z-index: 4;
    background: rgba(57, 255, 20, 0.12);
    animation: crt-flicker 0.11s steps(2) infinite;
  }

  @keyframes crt-flicker {
    0%,
    100% {
      opacity: 0.15;
    }
    50% {
      opacity: 0.75;
    }
  }

  .crt-display__content {
    position: relative;
    z-index: 1;
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
  }

  @keyframes crt-jitter {
    0%,
    91%,
    100% {
      transform: translate(0, 0);
    }
    92% {
      transform: translate(0.6px, 0);
    }
    93% {
      transform: translate(-0.5px, 0.35px);
    }
    94% {
      transform: translate(0.25px, -0.2px);
    }
  }

  @keyframes crt-sweep-roll {
    0% {
      transform: translateY(0);
    }
    100% {
      transform: translateY(420%);
    }
  }

  .outpost-toggle.is-active {
    text-shadow:
      0 0 2px rgba(0, 0, 0, 0.4),
      0 0 4px rgba(0, 0, 0, 0.2);
    box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.12);
  }

  .outpost-toggle.is-active .crt-overlay--scanlines {
    background: repeating-linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0) 0,
      rgba(0, 0, 0, 0) 2px,
      rgba(0, 0, 0, 0.2) 2px,
      rgba(0, 0, 0, 0.2) 3px
    );
  }

  .outpost-toggle.is-active .crt-overlay--sweep {
    background: linear-gradient(
      to bottom,
      transparent 0%,
      rgba(0, 0, 0, 0.03) 35%,
      rgba(0, 0, 0, 0.14) 50%,
      rgba(0, 0, 0, 0.03) 65%,
      transparent 100%
    );
  }

  .outpost-toggle.is-active .crt-overlay--flicker {
    background: rgba(0, 0, 0, 0.06);
  }

  .outpost-toggle__icon {
    display: inline-flex;
    flex-shrink: 0;
  }

  .outpost-toggle__icon :global(.ring) {
    fill: none;
  }

  .outpost-toggle__icon :global(.ring-outer) {
    opacity: 0.35;
    animation: ring-breathe 2.4s ease-in-out infinite;
  }

  .outpost-toggle__icon :global(.ring-mid) {
    opacity: 0.55;
    animation: ring-breathe 2.4s ease-in-out infinite 0.3s;
  }

  .outpost-toggle__icon :global(.ring-pulse) {
    fill: none;
    opacity: 0;
    transform-box: fill-box;
    transform-origin: center;
    animation: ring-pulse 2.4s ease-out infinite;
  }

  .outpost-toggle__icon :global(.radar-sweep path) {
    opacity: 0.55;
  }

  .outpost-toggle__icon :global(.center-dot) {
    animation: center-pulse 2.4s ease-in-out infinite;
  }

  .outpost-toggle__icon :global(.radar-blip) {
    opacity: 0;
    transform-box: fill-box;
    transform-origin: center;
    animation: blip-detect 2.4s linear infinite;
  }

  @keyframes ring-breathe {
    0%,
    100% {
      opacity: 0.3;
    }
    50% {
      opacity: 0.7;
    }
  }

  @keyframes ring-pulse {
    0% {
      transform: scale(0.35);
      opacity: 0.65;
    }
    70%,
    100% {
      transform: scale(1.15);
      opacity: 0;
    }
  }

  @keyframes center-pulse {
    0%,
    100% {
      opacity: 0.7;
    }
    50% {
      opacity: 1;
    }
  }

  @keyframes blip-detect {
    0%,
    62% {
      opacity: 0;
      transform: scale(0.5);
    }
    66% {
      opacity: 1;
      transform: scale(1.2);
    }
    72%,
    100% {
      opacity: 0;
      transform: scale(0.8);
    }
  }

  .outpost-toggle.is-active .outpost-toggle__icon :global(.ring-pulse),
  .outpost-toggle.is-active .outpost-toggle__icon :global(.radar-blip),
  .outpost-toggle.is-active .outpost-toggle__icon :global(.ring-outer),
  .outpost-toggle.is-active .outpost-toggle__icon :global(.ring-mid),
  .outpost-toggle.is-active .outpost-toggle__icon :global(.center-dot) {
    animation-duration: 1.6s;
  }

  @media (prefers-reduced-motion: reduce) {
    .outpost-toggle {
      animation: none;
    }

    .crt-overlay--sweep,
    .crt-overlay--flicker {
      animation: none;
      display: none;
    }

    .crt-overlay--scanlines {
      opacity: 0.35;
    }

    .outpost-toggle__icon :global(.ring-outer),
    .outpost-toggle__icon :global(.ring-mid),
    .outpost-toggle__icon :global(.ring-pulse),
    .outpost-toggle__icon :global(.center-dot),
    .outpost-toggle__icon :global(.radar-blip) {
      animation: none !important;
    }

    .outpost-toggle__icon :global(.radar-sweep animateTransform) {
      display: none;
    }
  }

  .outpost-toggle.is-transitioning {
    cursor: wait;
    opacity: 0.72;
  }

  .outpost-toggle.is-transitioning .crt-overlay--sweep,
  .outpost-toggle.is-transitioning .crt-overlay--flicker {
    animation-play-state: paused;
  }

  .outpost-toggle:hover {
    box-shadow: 0 0 8px rgba(57, 255, 20, 0.35);
  }

  .outpost-toggle.is-active {
    background-color: #39ff14;
    color: #000000;
    box-shadow: 0 0 10px rgba(57, 255, 20, 0.5);
  }
</style>
