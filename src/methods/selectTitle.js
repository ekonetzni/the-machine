/* Methods signature (currentTarget, args: {previousTargets: [], params, context, name }): {
 *   result: any
 *   name: string
 *   args: {previousTargets: [], params, context, name })
 * }
 */
const { control, getRandomInt, readTitles } = require('../utils');
const settings = require('config').get('settings');

const METHOD_NAME = 'selectTitle';
const _log = msg => control(msg, METHOD_NAME);
const _promisify = value => new Promise(() => value);

const existingTitles = readTitles(`${settings.repositoryPath}/${settings.deployPath}`);

const _isTitleUnique = title => !existingTitles.includes(title);
const _getUniqueTitle = (titles) => {
  let index = 0;
  let title = titles[index];

  while (!_isTitleUnique(title) && typeof title !== 'undefined') {
    index += 1;
    title = titles[index];
  }
  return title;
}

const selectTitle = async (currentTarget, args) => {
  const title = _getUniqueTitle(currentTarget);
  return {
    result: title,
    name: METHOD_NAME,
    args: {
      ...args,
      context: {
        ...args.context,
        selectedTitle: title
      }
    }
  };
};

module.exports = selectTitle;
