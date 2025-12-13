import axios from 'axios';

const axiosWithConfig = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5000',
  withCredentials: true,
});

export default axiosWithConfig;
