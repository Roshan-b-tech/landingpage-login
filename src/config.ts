// Configuration file for environment variables

// API base URL - falls back to local development if env var is not set
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// For development testing with localStorage only
export const USE_LOCAL_STORAGE_ONLY = true; 