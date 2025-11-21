// Packages
import {
  VercelRequest,
  VercelResponse,
} from '@vercel/node';

// Local Imports
import aiAssistantsHandler from '../src/handlers/general/ai-assistants';
import { ERROR_MESSAGE_500 } from '../src/config';

/**
 * Returns an image displaying icons of AI assistants.
 *
 * @param {VercelRequest} req Request for image.
 * @param {VercelResponse} res Response to request.
 */
export default async function (req: VercelRequest, res: VercelResponse) {
  try {
    return await aiAssistantsHandler(req, res);
  } catch (error) {
    console.error(error);
    return res.status(500).send(ERROR_MESSAGE_500);
  }
}
