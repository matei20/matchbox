import { kApiBaseUrl } from "../constants/api";
import store from "../store";

function apiFetch(path, body) {
  const { token } = store.user;

  return fetch(`${kApiBaseUrl}/${path}`, {
    method: Boolean(body) ? "POST" : "GET",
    headers: {
      Authorization: token,
      "content-type": "application/json"
    },
    body: Boolean(body) ? JSON.stringify(body) : null
  }).then(r => r.json());
}

export default apiFetch;
