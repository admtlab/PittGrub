import { baseUrl, get } from './http';


const DATA_ENDPOINT = `${baseUrl}/data`;
const HOST_SLIDES_ENDPOINT = `${DATA_ENDPOINT}/host-training-slides`;


export async function hostTrainingSlides() {
  return get(HOST_SLIDES_ENDPOINT);
}
