import store from "../store";

import { kNodeUrl } from "../constants/api";

function deleteImage() {
  const { token } = store.user;

  return fetch(kNodeUrl, {
    method: "DELETE",
    headers: {
      Authorization: token
    }
  });
}

export default deleteImage;
