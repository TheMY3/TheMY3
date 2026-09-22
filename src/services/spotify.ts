// Packages
import fetch from 'node-fetch';
import { stringify } from 'querystring';

// Local Imports
import {
  SPOTIFY_AUTHORIZATION,
  SPOTIFY_AUTHORIZATION_URL,
  SPOTIFY_CURRENT_PLAYING_URL,
  SPOTIFY_GET_TRACK_AUDIO_FEATURES_URL,
  SPOTIFY_GET_TRACK_URL,
  SPOTIFY_GET_TOP_PLAYED_URL,
  SPOTIFY_RECENTLY_PLAYED_URL,
  SPOTIFY_REFRESH_TOKEN,
  SPOTIFY_SAVED_TRACKS_URL,
} from '../config';
import { getImageData } from './general';

// Types
import {
  IAudioFeaturesResponse,
  IAuthorizationTokenResponse,
  IConvertedTrackObject,
  ICurrentlyPlayingResponse,
  ICursorBasedPagingObject,
  IPagingObject,
  IPlayHistoryObject,
  ISavedTrackObject,
  ISpotifyFetchResult,
  ITrackObject,
} from '../types/spotify';

let AuthorizationToken: null | string = null;
let AuthorizationTokenExpiresAt = 0;

/**
 * Shaved off the token's lifetime so we never send one that expires mid-request.
 */
const TOKEN_EXPIRY_MARGIN_MS = 60 * 1000;

/**
 * Fallback lifetime if Spotify ever omits expires_in.
 */
const TOKEN_DEFAULT_LIFETIME_S = 3600;

/**
 * Uses my refresh token to get a brand new spotify auth token!
 *
 * Access tokens only live an hour, and a warm serverless instance outlives
 * that, so the cached one has to be re-requested once it expires.
 *
 * @param {boolean} [forceRefresh = false] Ignore the cached token.
 * @returns {Promise<string>} Authorization header for Spotify requests.
 */
const getAuthorizationToken = async (forceRefresh = false): Promise<string> => {
  if (!forceRefresh
    && AuthorizationToken !== null
    && Date.now() < AuthorizationTokenExpiresAt) {
    return AuthorizationToken;
  }

  const GRANT_TYPE = 'refresh_token';
  const CONTENT_TYPE = 'application/x-www-form-urlencoded';

  const body: string = stringify({
    grant_type: GRANT_TYPE,
    refresh_token: SPOTIFY_REFRESH_TOKEN,
  });

  const response = await fetch(`${SPOTIFY_AUTHORIZATION_URL}`, {
    method: 'POST',
    headers: {
      'Authorization': SPOTIFY_AUTHORIZATION,
      'Content-Type': CONTENT_TYPE,
    },
    body,
  });

  const data: IAuthorizationTokenResponse = await response.json();

  // Never cache a failure as if it were a token: `Bearer undefined` turns
  // every later call into a silent 401 with nothing in the logs to explain it.
  if (!response.ok || !data.access_token) {
    AuthorizationToken = null;
    AuthorizationTokenExpiresAt = 0;

    throw new Error(`Spotify token refresh failed (${response.status}): ${data.error || 'unknown_error'} - ${data.error_description || 'no description'}`);
  }

  AuthorizationToken = `Bearer ${data.access_token}`;
  AuthorizationTokenExpiresAt = Date.now()
    + ((data.expires_in || TOKEN_DEFAULT_LIFETIME_S) * 1000)
    - TOKEN_EXPIRY_MARGIN_MS;

  return AuthorizationToken;
}

/**
 * Makes an authorized request to Spotify, refreshing the token once if it's
 * rejected.
 *
 * @param {string} url Spotify endpoint to request.
 * @returns {Promise<ISpotifyFetchResult>} Response, and the header it was made with.
 */
const spotifyFetch = async (url: string): Promise<ISpotifyFetchResult> => {
  let Authorization: string = await getAuthorizationToken();

  let response: Response = await fetch(url, {
    headers: {
      Authorization,
    },
  });

  // Token Spotify no longer accepts (revoked mid-flight, clock skew): one retry.
  if (response.status === 401) {
    Authorization = await getAuthorizationToken(true);

    response = await fetch(url, {
      headers: {
        Authorization,
      },
    });
  }

  return {
    response,
    Authorization,
  };
}

/**
 * Generates a Currently Playing response for edge cases.
 *
 * @param {string} Authorization Authorization header for Spotify requests.
 * @param {ITrackObject | null} [track = null] Track object to use for response.
 * @returns {ICurrentlyPlayingResponse} Currently playing response.
 */
const defaultCurrentlyPlayingResponse = (Authorization: string, track: ITrackObject = null): ICurrentlyPlayingResponse => ({
  context: null,
  timestamp: 0,
  progress_ms: 0,
  is_playing: false,
  item: track,
  currently_playing_type: '',
  actions: {},
  Authorization,
});

