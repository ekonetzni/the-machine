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
  let result = false;
  if (currentTarget) {
    const { selectedFileName, processedFileName, settings } = args.context;
    const { source, output } = settings;

    const sourceFile = `${source}/${selectedFileName}`;
    const outputFile = `${output}/${processedFileName}`
    _log(`Cleaning up ${sourceFile}`);
    _log(`Cleaning up ${outputFile}`);
    fs.unlinkSync(sourceFile);
    fs.unlinkSync(outputFile)
    result = true;
  }

  return {
    result: true,
    name: METHOD_NAME,
    args
  };
};

const __fire = async () => {

};

// __fire();

module.exports = cleanup;
