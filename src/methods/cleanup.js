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
  const { source, output } = args.context.settings;

  const _rm = (dir, file) => fs.unlinkSync(`${dir}/${file}`);

  _log(`Cleaning up ${source}`);
  _log(`Cleaning up ${output}`);
  fs.readdirSync(source).forEach(file => _rm(source, file));
  fs.readdirSync(output).forEach(file => _rm(output, file));

  return {
    result: true,
    name: METHOD_NAME,
    args,
  };
};

const __fire = async () => {};

// __fire();

module.exports = cleanup;
