import { ImagePicker } from "expo";
import store from "../store";

import { kApiBaseUrl } from "../constants/api";

async function uploadImage() {
  let result = await ImagePicker.launchImageLibraryAsync({
    allowsEditing: true
  });

  if (result.cancelled) {
    return;
  }

  // ImagePicker saves the taken photo to disk and returns a local URI to it
  let localUri = result.uri;
  let filename = localUri.split("/").pop();

  // Infer the type of the image
  let match = /\.(\w+)$/.exec(filename);
  let type = match ? `image/${match[1]}` : `image`;

  // Upload the image using the fetch and FormData APIs
  let formData = new FormData();
  // Assume "photo" is the name of the form field the server expects
  formData.append("photo", { uri: localUri, name: filename, type });
//below was kNodeUrl
  return await fetch(`${kApiBaseUrl}/upload-image`, {
    method: "POST",
    body: formData,
    headers: {
      Authorization: store.user.token,
      "content-type": "multipart/form-data"
    }
  });
}

export default uploadImage;
