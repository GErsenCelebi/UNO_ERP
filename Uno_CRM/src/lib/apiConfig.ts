export const getApiUrl = (): string => {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  if (typeof window !== 'undefined') {
    // Relative API endpoint for Production deployment behind IIS / reverse proxy
    const origin = window.location.origin;
    if (origin.includes('localhost:8000')) {
      return 'http://localhost:8001/api';
    }
    return `${origin}/api`;
  }
  return 'http://localhost:8001/api';
};

export const API_BASE_URL = getApiUrl();
