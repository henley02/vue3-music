import { FetchSongsUrl } from '@/api/index';

export function processSongs(songs) {
  if (!songs.length) {
    return Promise.resolve(songs);
  }
  let mid = [];
  if (songs.length) {
    mid = songs.map((item) => item.mid);

    return FetchSongsUrl({ mid: mid }).then(({ map }) => {
      songs.forEach((item) => {
        item.url = map[item.mid];
      });
      return songs.filter((item) => item.url && item.url.indexOf('vkey') > -1);
    });
  }
}
