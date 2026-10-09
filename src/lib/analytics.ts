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

export function getConsent(): AnalyticsConsent | null {
  try {
    const value = window.localStorage.getItem(CONSENT_STORAGE_KEY)
    return value === 'granted' || value === 'denied' ? value : null
  } catch {
    return null
  }
}

function storeConsent(value: AnalyticsConsent): void {
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

    const w = window as Window & { dataLayer?: unknown[] }
    const dataLayer = (w.dataLayer = w.dataLayer || [])
    // Canonical gtag shape: GTM reads consent commands from Arguments objects.
    function gtag(..._args: unknown[]) {
      dataLayer.push(arguments)
    }
    // Visitor consented to metrics only: keep advertising storage denied for
    // any Google tag configured in the container.
    gtag('consent', 'default', {
      analytics_storage: 'granted',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
    })
    dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' })

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

/** Stores the refusal. When GTM is already running, clears GA cookies and reloads to unload it. */
export function denyConsent(): void {
  const wasActive = gtmInitialized
  storeConsent('denied')
  if (!wasActive) return
  clearAnalyticsCookies()
  window.location.reload()
}

export function openPrivacyPreferences(): void {
  window.dispatchEvent(new Event(PRIVACY_OPEN_EVENT))
}

// Best-effort removal of GA first-party cookies (_ga, _ga_<id>, _gid, _gat*).
function clearAnalyticsCookies(): void {
  try {
    const names = document.cookie
      .split(';')
      .map((part) => part.split('=')[0].trim())
      .filter((name) => /^(_ga(_.+)?|_gid|_gat(_.+)?)$/.test(name))

    const labels = window.location.hostname.split('.')
    const domains: (string | null)[] = [null]
    for (let i = 0; i < labels.length - 1; i++) {
      domains.push(`.${labels.slice(i).join('.')}`)
    }

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
