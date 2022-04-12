export function toNumber(attribute) {
  return attribute ? Number(attribute.replace("px", "")) : 0;
}