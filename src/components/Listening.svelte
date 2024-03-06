<script>
  import { onMount } from 'svelte'

  import { getData } from 'services/lastfm'

  const METHOD = 'user.getRecentTracks'

  async function fetchData(method) {
    return await getData(method)
  }

  let data = fetchData(METHOD)

  // onMount(() => {
  //   const interval = setInterval(async () => {
  //     data = await fetchData(METHOD)
  //   }, 10000)

  //   return () => clearInterval(interval)
  // })
</script>

{#await data}
  Loading lastfm...
{:then tracks}
  <p>Listening to:</p>
  {#each tracks.recenttracks.track.slice(0, 9) as track}
    <li>
      {track.name} by
      {track.artist['#text']}
      {#if track['@attr']?.nowplaying}
        <span>now playing!</span>{/if}
    </li>
  {/each}
{:catch someError}
  System error: {someError.message}.
{/await}
