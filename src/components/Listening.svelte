<script>
  import { getData } from 'services/lastfm'

  const METHOD = 'user.getrecenttracks'

  async function fetchData(method) {
    return await getData(method)
  }

  let data = fetchData(METHOD)
</script>

{#await data}
  Loading lastfm...
{:then tracks}
  <!-- <p class="text-sm">Listening to:</p> -->
  {#each tracks.recenttracks.track.slice(0, 1) as track}
    <p class="text-sm">
      {track.name} by
      {track.artist['#text']}
      {#if track['@attr']?.nowplaying}
        <span>now playing!</span>{/if}
    </p>
  {/each}
{:catch someError}
  System error: {someError.message}.
{/await}
