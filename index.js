const util = require('util');
/*
 * Methods signature (currentTarget, args: {previousTargets: [], params, context, name })
 */

/*
 * - Retrieve feeds from RSS (feedparser) - Title
 * - Dedupe against titles we've used - Title
 * - Search and download video content based on title - FileName
 * - Process video down to image - Image
 * - Clean up
 */

const _dump = obj => util.inspect(obj, { showHidden: false, depth: null });
const _control = msg => console.log(`[Control] ${msg}`);
// const getTitle = (
//   currentTarget,
//   // { previousTargets: [], params, context, name }
//   args
// ) => {
//   const title = 'Donnie Trumpet';
//   const result = { name: 'getTitle', result: title, args };
//   console.log(`Returning from getTitle with ${_dump(result)} `);
//   console.log('FUCKKKJAS', result);
//   return result;
// };

const getTitle = (
  currentTarget,
  // { previousTargets: [], params, context, name }
  args
) => ({
  name: 'getTitle',
  result: 'donnie trumpet',
  args
});

const downloadMaterial = (
  currentTarget,
  // { previousTargets: [], params, context, name }
  args
) => {
  const video = { bunchOfData: ';ljasdlpkasjdasj' };
  return { name: 'downloadMaterial', result: video, args };
};

const executor = (previousResult, currentMethod, index) => {
  _control(`previousResult is ${_dump(previousResult)} at index ${index}`);
  _control(`About to execute ${currentMethod.toString()}`);
  const { result, args } = previousResult;
  return currentMethod(result, {
    previousTargets: [...args.previousTargets, result],
    params: args.params,
    context: args.context
  });
};

const execute = methods => (initialTarget = {}) => {
  const initialValue = {
    result: initialTarget,
    name: 'initial',
    args: {
      previousTargets: [],
      params: {},
      context: {}
    }
  };
  const result = methods.reduce(executor, initialValue);
  _control(`Result ${_dump(result)}`);
};

const constructVideo = execute([getTitle, downloadMaterial]);
constructVideo({});
