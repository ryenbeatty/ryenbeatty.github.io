<script>
  import { getData } from 'services/lastfm'
  import { Image } from 'astro:assets'

  const METHOD = 'user.getTopAlbums'

  async function fetchData(method) {
    return await getData(method)
  }

  let data = fetchData(METHOD)

  function logMessage() {
    console.log('Custom log message', data)
  }
</script>
<div class="grid grid-cols-4 gap-4">
  {#await data}
    Loading lastfm...
  {:then albums}
    <!-- <p class="text-sm">Listening to:</p> -->
    {#each albums.topalbums.album.slice(0, 8) as album}
      <div class="col-span-1 flex flex-col gap-2">
        <a href={album.url} target="_blank" rel="noreferrer">
          <img
            src={album.image[3]['#text']}
            alt={album.name}
            width="400"
            height="400"
          />
        </a>
        <p>
          <a href={album.url} target="_blank" rel="noreferrer">
            {album.name}
          </a>
        </p>
      </div>
    {/each}
  {:catch someError}
    System error: {someError.message}.
  {/await}
</div>
