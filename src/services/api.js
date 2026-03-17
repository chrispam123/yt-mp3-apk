// =============================================================================
// api.js
// Responsabilidad: toda la comunicación HTTP con el backend.
// La app solo importa estas funciones, nunca hace fetch directamente.
// =============================================================================

import axios from "axios";
import { API_BASE_URL, POLLING_INTERVAL_MS, POLLING_MAX_ATTEMPTS } from "../constants/config";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// -----------------------------------------------------------------------------
// Inicia una descarga enviando la URL de YouTube al backend
// Devuelve el task_id para hacer polling
// -----------------------------------------------------------------------------
export const startDownload = async (url) => {
  const response = await apiClient.post("/download", { url });
  return response.data;
};

// -----------------------------------------------------------------------------
// Consulta el estado de una tarea por su task_id
// Devuelve { status, url?, message }
// -----------------------------------------------------------------------------
export const getTaskStatus = async (taskId) => {
  const response = await apiClient.get(`/status/${taskId}`);
  return response.data;
};

// -----------------------------------------------------------------------------
// Polling: consulta el estado cada 5 segundos hasta completar o error
// Devuelve la pre-signed URL cuando status=completed
// -----------------------------------------------------------------------------
export const pollTaskStatus = (taskId, onUpdate) => {
  let attempts = 0;

  const interval = setInterval(async () => {
    attempts++;

    try {
      const data = await getTaskStatus(taskId);
      onUpdate(data);

      if (data.status === "completed" || data.status === "error") {
        clearInterval(interval);
      }

      if (attempts >= POLLING_MAX_ATTEMPTS) {
        clearInterval(interval);
        onUpdate({ status: "error", message: "Tiempo de espera agotado" });
      }
    } catch (_error) {
      clearInterval(interval);
      onUpdate({ status: "error", message: "Error de conexión con el servidor" });
    }
  }, POLLING_INTERVAL_MS);

  return interval;
};
