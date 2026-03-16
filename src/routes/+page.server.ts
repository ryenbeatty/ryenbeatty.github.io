import { getData } from 'services/lastfm';

export const load = async () => {
    const METHOD = 'user.getrecenttracks';
    const tracks = await getData(METHOD);

    return {
        tracks
    };
}; 