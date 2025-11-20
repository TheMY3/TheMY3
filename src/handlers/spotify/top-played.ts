// Packages
import {
  VercelRequest,
  VercelResponse,
} from '@vercel/node';
import { renderToString } from 'react-dom/server';

// Local Imports
import {
  convertTrackToMinimumData,
  getRecentlyPlayedTracks,
  getSavedTracks,
  getTopPlayed,
} from '../../services/spotify';
import {
  ERROR_MESSAGE_500,
  SPOTIFY_DATA_SOURCES,
  SPOTIFY_TIME_RANGE_KEYS,
} from '../../config';
import { convertToImageResponse } from '../../services/general';
import { TopPlayed } from '../../components/spotify/TopPlayed';

// Types
import { IConvertedTrackObject, ITrackObject } from '../../types/spotify';

/**
 * Returns an image displaying three lists of tracks:
 * 1. Top played tracks (last ~4 weeks)
 * 2. Recently liked tracks (saved tracks)
 * 3. Recently played tracks
 *
 * @param {VercelRequest} req Request for image.
 * @param {VercelResponse} res Response to request.
 */
export default async function (req: VercelRequest, res: VercelResponse) {
  try {
    // Retrieving tracks from different data sources
    const trackLists: ITrackObject[][] = await Promise.all(
      SPOTIFY_DATA_SOURCES.map(async (source) => {
        switch (source) {
          case 'top': {
            // Top played tracks for each time range
            const topTracks = await Promise.all(
              SPOTIFY_TIME_RANGE_KEYS.map(async (timeRange) => await getTopPlayed(timeRange))
            );
            return topTracks[0] || []; // Get first (and only) time range
          }
          case 'saved':
            return await getSavedTracks();
          case 'recent':
            return await getRecentlyPlayedTracks();
          default:
            return [];
        }
      })
    );

    // Convert tracks to minimum data format
    const convertedTrackLists: IConvertedTrackObject[][] = await Promise.all(
      trackLists.map(async (tracks) =>
        await Promise.all(tracks.map(async (track) => await convertTrackToMinimumData(track)))
      )
    );

    // Hey! I'm returning an image!
    convertToImageResponse(res);

    // Generating the component and rendering it
    const text: string = renderToString(
      TopPlayed({ trackLists: convertedTrackLists })
    );

    return res.send(text);
  } catch (error) {
    res.status(500).send(ERROR_MESSAGE_500);
  }
}
