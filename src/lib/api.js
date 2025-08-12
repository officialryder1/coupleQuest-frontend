import { goto } from '$app/navigation';

const API_URL = import.meta.env.VITE_BACKEND_URL;

// const API_URL = "http://localhost:8000/api"

export async function fetchAPI(endpoint, method = 'GET', body = null) {
  const token = localStorage.getItem('access_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };

  const response = await fetch(`${API_URL}/${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null,
  });

  if (response.status === 401) {
    goto('/'); // Redirect if unauthorized
  }

  return await response.json();
}


// src/lib/auth.js
export function getSessionCookie() {
    // For Django's default session cookie name
    const cookieName = 'sessionid'; 
    // For CSRF token if needed
    const csrfCookieName = 'csrftoken';  

    const cookies = document.cookie.split(';');
    let sessionCookie = null;
    let csrfToken = null;

    cookies.forEach(cookie => {
        const [name, value] = cookie.trim().split('=');
        if (name === cookieName) {
            sessionCookie = value;
        }
        if (name === csrfCookieName) {
            csrfToken = value;
        }
    });

    return {
        sessionId: sessionCookie,
        csrfToken: csrfToken
    };
}

export function setSessionCookie(sessionId, csrfToken) {
    // Set with SameSite and Secure attributes for production
    const cookieSettings = `; Path=/; SameSite=Lax${window.location.protocol === 'https:' ? '; Secure' : ''}`;
    document.cookie = `sessionid=${sessionId}${cookieSettings}`;
    document.cookie = `csrftoken=${csrfToken}${cookieSettings}`;
}