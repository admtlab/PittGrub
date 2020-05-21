import { baseUrl, get, post, del } from './http';


const EVENT_ENDPOINT = `${baseUrl}/events`;
const ACCEPT_EVENT_ENDPOINT = `${EVENT_ENDPOINT}/accept`;


export async function getEvents(token) {
  return get(EVENT_ENDPOINT, { token })
    .then(response => response._embedded.eventViews);
}

export async function acceptEvent(token, id) {
  return post(ACCEPT_EVENT_ENDPOINT, {
    token,
    body: { event_id: id },
  });
}

export async function unacceptEvent(token, id) {
  return del(ACCEPT_EVENT_ENDPOINT, {
    token,
    body: { event_id: id },
  });
}

export async function postEvent(token, event) {
  // disable image uploading
  event.image = false;
  return post(EVENT_ENDPOINT, {
    token,
    body: event,
  });
}

export async function postEventImage(token, id, formData) {
  const url = `${EVENT_ENDPOINT}/${id}/images`;
  return post(url, {
    token,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    body: formData,
  });
}

export async function parseEvents(events = []) {
  return events.map(parseEvent);
}

export function parseEvent(event) {
  event.start_date = new Date(event.start_date);
  event.end_date = new Date(event.end_date);
  event.description = event.details;
  return event;
}
