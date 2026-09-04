export const getImgUrl = (imgUrl: string, quality: 's' | 'm' | 'l' = 's') => {
  const qualityMap: Record<'s' | 'm' | 'l', number> = {
    s: 100,
    m: 300,
    l: 600,
  }
  return `//wsrv.nl?url=${imgUrl?.split("?")[0]}&w=${qualityMap[quality]}&h=${qualityMap[quality]}&output=webp&il`
}