require('dotenv').config();
const execute = require('../machine');
const { control, exit } = require('../utils');

const getArrayData = require('../methods/getArrayData');
const writeImage = require('../methods/writeImage');
const publishImage = require('../methods/publishImage');
const cleanup = require('../methods/cleanup');
const createColorChart = require('../methods/createColorChart');

const methods = [getArrayData, createColorChart];

const finallyTasks = [cleanup, exit];

const constructVideo = execute(methods, finallyTasks);

try {
  constructVideo({});
} catch (err) {
  control(err, 'CRASH');
  process.exit(1);
}
