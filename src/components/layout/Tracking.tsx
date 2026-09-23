'use client';

import Script from 'next/script';

export function Tracking() {
  return (
    <>
      {/* Módulo de Tracking (Meta Pixel / Google Analytics) */}
      <Script id="laromme-tracking" strategy="afterInteractive">
        {`console.log('[LaRomme Engine] Tracking infrastructure active.');`}
      </Script>
    </>
  );
}