export enum LastFmMethods {
  RecentTracks = 'user.getRecentTracks',
  TopArtists = 'user.getTopArtists',
  WeeklyAlbums = 'user.getWeeklyAlbumChart',
  WeeklyArtists = 'user.getWeeklyArtistChart',
  WeeklyTracks = 'user.getWeeklyTrackChart',
}

export const getData = async (method: LastFmMethods) =>
  fetch(
    `https://ws.audioscrobbler.com/2.0/?method=${method}&user=${import.meta.env.PUBLIC_LAST_FM_USERNAME}&api_key=${import.meta.env.PUBLIC_LAST_FM_API_KEY}&format=json&period=12month`,
  )
    .then(async (response) => {
      if (response.ok) {
        const res = await response.json()

        return res
      }
      throw new Error('error')
    })
    .catch(console.error)
