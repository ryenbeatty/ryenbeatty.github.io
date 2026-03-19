<script lang="ts">
  import 'vidstack/player/styles/base.css'
  import './buttons.css'

  import 'vidstack/player'
  import 'vidstack/player/ui'
  import 'vidstack/icons'

  import { onDestroy } from 'svelte'
  import type { MediaPlayerElement } from 'vidstack/elements'

  import VideoLayout from './components/layouts/VideoLayout.svelte'

  let player: MediaPlayerElement
  let pipObserver: MutationObserver | null = null
  export let viewType: MediaViewType = 'video'
  export let src =

    'https://stream.mux.com/VZtzUzGRv02OhRnZCxcNg49OilvolTqdnFLEqBsTwaxU/low.mp4'
  export let title = 'Sprite Fight'
  export let poster =
    'https://image.mux.com/VZtzUzGRv02OhRnZCxcNg49OilvolTqdnFLEqBsTwaxU/thumbnail.webp?time=268&width=1200'
  export let posterAlt =
    'Girl walks into campfire with gnomes surrounding her friend ready for their next meal!'

  function applyNoPip(video: HTMLVideoElement) {
    video.disablePictureInPicture = true
    video.disableRemotePlayback = true
  }

  function findAndDisablePip(root: ParentNode): boolean {
    const video = root.querySelector?.('video')
    if (video instanceof HTMLVideoElement) {
      applyNoPip(video)
      return true
    }
    const el = root as HTMLElement & { shadowRoot?: ShadowRoot }
    if (el.shadowRoot && findAndDisablePip(el.shadowRoot)) return true
    for (const child of Array.from(root.querySelectorAll?.('*') ?? [])) {
      if (findAndDisablePip(child as ParentNode)) return true
    }
    return false
  }

  $: if (player) {
    pipObserver?.disconnect()
    pipObserver = null
    const p = player as unknown as HTMLElement & { shadowRoot?: ShadowRoot }
    const run = () => {
      if (findAndDisablePip(p)) return
      pipObserver = new MutationObserver(() => {
        if (findAndDisablePip(p)) {
          pipObserver?.disconnect()
          pipObserver = null
        }
      })
      pipObserver.observe(p, { childList: true, subtree: true })
      if (p.shadowRoot) pipObserver.observe(p.shadowRoot, { childList: true, subtree: true })
    }
    setTimeout(run, 0)
  }

  onDestroy(() => {
    pipObserver?.disconnect()
    pipObserver = null
  })
</script>

<div class="player-wrap">
  <media-player
    class="player"
    {title}
    {src}
    crossorigin
    playsinline
    autoplay
    loop
    muted
    disablePictureInPicture
    bind:this={player}
  >
    <media-provider>
      {#if poster}
        <media-poster class="poster" src={poster} alt={posterAlt} />
      {/if}
    </media-provider>
  </media-player>
  {#if player}
    <VideoLayout {player} />
  {/if}
</div>

<style>
  .player-wrap {
    position: relative;
    width: 100%;
  }

  .player-wrap :global(.player) {
    display: block;
  }

  .player {
    --media-brand: #f5f5f5;
    --media-focus-ring-color: #4e9cf6;
    --media-focus-ring: 0 0 0 3px var(--media-focus-ring-color);

    --media-tooltip-y-offset: 30px;
    --media-menu-y-offset: 30px;

    aspect-ratio: 16 /9;
    background-color: #212121;
    border-radius: var(--media-border-radius);
    color: #f5f5f5;
    contain: layout;
    font-family: sans-serif;
    overflow: hidden;

    &[data-focus]:not([data-playing]) {
      box-shadow: var(--media-focus-ring);
    }
  }

  .player :global(video),
  .poster {
    border-radius: var(--media-border-radius);
  }

  .player :global(video) {
    object-fit: cover;
  }

  .poster {
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0;
    width: 100%;
    height: 100%;

    &[data-visible] {
      opacity: 1;
    }
  }

  .poster :global(img) {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
</style>
