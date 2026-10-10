export const flatSlides = serviceItems.flatMap((item) =>
  item.slides.map((slide) => ({ ...slide, itemId: item.id, itemTitle: item.title })),
);

export const serviceItemById = new Map(serviceItems.map((item) => [item.id, item]));
export const flatSlideById = new Map(flatSlides.map((slide) => [slide.id, slide]));
