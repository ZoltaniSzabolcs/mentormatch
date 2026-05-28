export async function onRequest(context: { request: Request }) {
  const { request } = context;
  const url = new URL(request.url);

  // Your Render URL
  const BACKEND_URL = "https://mentormatch-backend-l5ul.onrender.com"; 
  const targetUrl = BACKEND_URL + url.pathname + url.search;

  const modifiedRequest = new Request(targetUrl, request);
  return fetch(modifiedRequest);
}