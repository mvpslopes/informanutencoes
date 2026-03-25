/** Base da API PHP (mesmo domínio em produção: pasta /api no Hostinger) */
export const API_BASE = (import.meta.env.VITE_API_BASE || '/api').replace(/\/$/, '')

export function apiUrl(file) {
  const f = file.replace(/^\//, '')
  return `${API_BASE}/${f}`
}
