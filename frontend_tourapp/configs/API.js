import axios from 'axios'

export const endpoints = {
  search: (query) => `/search/?q=${query}`,
  'search-tour': (id) => `/search-tour/${id}`,
  'search-tourist-place': (id) => `/search-tourist-place/${id}`,
  'tour-detail': (id) => `/tour/${id}`,
  ratings: (tourId) => `/tour/${tourId}/ratings`,
  'tour-pricing': (tourId) => `/tour/${tourId}/pricing`,
  'customer-info': '/customers/',
  'tours-history': '/customers/tours-history/',
  'order-booking': '/order-booking/',
  news: '/news/',
  'news-detail': (id) => `/news/${id}`,
  'like-new': (id) => `/news/${id}/like`,
  'cmt-new': (id) => `/news/${id}/comments`,
  login: '/login/',
  logout: '/logout/',
  'verify-token': '/token/verify/',
  'refresh-token': '/token/refresh/',
}

export default axios.create({
  baseURL: 'http://127.0.0.1:8000',
  headers: {
    'content-type': 'application/json',
  },
  timeout: 5000,
  withCredentials: false,
})
