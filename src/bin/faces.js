require('dotenv').config();
const execute = require('../machine');
const { control, exit } = require('../utils');

const getQueries = require('../methods/getQueries');
const selectTitle = require('../methods/selectTitle');
const selectVideoId = require('../methods/selectVideoId');
const getVideo = require('../methods/getVideo');
const findFaceRectangles = require('../methods/findFaceRectangles');
const getFrame = require('../methods/getFrame');
const getArrayData = require('../methods/getArrayData');
const paintFaces = require('../methods/paintFaces');
const writeImage = require('../methods/writeImage');
const publishImage = require('../methods/publishImage');
const cleanup = require('../methods/cleanup');

const methods = [
  getQueries,
  selectTitle,
  selectVideoId,
  getVideo,
  findFaceRectangles,
  getArrayData,
  paintFaces(require('../modifiers/midlineWithBoundingRectangle')),
  paintFaces(require('../modifiers/blendEdges')),
  writeImage,
  publishImage,
];

const finallyTasks = [cleanup, exit];

const constructVideo = execute(methods, finallyTasks);

try {
  constructVideo({});
} catch (err) {
  control(err, 'CRASH');
  process.exit(1);
}
