

import axios from 'axios'

console.log('VITE_API_BASE_URL:', import.meta.env.VITE_API_BASE_URL)

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
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