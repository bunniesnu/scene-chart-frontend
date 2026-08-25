export const getImgUrl = (imgUrl: string) => {
  return `//wsrv.nl?url=${imgUrl?.split("?")[0]}&w=100&h=100&output=webp&il`
}