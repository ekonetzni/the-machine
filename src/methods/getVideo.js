/* Methods signature (currentTarget, args: {previousTargets: [], params, context, name }): {
 *   result: any
 *   name: string
 *   args: {previousTargets: [], params, context, name })
 * }
 */
const { control } = require('../utils');
const { google } = require('googleapis');

const METHOD_NAME = 'getVideo';
const _log = msg => control(msg, METHOD_NAME);

const apiKey = 'AIzaSyDDa_qvePRKjFYMTNdgnDUnsTK-DFGtcsY';
const youtube = google.youtube({ version: 'v3', auth: apiKey });
console.log(youtube.search);

const getVideo = async (currentTarget, args) => {
  const { settings } = args.context;

  return {
    result: '',
    name: METHOD_NAME,
    args
  };
};

module.exports = getVideo;
