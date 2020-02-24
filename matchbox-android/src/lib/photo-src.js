import { kApiBaseUrl } from "../constants/api";

function photoSrc(id) {

    return `${kApiBaseUrl}/download-image/${id}.jpg?${Date.now()}`;
}

export default photoSrc;
