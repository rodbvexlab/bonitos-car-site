// Consent-gated Google Tag Manager loader.
// GTM (and therefore any GA4 tag configured inside it) is only injected after
// the visitor explicitly grants analytics consent. No tracking IDs other than
// the GTM container live in code; GA4 is configured in the GTM workspace.

export type AnalyticsConsent = 'granted' | 'denied'

export const CONSENT_STORAGE_KEY = 'bonitoscar_analytics_consent'
export const PRIVACY_OPEN_EVENT = 'bonitoscar:privacy-preferences'

const DEFAULT_GTM_ID = 'GTM-WBNHKVGV'
const GTM_ID_PATTERN = /^GTM-[A-Z0-9]+$/

// Unset → default container. Empty string → GTM disabled on purpose.
function resolveGtmId(): string | null {
  const raw = import.meta.env.VITE_GTM_ID
  const id = (raw === undefined ? DEFAULT_GTM_ID : raw).trim()
  return GTM_ID_PATTERN.test(id) ? id : null
}

let gtmInitialized = false

type DataLayerWindow = Window & { dataLayer?: unknown[] }

// Canonical gtag shape: GTM only processes consent commands pushed as
// Arguments objects, in order, before the tags that depend on them.
function gtag(..._args: unknown[]): void {
  const w = window as DataLayerWindow
  ;(w.dataLayer = w.dataLayer || []).push(arguments)
}

// Choice made on this page load. Takes precedence over storage so an explicit
// choice works even when localStorage is unavailable or a write fails; it is
// lost on reload, which falls back to the safe "no consent" state.
let pageConsent: AnalyticsConsent | null = null

export function getConsent(): AnalyticsConsent | null {
  if (pageConsent) return pageConsent
  try {
    const value = window.localStorage.getItem(CONSENT_STORAGE_KEY)
    return value === 'granted' || value === 'denied' ? value : null
  } catch {
    return null
  }
}

function storeConsent(value: AnalyticsConsent): void {
  pageConsent = value
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, value)
  } catch {
    // Storage unavailable (private mode, blocked site data): the choice
    // applies to the current page view only.
  }
}

/** Loads GTM once, and only when consent is granted. Never throws. */
export function initAnalytics(): void {
  try {
    if (gtmInitialized || getConsent() !== 'granted') return
    const gtmId = resolveGtmId()
    if (!gtmId) return

    // Consent Mode v2: everything denied by default, then only analytics
    // storage is granted. Both commands sit in the dataLayer ahead of the
    // gtm.js event, so GTM applies them before any tag fires. Advertising
    // signals stay denied: the visitor consented to metrics only.
    gtag('consent', 'default', {
      analytics_storage: 'denied',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
    })
    gtag('set', 'ads_data_redaction', true)
    gtag('consent', 'update', { analytics_storage: 'granted' })
    const w = window as DataLayerWindow
    ;(w.dataLayer = w.dataLayer || []).push({ 'gtm.start': Date.now(), event: 'gtm.js' })

    if (!document.querySelector(`script[src*="googletagmanager.com/gtm.js?id=${gtmId}"]`)) {
      const script = document.createElement('script')
      script.async = true
      script.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(gtmId)}`
      document.head.appendChild(script)
    }
    gtmInitialized = true
  } catch {
    // Analytics must never break navigation.
  }
}

export function grantConsent(): void {
  storeConsent('granted')
  initAnalytics()
}

/**
 * Stores the refusal. When GTM is already running, signals the denial to the
 * loaded tags, clears GA cookies and reloads so GTM is no longer on the page.
 */
export function denyConsent(): void {
  const wasActive = gtmInitialized
  storeConsent('denied')
  if (!wasActive) return
  try {
    gtag('consent', 'update', { analytics_storage: 'denied' })
  } catch {
    // Reload below unloads GTM regardless.
  }
  clearAnalyticsCookies()
  window.location.reload()
}

export function openPrivacyPreferences(): void {
  window.dispatchEvent(new Event(PRIVACY_OPEN_EVENT))
}

// Registrable domain of the production site. Cookie removal never goes above
// it, so public suffixes such as ".com.br" are never targeted.
const SITE_COOKIE_DOMAIN = 'bonitoscar.com.br'

// Domains a GA cookie for the current host can live on: host-only, the host
// itself, and its parents down to SITE_COOKIE_DOMAIN. On any other host
// (localhost, preview domains) only the host itself is tried.
function analyticsCookieDomains(hostname: string): (string | null)[] {
  const host = hostname.toLowerCase()
  const domains: (string | null)[] = [null]
  if (host !== SITE_COOKIE_DOMAIN && !host.endsWith(`.${SITE_COOKIE_DOMAIN}`)) {
    if (host.includes('.')) domains.push(`.${host}`)
    return domains
  }
  const labels = host.split('.')
  const minLabels = SITE_COOKIE_DOMAIN.split('.').length
  for (let i = 0; labels.length - i >= minLabels; i++) {
    domains.push(`.${labels.slice(i).join('.')}`)
  }
  return domains
}

// Best-effort removal of Google Analytics first-party cookies readable from
// JS: _ga, _ga_<id>, _gid and _gat*. Any other cookie is left untouched. GA
// sets them with path "/" on the widest allowed domain (.bonitoscar.com.br in
// production). HttpOnly or non-"/" path cookies are out of reach and
// documented in docs/ANALYTICS.md.
function clearAnalyticsCookies(): void {
  try {
    const names = document.cookie
      .split(';')
      .map((part) => part.split('=')[0].trim())
      .filter((name) => /^(_ga(_.+)?|_gid|_gat(_.+)?)$/.test(name))

    const domains = analyticsCookieDomains(window.location.hostname)
    const expired = 'expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/'
    for (const name of names) {
      for (const domain of domains) {
        document.cookie = `${name}=; ${expired}${domain ? `; domain=${domain}` : ''}`
      }
    }
  } catch {
    // Best effort only.
  }
}
