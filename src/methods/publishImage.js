/* Methods signature (currentTarget, args: {previousTargets: [], params, context, name }): {
 *   result: any
 *   name: string
 *   args: {previousTargets: [], params, context, name })
 * }
 */
const fs = require('fs');
const { control } = require('../utils');
const simpleGit = require('simple-git/promise');

const METHOD_NAME = 'publishImage';
const _log = msg => control(msg, METHOD_NAME);

const publishImage = async (currentTarget, args) => {
  const { processedFileName, settings } = args.context;
  const { repositoryPath, repositoryUrl, deployPath } = settings;
  let result = false;

  if (!fs.existsSync(repositoryPath)) {
    _log('Cloning our repository...');
    simpleGit('.').clone(repositoryUrl, repositoryPath);
    _log('...Done');
  }

  const git = simpleGit(repositoryPath);

  try {
    _log(`Staging file at ${repositoryPath}/${deployPath}`);
    _log(`Staging ${processedFileName}`);
    const destination = `${deployPath}/${processedFileName}`;
    fs.copyFileSync(currentTarget, `${repositoryPath}/${destination}`);
    await git.add(destination);
    await git.commit(processedFileName);
    await git.push();
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
  const result = await publishImage('./media/output/Thisisatest.mp4.jpg', {
    context: {
      processedFileName: 'Thisisatest.mp4.jpg',
      settings: require('config').get('settings')
    }
  });
};

// __fire();

module.exports = publishImage;
