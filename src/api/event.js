import { baseUrl, post } from './http';


const EVENT_ENDPOINT = `${baseUrl}/events`;
const ACCEPT_EVENT_ENDPOINT = `${EVENT_ENDPOINT}/accept`;


export async function acceptEvent(token, id) {
  return post(ACCEPT_EVENT_ENDPOINT, {
    token,
    body: { event_id: id }
  });
}

export async function postEvent(token, event) {
  event.image = false;  // disable image uploading
  return post(EVENT_ENDPOINT, {
    token,
    body: event
  });
}

export async function postEventImage(token, id, formData) {
  const url = `${EVENT_ENDPOINT}/${id}/images`;
  return post(url, {
    token,
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    body: formData
  })
}
