"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: Record<string, unknown>) => string;
      reset: (id?: string) => void;
      remove: (id: string) => void;
    };
  }
}

const SCRIPT = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

/**
 * Cloudflare Turnstile, explicit render. The widget injects a hidden input
 * named `cf-turnstile-response` into the form; the server action verifies it.
 */
export function Turnstile({ siteKey, resetKey }: { siteKey: string; resetKey: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!ready || !ref.current || !window.turnstile) return;
    const el = ref.current;
    widgetId.current = window.turnstile.render(el, {
      sitekey: siteKey,
      "response-field-name": "cf-turnstile-response",
      appearance: "always",
      size: "flexible",
    });
    return () => {
      if (widgetId.current) window.turnstile?.remove(widgetId.current);
      widgetId.current = null;
    };
  }, [ready, siteKey]);

  useEffect(() => {
    if (resetKey > 0 && widgetId.current) window.turnstile?.reset(widgetId.current);
  }, [resetKey]);

  return (
    <>
      <Script src={SCRIPT} strategy="afterInteractive" onLoad={() => setReady(true)} onReady={() => setReady(true)} />
      <div ref={ref} />
    </>
  );
}
