// =============================================================================
// config.js
// Configuración global de la app. Centraliza la URL de la API
// para que si cambia solo haya que modificarla aquí.
// =============================================================================

export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ||
  "https://ppxd3sn5oj.execute-api.eu-west-1.amazonaws.com/dev";

export const POLLING_INTERVAL_MS = 1000; // 1 segundos recomendable 20000 pero es para probarlo
export const POLLING_MAX_ATTEMPTS = 300;  // 120 intentos x 5s = 10 minutos
