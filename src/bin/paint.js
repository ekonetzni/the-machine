require('dotenv').config();
const execute = require('../machine');
const { exit } = require('../utils');

const getQueries = require('../methods/getQueries');
const selectTitle = require('../methods/selectTitle');
const selectVideoId = require('../methods/selectVideoId');
const getVideo = require('../methods/getVideo');
const getFrame = require('../methods/getFrame');
const getArrayData = require('../methods/getArrayData');
const makePainting = require('../methods/makePainting');
const writeImage = require('../methods/writeImage');
const publishImage = require('../methods/publishImage');
const cleanup = require('../methods/cleanup');

const constructVideo = execute([
  getQueries,
  selectTitle,
  selectVideoId,
  getVideo,
  getFrame,
  getArrayData,
  makePainting,
  writeImage,
  publishImage,
  cleanup,
  exit
]);

constructVideo({});
