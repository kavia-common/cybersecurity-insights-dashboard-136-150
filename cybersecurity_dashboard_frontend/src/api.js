//
// PUBLIC_INTERFACE
// Central API utility to connect React frontend with FastAPI backend for authentication, analytics, threats, notifications, widgets, settings, and search.
//

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:3001";

let accessToken = null;

/**
 * Sets the current access token for API requests.
 * @param {string} token - JWT access token
 */
export function setAccessToken(token) {
  accessToken = token;
}

/**
 * PUBLIC_INTERFACE
 * Authenticated fetch wrapper.
 */
export async function apiFetch(path, { method = "GET", body = null, form = false } = {}) {
  const headers = {};
  if (accessToken) headers["Authorization"] = `Bearer ${accessToken}`;
  if (!form && body) headers["Content-Type"] = "application/json";
  const opts = {
    method,
    headers,
    ...(body && { body: form ? body : JSON.stringify(body) }),
    credentials: "include" // To handle cookies if backend uses them
  };
  const resp = await fetch(`${API_BASE}${path}`, opts);
  if (!resp.ok) {
    let err;
    try {
      err = await resp.json();
    } catch {
      err = { message: "Unknown error" };
    }
    throw err;
  }
  return resp.status === 204 ? null : await resp.json();
}

// PUBLIC_INTERFACE
export async function login(username, password) {
  // FastAPI expects x-www-form-urlencoded for /auth/token
  const data = new URLSearchParams();
  data.append("username", username);
  data.append("password", password);

  const resp = await apiFetch("/auth/token", {
    method: "POST",
    body: data,
    form: true
  });
  setAccessToken(resp.access_token);
  return resp;
}

// PUBLIC_INTERFACE
export async function register(email, password) {
  const resp = await apiFetch("/auth/register", {
    method: "POST",
    body: { email, password }
  });
  return resp;
}

// PUBLIC_INTERFACE
export async function getCurrentUser() {
  return apiFetch("/auth/me");
}

// PUBLIC_INTERFACE
export async function fetchAnalytics(query) {
  return apiFetch("/analytics/query", {
    method: "POST",
    body: query
  });
}

// PUBLIC_INTERFACE
export async function fetchThreats(query) {
  return apiFetch("/threats/query", {
    method: "POST",
    body: query
  });
}

// PUBLIC_INTERFACE
export async function fetchNotifications() {
  return apiFetch("/notifications");
}

// PUBLIC_INTERFACE
export async function markNotificationsRead(ids) {
  return apiFetch("/notifications/mark_read", {
    method: "POST",
    body: ids
  });
}

// PUBLIC_INTERFACE
export async function fetchWidgetData(widgetType, params = {}) {
  return apiFetch("/widgets/data", {
    method: "POST",
    body: { widget_type: widgetType, params }
  });
}

// PUBLIC_INTERFACE
export async function fetchSettings() {
  return apiFetch("/settings");
}

// PUBLIC_INTERFACE
export async function updateSettings(settings) {
  return apiFetch("/settings", {
    method: "POST",
    body: settings
  });
}

// PUBLIC_INTERFACE
export async function search(queryObj) {
  return apiFetch("/search", {
    method: "POST",
    body: queryObj
  });
}

/**
 * WebSocket notifications connector.
 * @param {(notification: object) => void} onMessage
 * @returns {WebSocket}
 */
export function connectNotificationsWS(onMessage) {
  // Use ws or wss depending on backend
  const proto = API_BASE.startsWith("https") ? "wss" : "ws";
  const url = `${proto}://${API_BASE.replace(/^https?:\/\//, "")}/ws/notifications`;
  const ws = new window.WebSocket(url);
  ws.onmessage = (ev) => {
    try {
      onMessage(JSON.parse(ev.data));
    } catch {
      // Ignore invalid notification format
    }
  };
  return ws;
}
