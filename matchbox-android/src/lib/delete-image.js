import store from "../store";

import { kApiBaseUrl } from "../constants/api";

function deleteImage() {
  const { token } = store.user;

  return fetch(`${kApiBaseUrl}/delete-image`, {
    method: "DELETE",
    headers: {
      Authorization: token
      
    }
  });
}

export default deleteImage;
