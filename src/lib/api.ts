const BASE = "http://localhost:5000/api";

type Json = any;

let token: string | null = typeof window !== "undefined" ? localStorage.getItem("km_token") : null;

export const setToken = (t: string | null) => {
  token = t;
  if (typeof window !== "undefined") {
    if (t) localStorage.setItem("km_token", t);
    else localStorage.removeItem("km_token");
  }
};

async function request(method: string, path: string, body?: unknown) {
  const headers: Record<string, string> = { "Content-Type": "application/json" };

  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const txt = await res.text();
  let json: Json | null = null;
  try {
    json = txt ? JSON.parse(txt) : null;
  } catch (e) {
    // ignore
  }

  if (!res.ok) {
    const message = json?.message ?? res.statusText ?? "Request failed";
    const err: any = new Error(message);
    err.status = res.status;
    err.body = json;
    throw err;
  }

  return json;
}

async function requestForm(path: string, body: FormData) {
  const headers: Record<string, string> = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers,
    body,
  });

  const txt = await res.text();
  let json: Json | null = null;
  try {
    json = txt ? JSON.parse(txt) : null;
  } catch (e) {
    // ignore
  }

  if (!res.ok) {
    const message = json?.message ?? res.statusText ?? "Request failed";
    const err: any = new Error(message);
    err.status = res.status;
    err.body = json;
    throw err;
  }

  return json;
}

export const api = {
  setToken,
  post: (path: string, body?: unknown) => request("POST", path, body),
  get: (path: string) => request("GET", path),
  postForm: (path: string, body: FormData) => requestForm(path, body),
};

export default api;
