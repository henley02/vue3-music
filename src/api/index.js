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
