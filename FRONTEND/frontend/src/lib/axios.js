import axios from 'axios'

export const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000',
  withCredentials: true
})

// Attach Authorization header with access_token from localStorage (if present)
axiosInstance.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers = config.headers || {}
      config.headers.Authorization = `Bearer ${token}`
    }
  } catch {
    // ignore (e.g., SSR or storage not available)
  }
  return config
}, (error) => Promise.reject(error))