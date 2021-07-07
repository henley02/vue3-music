import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'Index',
    component: () => import('../views/Index/Index.vue'),
    redirect: 'recommend',
    children: [
      {
        path: 'recommend',
        name: 'Recommend',
        meta: { title: '推荐' },
        component: () =>
          import('../views/Index/children/Recommend/Recommend.vue'),
      },
      {
        path: 'singer',
        name: 'Singer',
        meta: { title: '歌手' },
        component: () => import('../views/Index/children/Singer/Singer.vue'),
      },
      {
        path: 'ranking',
        name: 'Ranking',
        meta: { title: '排行' },
        component: () => import('../views/Index/children/Ranking/Ranking.vue'),
      },
      {
        path: 'search',
        name: 'Search',
        meta: { title: '搜索' },
        component: () => import('../views/Index/children/Search/Search.vue'),
      },
    ],
  },
  {
    path: '/singerDetail/:mid',
    name: 'SingerDetail',
    meta: {
      title: '歌手详情',
    },
    component: () => import('../views/SingerDetail/SingerDetail.vue'),
  },
  {
    path: '/albumDetail/:id',
    name: 'AlbumDetail',
    meta: {
      title: '歌单详情',
    },
    component: () => import('../views/AlbumDetail/AlbumDetail.vue'),
  },
  {
    path: '/user',
    name: 'User',
    component: () => import('../views/User/User.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
