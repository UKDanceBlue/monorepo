async function checkApiUrl(url: URL): Promise<boolean> {
  url = new URL(url.href);
  url.pathname = "/api/healthcheck";

  try {
    const response = await fetch(url);
    if (!response.ok) {
      return false;
    }
    const body = await response.text();
    return body === "OK";
  } catch (error) {
    return false;
  }
}

async function discoverApiBaseUrl() {
  const originUrl = new URL(window.location.origin);
  originUrl.port = "8000";

  const urls = [
    // Covers app.danceblue.org and dev.danceblue.org when served on same origin
    new URL(window.location.origin),
    // Covers local development
    new URL("http://localhost:8000"),
    // Covers weird local development
    originUrl,
    // Backup
    new URL("https://app.danceblue.org"),
  ];
  for (const url of urls) {
    // eslint-disable-next-line no-await-in-loop
    if (await checkApiUrl(url)) {
      return url;
    }
  }

  // Even more backup
  alert("Unable to connect to API server, defaulting to primary server");
  return new URL("https://app.danceblue.org");
}

export const API_BASE_URL = import.meta.env.VITE_APP_API_BASE_URL
  ? new URL(import.meta.env.VITE_APP_API_BASE_URL)
  : await discoverApiBaseUrl();
