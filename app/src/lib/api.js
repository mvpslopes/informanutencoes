import { apiUrl } from '../config.js'

export async function apiGet(path) {
  const r = await fetch(apiUrl(path), { credentials: 'include' })
  return r.json()
}

export async function apiPostJson(path, body) {
  const r = await fetch(apiUrl(path), {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  return r.json()
}

export async function apiPutJson(path, body) {
  const r = await fetch(apiUrl(path), {
    method: 'PUT',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  return r.json()
}

export async function apiDelete(path) {
  const r = await fetch(apiUrl(path), { method: 'DELETE', credentials: 'include' })
  return r.json()
}

/** multipart/form-data (ex.: upload de imagem) */
export async function apiPostForm(path, formData) {
  const r = await fetch(apiUrl(path), {
    method: 'POST',
    credentials: 'include',
    body: formData,
  })
  return r.json()
}
