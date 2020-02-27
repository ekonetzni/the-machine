const __shiftArray = (arr, amountToShift) =>
  Array.from(
    arr,
    (_value, index) => arr[samplePixelIndex(index, amountToShift, arr.length)]
  );

const _shift = target => {
  const numRows = target.length;

  let row;
  for (row = 0; row < numRows; row++) {
    target[row] = __shiftArray(target[row], getRandomInt(-340, 340));
  }
  return target;
};

const _shimmy = target => {
  const numRows = target.length;
  const shimmyRange = 300;
  const shimmyFactor = 50;

  let row;
  let amountToShimmy = getRandomInt(shimmyRange * -1, shimmyRange);
  for (row = 0; row < numRows; row++) {
    target[row] = __shiftArray(target[row], amountToShimmy);
    amountToShimmy = !!getRandomInt(0, 1)
      ? amountToShimmy + shimmyFactor
      : amountToShimmy - shimmyFactor;
  }
  return target;
};
