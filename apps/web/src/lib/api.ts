import axios from 'axios'

function getDeviceHeaders() {
  const ua = navigator.userAgent
  let browser = 'Unknown'
  let os = 'Unknown'
  let type = 'desktop'

  if (ua.includes('Firefox')) browser = 'Firefox'
  else if (ua.includes('Edg')) browser = 'Edge'
  else if (ua.includes('Chrome')) browser = 'Chrome'
  else if (ua.includes('Safari')) browser = 'Safari'

  if (ua.includes('Windows')) os = 'Windows'
  else if (ua.includes('Mac')) os = 'macOS'
  else if (ua.includes('Linux')) os = 'Linux'
  else if (ua.includes('Android')) { os = 'Android'; type = 'mobile' }
  else if (ua.includes('iPhone') || ua.includes('iPad')) { os = 'iOS'; type = 'mobile' }

  return {
    'x-browser': browser,
    'x-operatingsystem': os,
    'x-type': type,
    'x-ipaddress': '0.0.0.0',
  }
}

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  const url = config.url ?? ''
  if (url.includes('/auth/') || url.includes('/login')) {
    const deviceHeaders = getDeviceHeaders()
    Object.assign(config.headers, deviceHeaders)
  }

  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      const refreshToken = localStorage.getItem('refreshToken')

      if (refreshToken) {
        try {
          const { data } = await axios.post('/api/auth/refresh', { refreshToken })
          localStorage.setItem('accessToken', data.accessToken)
          localStorage.setItem('refreshToken', data.refreshToken)
          originalRequest.headers.Authorization = `Bearer ${data.accessToken}`
          return api(originalRequest)
        } catch {
          localStorage.removeItem('accessToken')
          localStorage.removeItem('refreshToken')
          localStorage.removeItem('user')
          window.location.href = '/login'
        }
      } else {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('user')
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  },
)

export { api }
