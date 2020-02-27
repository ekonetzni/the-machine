require('dotenv').config();
const { dump, control, exit } = require('./utils');
const machine = require('../machine');
const fs = require('fs');

const getArrayData = require('./methods/getArrayData');
const makePainting = require('./methods/makePainting');
const writeImage = require('./methods/writeImage');

const parseFiles = args => {
  args.slice(2)
}
const sequence = [
  getArrayData,
  makePainting,
  writeImage,
  exit
];

const resize = machine(sequence);
_filesFromArgs(process.argv).forEach(image => resize({}));
