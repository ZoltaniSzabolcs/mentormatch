// This file catches ALL requests sent to /api/*
const BACKEND_URL = 'https://mentormatch-backend-l5ul.onrender.com';

async function handleRequest(context: { request: Request }) {
  const { request } = context;
  const url = new URL(request.url);

  // Example: converts https://localhost/api/auth/login
  // to https://mentormatch-backend.fly.dev/api/auth/login
  const targetUrl = BACKEND_URL + url.pathname + url.search;

  // Forward the exact request (including POST data, JWT headers, etc.)
  const modifiedRequest = new Request(targetUrl, request);
  const response = await fetch(modifiedRequest);

  // Lightweight debug signal to confirm the Worker handled the request.
  const headers = new Headers(response.headers);
  headers.set('x-worker-proxy', 'mentormatch');

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

export async function onRequestGet(context: { request: Request }) {
  return handleRequest(context);
}

export async function onRequestPost(context: { request: Request }) {
  return handleRequest(context);
}

export async function onRequestPut(context: { request: Request }) {
  return handleRequest(context);
}

export async function onRequestPatch(context: { request: Request }) {
  return handleRequest(context);
}

export async function onRequestDelete(context: { request: Request }) {
  return handleRequest(context);
}

export async function onRequestOptions(context: { request: Request }) {
  return handleRequest(context);
}
