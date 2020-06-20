import gradient from 'gradient-color';

const colors = gradient(['#00e676', '#43a047', '#ffc107', '#f57c00', '#ff5722'], 600);

export default function getCO2Color(value) {
  const v = Math.max(value - 400, 0);

  if (v >= colors.length) return colors[colors.length - 1];

  return colors[v];
}
