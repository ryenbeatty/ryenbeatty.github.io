<script lang="ts">
  import SliderChapters from './SliderChapters.svelte'
</script>

<media-time-slider class="media-slider">
  <SliderChapters />
</media-time-slider>

<style>
  .media-slider {
    display: inline-flex;
    align-items: center;
    width: 100%;
    height: 40px;
    position: relative;
    contain: layout style;
    outline: none;
    pointer-events: auto;
    cursor: pointer;
    user-select: none;
    touch-action: none;
    /** Prevent thumb flowing out of slider (15px = thumb width). */
    margin: 0 calc(15px / 2);
    -webkit-user-select: none;
    -webkit-tap-highlight-color: transparent;
  }
</style>
