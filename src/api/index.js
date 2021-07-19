import { get } from '@/service';

export const FetchRecommend = () => get('/api/getRecommend');

export const FetchSingerList = () => get('/api/getSingerList');

export const FetchSingerDetail = (params) =>
  get('/api/getSingerDetail', params);

export const FetchSongsUrl = (params) => get('/api/getSongsUrl', params);

export const FetchLyric = (params) => {
  return get('/api/getLyric', params).then((result) => {
    const lyric = result ? result.lyric : '[00:00:00]该歌曲无法获取歌词';
    return lyric;
  });
};

export const FetchAlbum = (params) => get('/api/getAlbum', params);

/**
 * 排行榜列表
 * @param params
 */
export const FetchRankingList = (params) => get('/api/getTopList', params);

/**
 * 排行榜详情
 * @param params
 */
export const FetchRankingDetail = (params) => get('/api/getTopDetail', params);

/**
 * 热门搜索列表
 * @param params
 */
export const FetchHotKeys = (params) => get('/api/getHotKeys', params);

/**
 * 搜索
 * @param params
 */
export const Search = (params) => get('/api/search', params);
