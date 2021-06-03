import { get } from '@/service'

export const FetchRecommend = () => get('/api/getRecommend')

export const FetchSingerList = () => get('/api/getSingerList')
