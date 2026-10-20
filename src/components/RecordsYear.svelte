<script>
  import { getData } from 'services/lastfm'

  const METHOD = 'user.getTopAlbums'

  async function fetchData(method) {
    return await getData(method)
  }

  let data = fetchData(METHOD)
</script>
<div class="records-year">
  {#await data}
    Loading lastfm...
  {:then albums}
    <!-- <p class="text-sm">Listening to:</p> -->
    {#each albums.topalbums.album.slice(0, 8) as album}
      <div class="records-year__album">
        <a href={album.url} target="_blank" rel="noreferrer">
          <img
            class="records-year__cover"
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

<style>
  .records-year {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 1rem;
  }

  .records-year__album {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    min-width: 0;
  }

  .records-year__cover {
    display: block;
    width: 100%;
    height: auto;
  }

  .records-year__album p {
    overflow-wrap: anywhere;
  }

  @container page (max-width: 600px) {
    .records-year {
      grid-template-columns: minmax(0, 1fr);
    }
  }

  @media (max-width: 960px) {
    .records-year {
      grid-template-columns: minmax(0, 1fr);
    }
  }
</style>
