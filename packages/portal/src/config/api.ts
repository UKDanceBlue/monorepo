export const API_BASE_URL =
  import.meta.env.MODE === "development"
    ? "https://localhost:8000"
    : new URL(window.location.href).origin;
