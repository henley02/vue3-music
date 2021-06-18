import { get } from '@/service'

export const FetchRecommend = () => get('/api/getRecommend')

export const FetchSingerList = () => get('/api/getSingerList')

export const FetchSingerDetail = (params) => get('/api/getSingerDetail', params)

export const FetchSongsUrl = (params) => get('/api/getSongsUrl', params)
