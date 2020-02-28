/* Methods signature (currentTarget, args: {previousTargets: [], params, context, name }): {
 *   result: any
 *   name: string
 *   args: {previousTargets: [], params, context, name })
 * }
 */
const { control } = require('../utils');
const { google } = require('googleapis');

const METHOD_NAME = 'selectVideoId';
const _log = msg => control(msg, METHOD_NAME);

const selectVideoId = async (currentTarget, args) => {
  const youtube = google.youtube({ version: 'v3', auth: process.env.YOUTUBE_KEY });
  const params = {
    part: 'id',
    type: 'video',
    q: currentTarget
  };
  let result;

  try {
    const results = await youtube.search.list(params);
    result = results.data.items[0].id.videoId;
  } catch (err) {
    results = '';
    _log(err);
  }

  return {
    result,
    name: METHOD_NAME,
    args
  };
};

const __fire = async () => {
  require('dotenv').config();
  const id = await selectVideoId('William Gibson Interview', {});
  console.log(id)
}
// __fire();

module.exports = selectVideoId;
