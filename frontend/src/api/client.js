const CLIENT_ID_KEY = "trustshield_client_id";

function getClientId() {
  let clientId = localStorage.getItem(CLIENT_ID_KEY);

  if (!clientId) {
    clientId = crypto.randomUUID();
    localStorage.setItem(CLIENT_ID_KEY, clientId);
  }

  return clientId;
}

const BASE = `${import.meta.env.VITE_API_BASE_URL || ""}/api`;

async function handle(res) {
  if (!res.ok) {
    let detail = "Request failed";

    try {
      const body = await res.json();
      detail = body.detail || detail;
    } catch (_) {}

    const err = new Error(detail);
    err.status = res.status;
    throw err;
  }

  return res.json();
}

function clientHeaders() {
  return {
    "X-Client-ID": getClientId(),
  };
}

export const api = {
  scanMessage: (text) =>
    fetch(`${BASE}/scan/message`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...clientHeaders(),
      },
      body: JSON.stringify({ text }),
    }).then(handle),

  scanUrl: (url) =>
    fetch(`${BASE}/scan/url`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...clientHeaders(),
      },
      body: JSON.stringify({ url }),
    }).then(handle),

  scanEmail: (sender, subject, body) =>
    fetch(`${BASE}/scan/email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...clientHeaders(),
      },
      body: JSON.stringify({
        sender,
        subject,
        body,
      }),
    }).then(handle),

  scanQr: (file) => {
    const form = new FormData();
    form.append("file", file);

    return fetch(`${BASE}/scan/qr`, {
      method: "POST",
      headers: {
        ...clientHeaders(),
      },
      body: form,
    }).then(handle);
  },

  askCopilot: (question) =>
    fetch(`${BASE}/copilot`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...clientHeaders(),
      },
      body: JSON.stringify({ question }),
    }).then(handle),

  listScenarios: () =>
    fetch(`${BASE}/demo/scenarios`, {
      headers: {
        ...clientHeaders(),
      },
    }).then(handle),

  runScenario: (id) =>
    fetch(`${BASE}/demo/run/${id}`, {
      method: "POST",
      headers: {
        ...clientHeaders(),
      },
    }).then(handle),

  dashboardStats: () =>
    fetch(`${BASE}/dashboard/stats`, {
      headers: {
        ...clientHeaders(),
      },
    }).then(handle),

  history: (limit = 50) =>
    fetch(`${BASE}/history?limit=${limit}`, {
      headers: {
        ...clientHeaders(),
      },
    }).then(handle),

  clearHistory: () =>
    fetch(`${BASE}/history`, {
      method: "DELETE",
      headers: {
        ...clientHeaders(),
      },
    }).then(handle),
};