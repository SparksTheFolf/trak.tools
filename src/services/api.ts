import axios from 'axios'

export const mbtaApi = axios.create({
  baseURL: import.meta.env.VITE_MBTA_API_BASE_URL || 'https://api-v3.mbta.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    ...(import.meta.env.VITE_MBTA_API_KEY && {
      'X-API-Key': import.meta.env.VITE_MBTA_API_KEY
    })
  }
})

// Request interceptor for logging
mbtaApi.interceptors.request.use(
  (config) => {
    if (import.meta.env.VITE_APP_ENV === 'DEV') {
      console.log(`Making API request to: ${config.baseURL}${config.url}`)
      if (config.headers['X-API-Key']) {
        console.log('Using API key for authenticated request')
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
mbtaApi.interceptors.response.use(
  (response) => {
    if (import.meta.env.VITE_APP_ENV === 'DEV') {
      console.log(`API response received from: ${response.config.url}`)
    }
    return response
  },
  (error) => {
    if (import.meta.env.VITE_APP_ENV === 'DEV') {
      console.error('API Error:', error.message)
    }
    
    if (error.code === 'ECONNABORTED') {
      error.message = 'Request timeout - MBTA API is taking too long to respond'
    } else if (error.response?.status === 429) {
      error.message = 'Rate limit exceeded - please wait before making more requests'
    } else if (error.response?.status === 401) {
      error.message = 'Invalid API key - please check your MBTA API key configuration'
    } else if (error.response?.status === 403) {
      error.message = 'Access forbidden - your API key may not have sufficient permissions'
    } else if (error.response?.status >= 500) {
      error.message = 'MBTA API server error - please try again later'
    } else if (!error.response) {
      error.message = 'Network error - please check your internet connection'
    }
    
    return Promise.reject(error)
  }
)

export default mbtaApi
