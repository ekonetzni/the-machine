const generateFilledRow = (columns, colorValue) =>
  Array.from({ length: columns }, () => colorValue);

const sortRectanglesByArea = (a, b) =>
  (a.width * a.height) - (b.width * b.height);

const _accumulateReducer = (acc, color) =>
  [
    acc[0] + Math.pow(color[0], 2),
    acc[1] + Math.pow(color[1], 2),
    acc[2] + Math.pow(color[2], 2)
  ];

const _meanAbs = total => val => Math.floor(val / total);

const _sqrt = val => Math.floor(Math.sqrt(val));

const averageFactored = (a, b, f) =>
  [0, 1, 2].map(i => a[i] + f * (b[i] - a[i]));

const averageOf = sample =>
  sample
    .reduce(_accumulateReducer,
      [0, 0, 0]
    )
    .map(_meanAbs(sample.length))
    .map(_sqrt);

module.exports = {
  generateFilledRow,
  sortRectanglesByArea,
  averageOf,
  averageFactored
};
