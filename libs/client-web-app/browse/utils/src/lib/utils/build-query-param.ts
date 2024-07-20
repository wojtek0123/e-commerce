export const buildQueryParam = (items: string[], key: string) => {
  return {
    [key]:
      items.map((item) => item.trim().replaceAll(' ', '_')).join(',') || null,
  };
};
