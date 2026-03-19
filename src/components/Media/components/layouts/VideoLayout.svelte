<script lang="ts">
  import type { MediaPlayerElement } from 'vidstack/elements'

  export let player: MediaPlayerElement | undefined = undefined

  let muted = true
  let x = 0
  let y = 0
  let hover = false

  function handleClick() {
    const p = player
    if (!p) return
    if (muted) {
      p.muted = false
      p.currentTime = 0
      p.volume = 1
      p.play()
      muted = false
    } else {
      p.muted = true
      muted = true
    }
  }

  function handleMouseMove(e: MouseEvent) {
    x = e.clientX
    y = e.clientY
  }
</script>

<div class="video-layout">
  <div
    class="mute-overlay"
    role="button"
    tabindex="0"
    on:click={handleClick}
    on:keydown={(e) => e.key === 'Enter' && handleClick()}
    on:mouseenter={() => (hover = true)}
    on:mouseleave={() => (hover = false)}
    on:mousemove={handleMouseMove}
    aria-label={muted ? 'Unmute' : 'Mute'}
  >
    {#if hover}
      <span class="mute-overlay__cursor" style="left: {x}px; top: {y}px;">{muted ? '🔇' : '🔊'}</span>
    {/if}
  </div>
</div>

<style lang="postcss">
  .video-layout {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }

  .video-layout .mute-overlay {
    pointer-events: auto;
  }

  .mute-overlay {
    position: absolute;
    inset: 0;
    z-index: 10;
    cursor: none;
  }

  .mute-overlay:focus {
    outline: none;
  }

  .mute-overlay__cursor {
    position: fixed;
    font-size: 1.5rem;
    line-height: 1;
    pointer-events: none;
    transform: translate(-50%, -50%);
    z-index: 9999;
  }
</style>
