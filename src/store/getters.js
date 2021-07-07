const getters = {
  currentAlbum: (state) => state.album.currentAlbum,
  currentSinger: (state) => state.singer.currentSinger,
  currentSong: (state) => state.song.playList[state.song.currentIndex] || {},
};

export default getters;
