export function galleryOffset(itemLeft: number, itemWidth: number, viewportWidth: number, contentWidth: number) {
  const centered = itemLeft - (viewportWidth - itemWidth) / 2;
  return Math.min(Math.max(0, centered), Math.max(0, contentWidth - viewportWidth));
}