/**
 * Requests currently playing track from Spotify.
 *
 * @returns {Promise<ICurrentlyPlayingResponse | object>} Currently Playing Spotify Object.
 */
export const getNowPlaying = async (): Promise<ICurrentlyPlayingResponse> => {
  const {
    response,
    Authorization,
  } = await spotifyFetch(SPOTIFY_CURRENT_PLAYING_URL);

  const { status } = response;

  if (status === 200) {
    const data: ICurrentlyPlayingResponse = await response.json();
    data.Authorization = Authorization;

    return data;
  } else {
    return defaultCurrentlyPlayingResponse(Authorization);
  }
};

/**
 * Requests last played track from Spotify
 *
 * @returns {Promise<ICursorBasedPagingObject | object>} Currently Playing Spotify Object
 */
export const getLastPlayed = async (): Promise<ICurrentlyPlayingResponse> => {
  const {
    response,
    Authorization,
  } = await spotifyFetch(SPOTIFY_RECENTLY_PLAYED_URL);

  const { status } = response;

  if (status === 200) {
    const data: ICursorBasedPagingObject<IPlayHistoryObject> = await response.json();

    // Nothing in the history: nothing to show.
    if (!data.items || !data.items.length) {
      return defaultCurrentlyPlayingResponse(Authorization);
    }

    const { response: trackResponse } = await spotifyFetch(`${SPOTIFY_GET_TRACK_URL}/${ data.items[0].track.id }`);

    const track: ITrackObject = await trackResponse.json();

    return defaultCurrentlyPlayingResponse(Authorization, track);
  }
  return defaultCurrentlyPlayingResponse(Authorization);
};

/**
 * Requests a track's audio features from Spotify.
 *
 * @param {string} id Spotify track id.
 * @returns {Promise<IAudioFeaturesResponse | object>} Audio features object.
 */
export const getTracksAudioFeatures = async (id: string): Promise<IAudioFeaturesResponse | object> => {
  const { response } = await spotifyFetch(`${SPOTIFY_GET_TRACK_AUDIO_FEATURES_URL}/${id}`);

  const { status } = response;

  if (status === 200) {
    return await response.json();
  } else {
    return {};
  }
};

/**
 * Requests top played tracks from Spotify.
 *
 * @param {string} timeRange Spotify parameter for top played time range.
 * @returns {Promise<ITrackObject[]>} Array of Spotify track objects.
 */
export const getTopPlayed = async (timeRange: string): Promise<ITrackObject[]> => {
  const { response } = await spotifyFetch(`${SPOTIFY_GET_TOP_PLAYED_URL}${timeRange}`);

  const { status } = response;

  if (status === 200) {
    const data: IPagingObject<ITrackObject> = await response.json();
    return data.items;
  } else {
    return [];
  }
};

/**
 * Requests saved (liked) tracks from Spotify.
 *
 * @returns {Promise<ITrackObject[]>} Array of Spotify track objects.
 */
export const getSavedTracks = async (): Promise<ITrackObject[]> => {
  const { response } = await spotifyFetch(SPOTIFY_SAVED_TRACKS_URL);

  const { status } = response;

  if (status === 200) {
    const data: IPagingObject<ISavedTrackObject> = await response.json();
    return data.items.map((item) => item.track);
  } else {
    return [];
  }
};

/**
 * Requests recently played tracks from Spotify.
 *
 * @returns {Promise<ITrackObject[]>} Array of Spotify track objects.
 */
export const getRecentlyPlayedTracks = async (): Promise<ITrackObject[]> => {
  const { response } = await spotifyFetch(`${SPOTIFY_RECENTLY_PLAYED_URL.replace('limit=1', 'limit=5')}`);

  const { status } = response;

  if (status === 200) {
    const data: ICursorBasedPagingObject<IPlayHistoryObject> = await response.json();
    return data.items.map((item) => item.track);
  } else {
    return [];
  }
};

/**
 * Removes data and simplifies track object.
 *
 * @param {ITrackObject} track Track object to be converted.
 * @returns {Promise<IConvertedTrackObject>} Converted track object.
 */
export const convertTrackToMinimumData = async (track: ITrackObject): Promise<IConvertedTrackObject> => {
  let albumArtUrl = 'https://raw.githubusercontent.com/andyruwruw/andyruwruw/master/src/assets/images/default-album-art.png';
  if ('album' in track && 'images' in track.album && track.album.images.length) {
    albumArtUrl = track.album.images[0].url;
  }
  const image = await getImageData(albumArtUrl);

  let artist = 'Unknown Artist';
  if ('artists' in track && track.artists.length) {
    artist = track.artists.map((artist) => artist.name).join(', ');
  }

  let name = 'Unknown Track';
  if ('name' in track) {
    name = track.name;
  }

  let href = '#';
  if ('external_urls' in track && 'spotify' in track.external_urls) {
    href = track.external_urls.spotify;
  }

  return {
    image,
    artist,
    name,
    href,
  };
};
