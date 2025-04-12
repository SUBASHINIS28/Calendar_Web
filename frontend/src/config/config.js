const config = {
  API_URL: process.env.NODE_ENV === 'production'
    ? process.env.REACT_APP_API_URL || 'https://calendar-backend-subashini-ss-projects.vercel.app/api'
    : 'http://localhost:5000/api'
};

console.log('API URL:', config.API_URL);

export default config;