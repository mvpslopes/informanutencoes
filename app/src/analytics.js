/** GA4 — mesmo ID do snippet em index.html */
export const GA_MEASUREMENT_ID = 'G-HGR7Q4C254'

/**
 * Envia page_view em navegação SPA (gtag já carregado no index.html).
 */
export function sendPageView(path) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return
  window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: path,
  })
}
