const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";

export function getApiBaseUrl() {
  return apiBaseUrl;
}

export function getSockJsUrl() {
  return `${apiBaseUrl}/ws`;
}
