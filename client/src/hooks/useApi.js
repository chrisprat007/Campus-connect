import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL

const api = axios.create({
  baseURL: `${API_URL}/api`
})

// Attach JWT to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('placeiq_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Global response error handler
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('placeiq_token')
      localStorage.removeItem('placeiq_role')
      localStorage.removeItem('placeiq_user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default api