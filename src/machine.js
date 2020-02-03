const { dump, control } = require('./utils');
/*
 * Machine methods
 * Methods signature (currentTarget, args: {previousTargets: [], params, context, name }): {
   result: any
   name: string
   args: {previousTargets: [], params, context, name })
 }
 */

/*
 * - Retrieve feeds from RSS (feedparser) - Title
 * - Dedupe against titles we've used - Title
 * - Search and download video content based on title - FileName
 * - Process video down to image - Image
 * - Clean up
 */

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
  control(`previousResult is ${dump(previousResult)} at index ${index}`);
  control(`About to execute ${currentMethod.toString()}`);
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
  control(`Result ${dump(result)}`);
};

const constructVideo = execute([getTitle, downloadMaterial]);
constructVideo({});
