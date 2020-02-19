/* Methods signature (currentTarget, args: {previousTargets: [], params, context, name }): {
 *   result: any
 *   name: string
 *   args: {previousTargets: [], params, context, name })
 * }
 */
const fs = require('fs');
const { control } = require('../utils');

const METHOD_NAME = 'cleanup';
const _log = msg => control(msg, METHOD_NAME);

const cleanup = async (currentTarget, args) => {
  const { selectedFileName, processedFileName, settings } = args.context;
  const { source, output } = settings;

  try {
    _log(`Staging file at ${repositoryPath}/${deployPath}`);
    _log(`Staging ${processedFileName}`);
    const destination = `${deployPath}/${processedFileName}`;
    fs.copyFileSync(currentTarget, `${repositoryPath}/${destination}`);
    git.add(destination);
    git.commit(processedFileName);
    git.push();
    result = true;
  } catch (err) {
    _log(`Staging died. ${err}`);
  }

  return {
    result,
    name: METHOD_NAME,
    args
  };
};

const __fire = async () => {
  const result = await cleanup('./media/output/Thisisatest.mp4.jpg', {
    context: {
      processedFileName: 'Thisisatest.mp4.jpg',
      settings: require('config').get('settings')
    }
  });
};

// __fire();

module.exports = cleanup;
