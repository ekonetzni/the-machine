const _luminance = (min, max) => Math.round(((min + max) / 2) * 100);
const _saturation = (min, max, L) => {
  if (max === min) {
    return 0;
  }
  const S =
    L <= 0.5 ? (max - min) / (max + min) : (max - min) / (2.0 - max - min);
  console.log('Sat before round, ', S);
  return Math.round(S * 100);
};
const _hue = (r, g, b, min, max) => {
  let H;
  switch (max) {
    case r:
      H = (g - b) / (max - min);
      break;
    case g:
      H = 2.0 + (b - r) / (max - min);
      break;
    case b:
      H = 4.0 + (r - g) / (max - min);
      break;
  }
  H = H * 60;
  return Math.round(H >= 0 ? H : H + 360);
};

const convertRgbToHsl = color => {
  // Convert r,g, b to 0-1 values. 255 for 8 bit.
  const r = color[0] / 255;
  const g = color[1] / 255;
  const b = color[2] / 255;

  // Find the min and max amongst r,g,b.
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);

  // Luminosity: (min + max) / 2
  const L = _luminance(min, max);
  const S = _saturation(min, max, L);
  const H = _hue(r, g, b, min, max);

  return new Array(H, S, L);
};

module.exports = convertRgbToHsl;
