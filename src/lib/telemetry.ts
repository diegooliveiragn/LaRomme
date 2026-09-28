export async function trackEvent(eventType: string, eventData: Record<string, any> = {}) {
  try {
    if (typeof window === 'undefined') return;

    const payload = {
      event_type: eventType,
      event_data: eventData,
      page_url: window.location.pathname,
      timestamp: new Date().toISOString()
    };

    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/telemetry', JSON.stringify(payload));
    } else {
      fetch('/api/telemetry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        keepalive: true
      }).catch(() => {});
    }
  } catch (e) {
    // Falha silenciosa para nao interferir na UX do cliente
  }
}