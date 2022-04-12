export function clampIntoRange(value, max, min) {
  return Math.max(Math.min(value, max), min);
}