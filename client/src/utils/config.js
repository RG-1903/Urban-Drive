export const API_URL = import.meta.env.MODE === 'production'
    ? '/api/v1'
    : 'http://localhost:8080/api/v1';
