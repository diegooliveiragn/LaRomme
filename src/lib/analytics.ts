// Camada de Abstração para Eventos (GA4 / Meta Pixel)
// Prepara o terreno sem inserir scripts pesados no Pre-Launch

export const trackEvent = (eventName: string, data?: Record<string, any>) => {
  if (typeof window === 'undefined') return;

  // Log de desenvolvimento (Mapeamento visual da jornada)
  if (process.env.NODE_ENV !== 'production') {
    console.log(`[Analytics] ${eventName.toUpperCase()}`, data || '');
  }

  // Se houver dataLayer do Google (Futuro GA4/GTM)
  const w = window as any;
  if (w.dataLayer) {
    w.dataLayer.push({ event: eventName, ...data });
  }

  // Se houver Pixel da Meta (Futuro fbq)
  if (w.fbq) {
    w.fbq('trackCustom', eventName, data);
  }
};