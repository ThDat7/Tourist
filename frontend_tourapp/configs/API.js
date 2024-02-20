import axios from 'axios'

export const endpoints = {
  search: (query) => `/search/?q=${query}`,
  'search-tour': (id) => `/search-tour/${id}`,
  'tourist-place': (id) => `/search-tourist-place/${id}`,
  'tour-detail': (id) => `/tour/${id}`,
  ratings: (tourId) => `/tour/${tourId}/ratings`,
  'tour-pricing': (tourId) => `/tour/${tourId}/pricing`,
}

export default axios.create({
  baseURL: 'http://127.0.0.1:8000',
  headers: {
    'content-type': 'application/json',
  },
  timeout: 5000,
})
