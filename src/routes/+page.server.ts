import { getData, LastFmMethods } from 'services/lastfm';

export const load = async () => {
    const method = LastFmMethods.RecentTracks;
    const tracks = await getData(method);

    return {
        tracks
    };
}; 