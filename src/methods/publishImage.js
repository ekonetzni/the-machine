/* Methods signature (currentTarget, args: {previousTargets: [], params, context, name }): {
 *   result: any
 *   name: string
 *   args: {previousTargets: [], params, context, name })
 * }
 */
const fs = require('fs');
const { control } = require('../utils');
const simpleGit = require('simple-git');

const METHOD_NAME = 'publishImage';
const _log = msg => control(msg, METHOD_NAME);

const publishImage = async (currentTarget, args) => {
  const { processedFileName, settings } = args.context;
  const { repositoryPath, repositoryUrl, deployPath } = settings;
  const git = simpleGit(repositoryPath);

  if (!fs.existsSync(repositoryPath)) {
    _log('Cloning our repository...');
    git.clone(repositoryUrl, repositoryPath);
    _log('...Done');
  }

  try {
    _log(`Staging file at ${repositoryPath}/${deployPath}`);
    const destination = `${deployPath}/${processedFileName}`;
    fs.copyFileSync(currentTarget, `${repositoryPath}/${destination}`);
    git.add(destination);
    git.commit(processedFileName);
    git.push();
  } catch (err) {
    _log(`Staging died. ${err}`);
  }

  return {
    result: true,
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
__fire();

module.exports = publishImage;
