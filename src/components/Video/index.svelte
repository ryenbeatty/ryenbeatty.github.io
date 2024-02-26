<script lang="ts">
  import 'vidstack/player/styles/base.css'
  import './buttons.css'

  import 'vidstack/player'
  import 'vidstack/player/ui'
  import 'vidstack/icons'

  import type { MediaPlayerElement } from 'vidstack/elements'

  import VideoLayout from './components/layouts/VideoLayout.svelte'

  let player: MediaPlayerElement
</script>

<media-player
  class="player"
  title="Sprite Fight"
  src="https://stream.mux.com/VZtzUzGRv02OhRnZCxcNg49OilvolTqdnFLEqBsTwaxU/low.mp4"
  crossorigin
  playsinline
  bind:this={player}
>
  <media-provider>
    <media-poster
      class="poster"
      src="https://image.mux.com/VZtzUzGRv02OhRnZCxcNg49OilvolTqdnFLEqBsTwaxU/thumbnail.webp?time=268&width=1200"
      alt="Girl walks into campfire with gnomes surrounding her friend ready for their next meal!"
    />
  </media-provider>

  <VideoLayout />
</media-player>

<style>
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
