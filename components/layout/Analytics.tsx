"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { hasConsent, onConsentChange } from "@/lib/consent";

/**
 * GA4 loader. Renders nothing until the visitor has consented to analytics,
 * then loads gtag with Consent Mode defaults already set. Revoking consent
 * flips Consent Mode to denied; the tag stays loaded but stops collecting.
 */
export function Analytics({ ga4Id }: { ga4Id: string | null }) {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    setEnabled(hasConsent("analytics"));
    return onConsentChange((state) => {
      setEnabled(state.analytics);
      window.gtag?.("consent", "update", {
        analytics_storage: state.analytics ? "granted" : "denied",
        ad_storage: state.marketing ? "granted" : "denied",
        ad_user_data: state.marketing ? "granted" : "denied",
        ad_personalization: state.marketing ? "granted" : "denied",
      });
    });
  }, []);

  if (!ga4Id || !enabled) return null;

  return (
    <>
      <Script id="ga4-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = gtag;
gtag('consent', 'default', {analytics_storage: 'granted', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied'});
gtag('js', new Date());
gtag('config', '${ga4Id}', {anonymize_ip: true});`}
      </Script>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(ga4Id)}`} strategy="afterInteractive" />
    </>
  );
}
