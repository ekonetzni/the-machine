const generateFilledRow = (columns, colorValue) =>
  Array.from({ length: columns }, () => colorValue);

module.exports = {
  generateFilledRow
};
