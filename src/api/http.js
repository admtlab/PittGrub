import settings from '../config/settings';


export const baseUrl = settings.server;

export async function healthRequest() {
  return get(`${setting.server}/health`);
}

export async function get(endpoint, request) {
  const req = _request({...request, method: 'GET'});
  console.log(`Request ::: ${JSON.stringify(req)} >>> ${endpoint}`);
  return fetch(endpoint, req).then(_parse).then(_log).catch(_error);
}

export async function post(endpoint, request) {
  const req = _request({...request, method: 'POST'});
  console.log(`Request ::: ${JSON.stringify(req)} >>> ${endpoint}`);
  return fetch(endpoint, req).then(_parse).then(_log).catch(_error);
}

export async function del(endpoint, request) {
  const req = _request({...request, method: 'DELETE'});
  console.log(`Request ::: ${JSON.stringify(req)} >>> ${endpoint}`);
  return fetch(endpoint, req).then(_parse).then(_log).catch(_error);
}

function _request(request) {
  return {
    method: request.method || 'GET',
    headers: _headers(request),
    body: request.body ? JSON.stringify(request.body) : ''
  };
}

function _headers(request = {}) {
  return {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    ...request.headers,
    'Authorization': request.token ? `Bearer ${request.token}` : ''
  };
}

function _parse(response) {
  if (!response.ok) { throw response; }
  return response.status === 204 ? response : response.json();
}

function _log(response) {
  console.log(`Response ::: ${JSON.stringify(response)}`);
  return response;
}

function _error(err) {
  console.log(`Error response ::: ${JSON.stringify(err)}`);
  throw err;
}
