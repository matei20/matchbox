import { kNodeUrl } from "../constants/api";

function photoSrc(id) {
  return `${kNodeUrl}/${id}.jpg?${Date.now()}`;
}

export default photoSrc;
