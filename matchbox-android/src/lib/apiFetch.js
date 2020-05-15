import { kApiBaseUrl } from "../constants/api";
import store from "../store";

function apiFetch(path, body, options = {}) {
  const { token } = store.user;

  return fetch(`${kApiBaseUrl}/${path}`, {
    method: Boolean(body) ? "POST" : "GET",
    headers: {
      Authorization: token,
      "content-type": "application/json"
    },
    body: Boolean(body) ? JSON.stringify(body) : null,
    ...options
  }).then(r => r.json());
}

export default apiFetch;
