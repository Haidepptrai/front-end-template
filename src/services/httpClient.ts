import axios from 'axios';

const httpClient = axios.create({
  // Use a relative base so requests stay on the same origin (Next.js proxy).
  // next.config.ts rewrites /api/* → NEXT_PUBLIC_API_BASE_URL/api/*
  baseURL: '/',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

export default httpClient;
