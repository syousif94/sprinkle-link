const url = "https://sprinkle.ideakeg.xyz/api/v";

export default function api(endpoint, payload, v = 1) {
  return fetch(`${url}${v}/${endpoint}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  })
    .then(res => {
      if (!res.ok) {
        return Promise.reject("Request failed..");
      }
      return res.json();
    })
    .then(json => {
      if (json.error) {
        return Promise.reject(json.error);
      }
      return json;
    });
}
