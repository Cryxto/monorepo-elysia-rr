// Environment-aware configuration
const getApiBaseUrl = () => {
  // Check if we're in browser
  if (typeof window !== 'undefined') {
    // In production, API is served from same origin
    // In development, use localhost
    if (window.location.hostname === 'localhost') {
      return 'http://localhost:3000'
    }
    return window.location.origin
  }

  // Server-side: use environment variable or default
  return process.env.API_BASE_URL || 'http://localhost:3000'
}

export const config = {
  apiBaseUrl: getApiBaseUrl(),
  authBaseUrl: `${getApiBaseUrl()}/api/auth`,
  apiEndpoint: `${getApiBaseUrl()}/api`,
} as const
