/* Methods signature (currentTarget, args: {previousTargets: [], params, context, name }): {
 *   result: any
 *   name: string
 *   args: {previousTargets: [], params, context, name })
 * }
 */
const { control } = require('../utils');
const feedparser = require('feedparser-promised');

const METHOD_NAME = 'getQueries';
const _log = msg => control(msg, METHOD_NAME);

const getQueries = async (_currentTarget, args) => {
  const { settings } = args.context;
  const items = await feedparser.parse(settings.feed);
  _log(`Rss result: ${items.length} items`);

  return {
    result: items.map(item => item.title),
    name: METHOD_NAME,
    args
  };
};

module.exports = getQueries;
