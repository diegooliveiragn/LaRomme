'use client';

import Script from 'next/script';

export function Tracking() {
  return (
    <>
      {/* Script Global do Google Analytics */}
      <Script 
        strategy="afterInteractive" 
        src="https://www.googletagmanager.com/gtag/js?id=G-NGQME5BB8G" 
      />
      
      {/* Configuração do DataLayer */}
      <Script 
        id="google-analytics-config" 
        strategy="afterInteractive"
      >
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-NGQME5BB8G');
        `}
      </Script>
    </>
  );
}